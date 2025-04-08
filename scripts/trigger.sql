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
            `is_deleted` = false
            AND (
                (NEW.`start_at` BETWEEN `start_at` AND `end_at`) 
                OR (NEW.`end_at` BETWEEN `start_at` AND `end_at`) 
                OR (`start_at` BETWEEN NEW.`start_at` AND NEW.`end_at`) 
                OR (`end_at` BETWEEN NEW.`start_at` AND NEW.`end_at`)
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
            `id` != NEW.id
            AND `is_deleted` = false
            AND (
                (NEW.`start_at` BETWEEN `start_at` AND `end_at`) 
                OR (NEW.`end_at` BETWEEN `start_at` AND `end_at`) 
                OR (`start_at` BETWEEN NEW.`start_at` AND NEW.`end_at`) 
                OR (`end_at` BETWEEN NEW.`start_at` AND NEW.`end_at`)
            )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sale event overlaps with an existing event.';
    END IF;
END //
DELIMITER ;