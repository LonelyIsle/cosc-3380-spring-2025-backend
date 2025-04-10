-- EMPLOYEE --
-- prevent staff hourly rate from being higher than manager hourly rate --
DROP TRIGGER IF EXISTS `insert_prevent_staff_hourly_rate_above_manager`;
DELIMITER //
CREATE TRIGGER `insert_prevent_staff_hourly_rate_above_manager`
BEFORE INSERT ON `employee`
FOR EACH ROW
BEGIN
    DECLARE manager_min_hourly_rate DECIMAL(12, 2);
    
    IF NEW.`role` = 0 THEN
        SELECT MIN(`hourly_rate`) INTO manager_min_hourly_rate FROM `employee` WHERE `role` = 1 AND `is_deleted` = false;
        IF NEW.`hourly_rate` >= manager_min_hourly_rate THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Staff hourly rate cannot be higher than the minimum hourly rate of managers.';
        END IF;
    END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `update_prevent_staff_hourly_rate_above_manager`;
DELIMITER //
CREATE TRIGGER `update_prevent_staff_hourly_rate_above_manager`
BEFORE UPDATE ON `employee`
FOR EACH ROW
BEGIN
    DECLARE manager_min_hourly_rate DECIMAL(12, 2);
    
    IF NEW.`role` = 0 THEN
        SELECT MIN(`hourly_rate`) INTO manager_min_hourly_rate FROM `employee` WHERE `id` <> NEW.`id` AND`role` = 1 AND `is_deleted` = false;
        IF NEW.`hourly_rate` >= manager_min_hourly_rate THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Staff hourly rate cannot be higher than the minimum hourly rate of managers.';
        END IF;
    END IF;
END //
DELIMITER ;

-- prevent manager hourly rate from being lower than staff hourly rate --
DROP TRIGGER IF EXISTS `insert_prevent_manager_hourly_rate_below_staff`;
DELIMITER //
CREATE TRIGGER `insert_prevent_manager_hourly_rate_below_staff`
BEFORE INSERT ON `employee`
FOR EACH ROW
BEGIN
    DECLARE staff_max_hourly_rate DECIMAL(12, 2);
    
    IF NEW.`role` = 1 THEN
        SELECT MAX(`hourly_rate`) INTO staff_max_hourly_rate FROM `employee` WHERE `role` = 0 AND `is_deleted` = false;
        IF NEW.`hourly_rate` <= staff_max_hourly_rate THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Manager hourly rate cannot be lower than the maximum hourly rate of staffs.';
        END IF;
    END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `update_prevent_manager_hourly_rate_below_staff`;
DELIMITER //
CREATE TRIGGER `update_prevent_manager_hourly_rate_below_staff`
BEFORE UPDATE ON `employee`
FOR EACH ROW
BEGIN
    DECLARE staff_max_hourly_rate DECIMAL(12, 2);
    
    IF NEW.`role` = 1 THEN
        SELECT MAX(`hourly_rate`) INTO staff_max_hourly_rate FROM `employee` WHERE `id` <> NEW.`id` AND`role` = 0 AND `is_deleted` = false;
        IF NEW.`hourly_rate` <= staff_max_hourly_rate THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Manager hourly rate cannot be lower than the maximum hourly rate of staffs.';
        END IF;
    END IF;
END //
DELIMITER ;

-- PRODUCT and NOTIFICATION --
-- create a notifcation for each manager if a product quantity falls below or equals its threshold --
DROP TRIGGER IF EXISTS `insert_notify_low_quantity`;
DELIMITER //
CREATE TRIGGER `insert_notify_low_quantity`
AFTER INSERT ON `product`
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE manager_id INT;
    DECLARE manager_cursor CURSOR FOR 
        SELECT `id` FROM `employee` WHERE `role` = 1 AND `is_deleted` = false;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    IF NEW.`quantity` <= NEW.`threshold` THEN
        OPEN manager_cursor;
        
        read_loop: LOOP
            FETCH manager_cursor INTO manager_id;
            IF done THEN
                LEAVE read_loop;
            END IF;
            INSERT INTO `notification`(`status`, `employee_id`, `title`, `description`)
                VALUES (
                    0,
                    manager_id,
                    CONCAT('Product ', NEW.`name`, ' (', NEW.`id`,')', ' needs to be reordered.'), 
                    CONCAT('Product ', NEW.`name`, ' (', NEW.`id`,')', ' has quantity ', NEW.`quantity`,' which is less than or equal to the threshold of ', NEW.`threshold`, ' and needs to be reordered.')
                );
        END LOOP;
        
        CLOSE manager_cursor;
    END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `update_notify_low_quantity`;
DELIMITER //
CREATE TRIGGER `update_notify_low_quantity`
AFTER UPDATE ON product
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE manager_id INT;
    DECLARE manager_cursor CURSOR FOR 
        SELECT `id` FROM `employee` WHERE `role` = 1 AND `is_deleted` = false;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    IF NEW.`quantity` <= NEW.`threshold` AND OLD.`quantity` > OLD.`threshold` THEN
        OPEN manager_cursor;
        
        read_loop: LOOP
            FETCH manager_cursor INTO manager_id;
            IF done THEN
                LEAVE read_loop;
            END IF;
            INSERT INTO `notification`(`status`, `employee_id`, `title`, `description`)
                VALUES (
                    0,
                    manager_id,
                    CONCAT('Product ', NEW.`name`, ' (', NEW.`id`,')', ' needs to be reordered.'), 
                    CONCAT('Product ', NEW.`name`, ' (', NEW.`id`,')', ' has quantity ', NEW.`quantity`,' which is less than or equal to the threshold of ', NEW.`threshold`, ' and needs to be reordered.')
                );
        END LOOP;
        
        CLOSE manager_cursor;
    END IF;
END //
DELIMITER ;

-- SALE_EVENT and COUPON --
-- prevent sale events from overlapping --
DROP TRIGGER IF EXISTS `insert_prevent_sale_event_overlap`;
DELIMITER //
CREATE TRIGGER `insert_prevent_sale_event_overlap`
BEFORE INSERT ON `sale_event` 
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM `sale_event`
        WHERE 
            `sale_event`.`is_deleted` = false
            AND (
                (NEW.`start_at` BETWEEN `sale_event`.`start_at` AND `sale_event`.`end_at`) 
                OR (NEW.`end_at` BETWEEN `sale_event`.`start_at` AND `sale_event`.`end_at`) 
                OR (`sale_event`.`start_at` BETWEEN NEW.`start_at` AND NEW.`end_at`) 
                OR (`sale_event`.`end_at` BETWEEN NEW.`start_at` AND NEW.`end_at`)
            )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sale event overlaps with an existing event.';
    END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `update_prevent_sale_event_overlap`;
DELIMITER //
CREATE TRIGGER `update_prevent_sale_event_overlap`
BEFORE UPDATE ON `sale_event` 
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM `sale_event`
        WHERE 
            `sale_event`.`id` <> NEW.`id`
            AND `sale_event`.`is_deleted` = false
            AND (
                (NEW.`start_at` BETWEEN `sale_event`.`start_at` AND `sale_event`.`end_at`) 
                OR (NEW.`end_at` BETWEEN `sale_event`.`start_at` AND `sale_event`.`end_at`) 
                OR (`sale_event`.`start_at` BETWEEN NEW.`start_at` AND NEW.`end_at`) 
                OR (`sale_event`.`end_at` BETWEEN NEW.`start_at` AND NEW.`end_at`)
            )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sale event overlaps with an existing event.';
    END IF;
END //
DELIMITER ;