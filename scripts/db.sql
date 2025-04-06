-- Disable FOREIGN KEY check

SET FOREIGN_KEY_CHECKS = 0;

-- Create Tables

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `sku` VARCHAR(255) NOT NULL UNIQUE,
    `price` DECIMAL(12, 2) NOT NULL,
    `quantity` INT NOT NULL,
    `threshold` INT NOT NULL DEFAULT -1,
    `name` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `image` LONGBLOB,
    `image_extension` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `product-check-price` CHECK ((`price` >= 0)),
    CONSTRAINT `product-check-quantity` CHECK ((`quantity` >= 0))
);

DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `product_category-unique-product_id-category_id` UNIQUE (`product_id`, `category_id`)
);

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL UNIQUE,
    `value` DECIMAL(12, 2) NOT NULL,
    `start_at` TIMESTAMP NOT NULL,
    `end_at` TIMESTAMP NOT NULL,
    `type` INT NOT NULL DEFAULT 0, -- 0: percentage, 1: fixed amount
    `description` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `coupon-check-value` CHECK (`value` >= 0),
    CONSTRAINT `coupon-check-start_at-end_at` CHECK (`end_at` >= `start_at`)
);

DROP TABLE IF EXISTS `sale_event`;
CREATE TABLE `sale_event` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `coupon_id` INT NOT NULL UNIQUE, -- 1:1 relationship
    `start_at` TIMESTAMP NOT NULL,
    `end_at` TIMESTAMP NOT NULL,
    `title` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `sale_event-check-start_at-end_at` CHECK (`end_at` >= `start_at`)
);

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `middle_name` VARCHAR(255),
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` LONGTEXT NOT NULL,
    `role` INT NOT NULL DEFAULT 0, -- 0: staff, 1: manager
    `hourly_rate` DECIMAL(12, 2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `employee-check-email` CHECK (`email` REGEXP '^.+@.+$')
);

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `middle_name` VARCHAR(255),
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` LONGTEXT NOT NULL,
    `reset_password_question` LONGTEXT NOT NULL,
    `reset_password_answer` LONGTEXT NOT NULL,
    `shipping_address_1` VARCHAR(255),
    `shipping_address_2` VARCHAR(255),
    `shipping_address_city` VARCHAR(255),
    `shipping_address_state` VARCHAR(255),
    `shipping_address_zip` VARCHAR(255),
    `billing_address_1` VARCHAR(255),
    `billing_address_2` VARCHAR(255),
    `billing_address_city` VARCHAR(255),
    `billing_address_state` VARCHAR(255),
    `billing_address_zip` VARCHAR(255),
    `card_name` VARCHAR(255),
    `card_number` VARCHAR(255),
    `card_expire_month` VARCHAR(255),
    `card_expire_year` VARCHAR(255),
    `card_code` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `customer-check-email` CHECK (`email` REGEXP '^.+@.+$')
);

DROP TABLE IF EXISTS `subscription`;
CREATE TABLE `subscription` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `start_at` TIMESTAMP NOT NULL,
    `end_at` TIMESTAMP NOT NULL,
    `billing_address_1` VARCHAR(255) NOT NULL,
    `billing_address_2` VARCHAR(255),
    `billing_address_city` VARCHAR(255) NOT NULL,
    `billing_address_state` VARCHAR(255) NOT NULL,
    `billing_address_zip` VARCHAR(255) NOT NULL,
    `card_name` VARCHAR(255) NOT NULL,
    `card_number` VARCHAR(255) NOT NULL,
    `card_expire_month` VARCHAR(255) NOT NULL,
    `card_expire_year` VARCHAR(255) NOT NULL,
    `card_code` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `subscription-check-price` CHECK (`price` >= 0),
    CONSTRAINT `subscription-check-start_at-end_at` CHECK (`end_at` >= `start_at`)
);

DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT,
    `customer_first_name` VARCHAR(255) NOT NULL,
    `customer_middle_name` VARCHAR(255),
    `customer_last_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `subscription_id` INT,
    `subscription_discount_percentage` DECIMAL(5, 4),
    `coupon_id` INT,
    `coupon_value` DECIMAL(12, 2),
    `coupon_type` INT DEFAULT 0,
    `shipping_fee` DECIMAL(12, 2) NOT NULL,
    `sale_tax` DECIMAL(5, 4) NOT NULL,
    `tracking` LONGTEXT,
    `status` INT NOT NULL DEFAULT 0, -- -1: cancelled, 0: placed, 1: shipped
    `shipping_address_1` VARCHAR(255) NOT NULL,
    `shipping_address_2` VARCHAR(255),
    `shipping_address_city` VARCHAR(255) NOT NULL,
    `shipping_address_state` VARCHAR(255) NOT NULL,
    `shipping_address_zip` VARCHAR(255) NOT NULL,
    `billing_address_1` VARCHAR(255) NOT NULL,
    `billing_address_2` VARCHAR(255),
    `billing_address_city` VARCHAR(255) NOT NULL,
    `billing_address_state` VARCHAR(255) NOT NULL,
    `billing_address_zip` VARCHAR(255) NOT NULL,
    `card_name` VARCHAR(255) NOT NULL,
    `card_number` VARCHAR(255) NOT NULL,
    `card_expire_month` VARCHAR(255) NOT NULL,
    `card_expire_year` VARCHAR(255) NOT NULL,
    `card_code` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `order_product`;
CREATE TABLE `order_product` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `quantity` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT `order_product-check-price` CHECK ((`price` >= 0)),
    CONSTRAINT `order_product-check-quantity` CHECK ((`quantity` >= 0)),
    CONSTRAINT `order_product-unique-order_id-product_id` UNIQUE (`order_id`, `product_id`)
);

DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `employee_id` INT NOT NULL,
    `title` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `status` INT NOT NULL DEFAULT 0, -- 0: unread, 1: read
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `key` LONGTEXT NOT NULL,
    `value` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

-- Create FOREIGN KEY constraints  

ALTER TABLE `product_category` ADD CONSTRAINT `product_category-fk-product_id-product-id` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`);
ALTER TABLE `product_category` ADD CONSTRAINT `product_category-fk-category_id-category-id` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`);

ALTER TABLE `subscription` ADD CONSTRAINT `subscription-fk-customer_id-customer-id` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`);

ALTER TABLE `order` ADD CONSTRAINT `order-fk-customer_id-customer-id` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`);
ALTER TABLE `order` ADD CONSTRAINT `order-fk-coupon_id-coupon-id` FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`);
ALTER TABLE `order` ADD CONSTRAINT `order-fk-subscription_id-subscription-id` FOREIGN KEY (`subscription_id`) REFERENCES `subscription`(`id`);

ALTER TABLE `order_product` ADD CONSTRAINT `order_product-fk-order_id-order-id` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`);
ALTER TABLE `order_product` ADD CONSTRAINT `order_product-fk-product_id-product-id` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`);

ALTER TABLE `notification` ADD CONSTRAINT `notification-fk-employee_id-employee-id` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`);

ALTER TABLE `sale_event` ADD CONSTRAINT `sale_event-fk-coupon_id-coupon-id` FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`); -- 1:1 relationship

-- Enable FOREIGN KEY check

SET FOREIGN_KEY_CHECKS = 1;

