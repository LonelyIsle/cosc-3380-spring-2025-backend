-- EMPLOYEE --
INSERT INTO `employee` (`first_name`, `last_name`, `role`, `hourly_rate`, `email`, `password`) VALUES ('Chad', 'Gilmore', 1, 30.00, 'manager@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.'); -- 123456
INSERT INTO `employee` (`first_name`, `last_name`, `role`, `hourly_rate`, `email`, `password`) VALUES ('Peter', 'Parker', 0, 15.00, 'staff@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.'); -- 123456
INSERT INTO `employee` (`first_name`, `last_name`, `role`, `hourly_rate`, `email`, `password`) VALUES ('Aria', 'Park', 1, 30.00, 'employee@example.com', '$2b$10$o8xtDsSqut4PMZx7HLBgP.TcgNokt1J/K08X75Iu9SyCfMF3GIGbW'); -- Password123

-- CUSTOMER -- 
INSERT INTO `customer` (`first_name`, `last_name`, `email`, `password`, `reset_password_question`, `reset_password_answer`) VALUES ('John', 'Cena', 'customer@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'); -- 123456, 50
INSERT INTO `customer` (`first_name`, `last_name`, `email`, `password`, `reset_password_question`, `reset_password_answer`) VALUES ('Ava', 'Dean', 'somerandom@gmail.com', '$2b$10$nD53mm4ndgrdeMwpLkMsbOwlXVIKY34/nxSb1swYO.Udt3/Pcl9fm', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'); -- IWant2Login!, 50

-- CONFIG --
INSERT INTO `config` (`key`, `value`) VALUES ('SUBSCRIPTION_VALUE', 0.2);
INSERT INTO `config` (`key`, `value`) VALUES ('SHIPPING_FEE', 9.99);
INSERT INTO `config` (`key`, `value`) VALUES ('SALE_TAX', 0.08);

-- CATEGORY --
INSERT INTO `category` (`id`, `name`, `description`)
VALUES
(1, 'Animals', 'Teh things that walk among us.'),
(2, 'Anime', 'Japanese Cartoons'),
(3, 'Movies & TV Shows', 'Films and shows that appear on tv or theatres.');

-- PRODUCT_CATEGORY --
INSERT INTO `product_category` (`product_id`, `category_id`)
VALUES 
(1,2),
(2,2),
(3,2),
(4,1),
(5,3),
(6,2),
(7,1),
(8,2),
(9,1),
(10,1),
(11,2),
(12,1),
(13,2),
(14,1),
(15,2),
(16,1),
(17,2),
(18,1),
(19,2),
(20,1),
(21,2),
(22,1),
(23,2),
(24,1),
(25,2),
(26,1),
(27,2),
(28,1),
(29,2),
(30,1),
(31,2),
(32,1),
(33,3),
(34,1),
(35,2),
(36,1),
(37,2),
(38,1),
(39,2),
(40,1),
(41,2),
(42,1),
(43,2),
(44,1),
(45,2),
(46,1),
(47,2),
(48,1),
(49,2),
(50,1),
(51,2);