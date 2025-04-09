-- prevent sale events from overlapping --
DROP TRIGGER IF EXISTS `before_sale_event_insert_prevent_overlap`;
DELIMITER //
CREATE TRIGGER `before_sale_event_insert_prevent_overlap`
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

DROP TRIGGER IF EXISTS `before_sale_event_update_prevent_overlap`;
DELIMITER //
CREATE TRIGGER `before_sale_event_update_prevent_overlap`
BEFORE UPDATE ON `sale_event` 
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM `sale_event`
        WHERE 
            `sale_event`.`id` != NEW.id
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

-- synchronize the start_at and end_at of the sale event with the referenced coupon. --
DROP TRIGGER IF EXISTS `after_sale_event_insert_sync_coupon_date`;
DELIMITER //
CREATE TRIGGER `after_sale_event_insert_sync_coupon_date`
AFTER INSERT ON `sale_event` 
FOR EACH ROW
BEGIN
    UPDATE `coupon`
    SET `coupon`.`start_at` = NEW.`start_at`,
        `coupon`.`end_at` = NEW.`end_at`
    WHERE `coupon`.`id` = NEW.`coupon_id` AND `coupon`.`is_deleted` = false;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS `after_sale_event_update_sync_coupon_date`;
DELIMITER //
CREATE TRIGGER `after_sale_event_update_sync_coupon_date`
AFTER UPDATE ON `sale_event` 
FOR EACH ROW
BEGIN
    UPDATE `coupon`
    SET `coupon`.`start_at` = NEW.`start_at`,
        `coupon`.`end_at` = NEW.`end_at`
    WHERE `coupon`.`id` = NEW.`coupon_id` AND `coupon`.`is_deleted` = false;
END //
DELIMITER ;