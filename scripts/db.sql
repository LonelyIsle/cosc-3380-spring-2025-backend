-- Disable FOREIGN KEY check
-- An unsafe way to prevent errors when dropping tables that have existing data. 

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
    `thumbnail_image` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CHECK (`price` >= 0),
    CHECK (`quantity` >= 0)
);

DROP TABLE IF EXISTS `product_image`;
CREATE TABLE `product_image` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT,
    `name` LONGTEXT NOT NULL,
    `extension` VARCHAR(255) NOT NULL, 
    `order` INT NOT NULL DEFAULT -1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
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
    `type` INT NOT NULL DEFAULT 0,
    `description` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CHECK (`value` >= 0)
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
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `middle_name` VARCHAR(255),
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` LONGTEXT NOT NULL,
    `role` INT NOT NULL DEFAULT 0,
    `hourly_rate` DECIMAL(12, 2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CHECK (`email` REGEXP '^.+@.+$')
);

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `middle_name` VARCHAR(255),
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` LONGTEXT NOT NULL,
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
    CHECK (`email` REGEXP '^.+@.+$')
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
    CHECK (`price` >= 0)
);

DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT,
    `email` VARCHAR(255) NOT NULL,
    `is_subscription` BOOLEAN NOT NULL DEFAULT false,
    `tracking_info` LONGTEXT,
    `status` INT NOT NULL DEFAULT 0,
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

DROP TABLE IF EXISTS `order_coupon`;
CREATE TABLE `order_coupon` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `coupon_id` INT NOT NULL,
    `value` DECIMAL(12, 2) NOT NULL,
    `type` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    CHECK (`value` >= 0)
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
    CHECK (`price` >= 0),
    CHECK (`quantity` >= 0)
);

DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `employee_id` INT NOT NULL,
    `title` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `type` INT NOT NULL DEFAULT 0,
    `status` INT NOT NULL DEFAULT 0,
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

ALTER TABLE `product_image` ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`);

ALTER TABLE `product_category` ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`);
ALTER TABLE `product_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category`(`id`);

ALTER TABLE `subscription` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`);

ALTER TABLE `order_coupon` ADD FOREIGN KEY (`order_id`) REFERENCES `order`(`id`);
ALTER TABLE `order_coupon` ADD FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`);

ALTER TABLE `order_product` ADD FOREIGN KEY (`order_id`) REFERENCES `order`(`id`);
ALTER TABLE `order_product` ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`);

ALTER TABLE `notification` ADD FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`);

ALTER TABLE `sale_event` ADD FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`); -- 1:1 relationship

-- Enable FOREIGN KEY check

SET FOREIGN_KEY_CHECKS = 1;

