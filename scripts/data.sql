-- EMPLOYEE --
INSERT INTO `employee` (`id`, `first_name`, `last_name`, `role`, `hourly_rate`, `email`, `password`) 
VALUES 
(1, 'Chad', 'Gilmore', 1, 30.00, 'manager@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.'), -- 123456
(2, 'Peter', 'Parker', 0, 15.00, 'staff@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.'), -- 123456
(3, 'Aria', 'Park', 1, 30.00, 'employee@example.com', '$2b$10$o8xtDsSqut4PMZx7HLBgP.TcgNokt1J/K08X75Iu9SyCfMF3GIGbW'); -- Password123

-- CUSTOMER -- 
INSERT INTO `customer` (`id`, `first_name`, `last_name`, `email`, `password`, `reset_password_question`, `reset_password_answer`) 
VALUES 
(1, 'John', 'Cena', 'customer@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(2, 'James', 'Bond', 'customer_sub@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(3, 'Ava', 'Dean', 'somerandom@gmail.com', '$2b$10$nD53mm4ndgrdeMwpLkMsbOwlXVIKY34/nxSb1swYO.Udt3/Pcl9fm', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'); -- IWant2Login!, 50

-- SUBSCRIPTION --
INSERT INTO `subscription` (`id`, `customer_id`, `price`, `start_at`, `end_at`, `billing_address_1`, `billing_address_city`, `billing_address_state`, `billing_address_zip`, `card_name`, `card_number`, `card_expire_month`, `card_expire_year`, `card_code`)
VALUES
(1, 2, 10.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '123 street dr', 'Houston', 'TX', '70001', 'John Cena', '4242424242424242', '02', '2030', '456');

-- CONFIG --
INSERT INTO `config` (`id`, `key`, `value`) 
VALUES 
(1, 'subscription_discount_percentage', 0.2),
(2, 'shipping_fee', 9.99),
(3, 'sale_tax', 0.0825),
(4, 'subscription_price', 10.00);

-- COUPON --
INSERT INTO `coupon` (`id`, `code`, `value`, `start_at`, `end_at`, `type`, `description`)
VALUES
(1, '20PERCENT', 0.20, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 0, '20%'),
(2, '20BUCKS', 20.00, DATE_ADD(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 1, '20.00$');

-- SALE_EVENT --
INSERT INTO `sale_event` (`id`, `coupon_id`, `start_at`, `end_at`, `title`, `description`)
VALUES
(1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), '20% OFF ALL ITEMS!', '20% OFF ALL ITEMS!'),
(2, 2, DATE_ADD(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), '20$ OFF ALL ITEMS!', '20$ OFF ALL ITEMS!');

-- CATEGORY --
INSERT INTO `category` (`id`, `name`, `description`)
VALUES
(1, 'Animals', 'Teh things that walk among us.'),
(2, 'Anime', 'Japanese Cartoons'),
(3, 'Movies & TV Shows', 'Films and shows that appear on tv or theatres.');

-- PRODUCT_CATEGORY --
INSERT INTO `product_category` (`id`, `product_id`, `category_id`)
VALUES 
(1, 1, 2),
(2, 2, 2),
(3, 3, 2),
(4, 4, 1),
(5, 5, 3),
(6, 6, 2),
(7, 7, 1),
(8, 8, 2),
(9, 9, 1),
(10, 10, 1),
(11, 11, 2),
(12, 12, 1),
(13, 13, 2),
(14, 14, 1),
(15, 15, 2),
(16, 16, 1),
(17, 17, 2),
(18, 18, 1),
(19, 19, 2),
(20, 20, 1),
(21, 21, 2),
(22, 22, 1),
(23, 23, 2),
(24, 24, 1),
(25, 25, 2),
(26, 26, 1),
(27, 27, 2),
(28, 28, 1),
(29, 29, 2),
(30, 30, 1),
(31, 31, 2),
(32, 32, 1),
(33, 33, 3),
(34, 34, 1),
(35, 35, 2),
(36, 36, 1),
(37, 37, 2),
(38, 38, 1),
(39, 39, 2),
(40, 40, 1),
(41, 41, 2),
(42, 42, 1),
(43, 43, 2),
(44, 44, 1),
(45, 45, 2),
(46, 46, 1),
(47, 47, 2),
(48, 48, 1),
(49, 49, 2),
(50, 50, 1),
(51, 51, 2);