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
