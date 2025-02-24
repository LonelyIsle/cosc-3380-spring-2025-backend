-- Disable FOREIGN KEY check
-- An unsafe way to prevent errors when dropping tables that have existing data. 

SET FOREIGN_KEY_CHECKS = 0;

-- Create Tables

DROP TABLE IF EXISTS `Product`;
CREATE TABLE `Product` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `sku` VARCHAR(255) NOT NULL UNIQUE,
    `price` DECIMAL(10, 2) UNSIGNED NOT NULL ,
    `quantity` INT UNSIGNED NOT NULL ,
    `threshold` INT NOT NULL DEFAULT -1,
    `name` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `thumbnail_image` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Product_image`;
CREATE TABLE `Product_image` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT,
    `name` LONGTEXT NOT NULL,
    `extension` VARCHAR(255) NOT NULL, 
    `order` INT NOT NULL DEFAULT -1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Product_Category`;
CREATE TABLE `Product_Category` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Category`;
CREATE TABLE `Category` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Coupon`;
CREATE TABLE `Coupon` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL UNIQUE,
    `value` DECIMAL(10, 2) UNSIGNED NOT NULL,
    `type` INT NOT NULL DEFAULT 0,
    `description` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Employee`;
CREATE TABLE `Employee` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `middle_name` VARCHAR(255),
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` LONGTEXT NOT NULL,
    `role` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Customer`;
CREATE TABLE `Customer` (
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
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Subscription`;
CREATE TABLE `Subscription` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT NOT NULL,
    `price` DECIMAL(10, 2) UNSIGNED NOT NULL,
    `start_at` TIMESTAMP NOT NULL,
    `end_at` TIMESTAMP NOT NULL,
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
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT,
    `email` VARCHAR(255) NOT NULL,
    `is_subscription` BOOLEAN NOT NULL DEFAULT false,
    `tracking_info` LONGTEXT,
    `status` INT NOT NULL DEFAULT 0,
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
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Order_Coupon`;
CREATE TABLE `Order_Coupon` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `coupon_id` INT NOT NULL,
    `value` DECIMAL(10, 2) UNSIGNED NOT NULL,
    `type` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Order_Product`;
CREATE TABLE `Order_Product` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `price` DECIMAL(10, 2) UNSIGNED NOT NULL,
    `quantity` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Notification`;
CREATE TABLE `Notification` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `employee_id` INT NOT NULL,
    `title` LONGTEXT NOT NULL,
    `description` LONGTEXT,
    `type` INT NOT NULL DEFAULT 0,
    `status` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS `Config`;
CREATE TABLE `Config` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `key` LONGTEXT NOT NULL,
    `value` LONGTEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false
);

-- Create FOREIGN KEY constraints  

ALTER TABLE `Product_image` ADD FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`);

ALTER TABLE `Product_Category` ADD FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`);
ALTER TABLE `Product_Category` ADD FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`);

ALTER TABLE `Subscription` ADD FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`customer_id`) REFERENCES `Order`(`id`);

ALTER TABLE `Order_Coupon` ADD FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`);
ALTER TABLE `Order_Coupon` ADD FOREIGN KEY (`coupon_id`) REFERENCES `Coupon`(`id`);

ALTER TABLE `Order_Product` ADD FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`);
ALTER TABLE `Order_Product` ADD FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`);

ALTER TABLE `Notification` ADD FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`);

-- Enable FOREIGN KEY check

SET FOREIGN_KEY_CHECKS = 1;








