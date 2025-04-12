-- CUSTOMER -- 
INSERT INTO `customer` (`id`, `first_name`, `last_name`, `email`, `password`, `reset_password_question`, `reset_password_answer`) 
VALUES 
(3, 'Jesse', 'Bowers', 'customer3@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(4, 'Claude', 'Melendez', 'customer4@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(5, 'Katrina', 'Duke', 'customer5@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(6, 'Jesus', 'Anderson', 'customer6@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(7, 'Natasha', 'Burnett', 'customer7@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(8, 'Jo', 'Webster', 'customer8@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(9, 'Velma', 'McPherson', 'customer9@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(10, 'Javier', 'Elliott', 'customer10@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(11, 'Clayton', 'Vaughan', 'customer11@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'), -- 123456, 50
(12, 'Edith', 'Bartlett', 'customer12@domain.com', '$2b$10$dqmrkVGpQxnlj/c.dv0OROiWGRicBoewqeyCiM1EQzKtFQlSIZKJ.', 'How many states are there in the United States?', '$2b$10$cfd3GSy13NfXlRh8fXZequ464lS21Q.Ec2EcahsOpX0y.jOZOV5jK'); -- 123456, 50

-- SUBSCRIPTION --
INSERT INTO `subscription` (`id`, `customer_id`, `price`, `start_at`, `end_at`, `billing_address_1`, `billing_address_city`, `billing_address_state`, `billing_address_zip`, `card_name`, `card_number`, `card_expire_month`, `card_expire_year`, `card_code`)
VALUES
(2, 3, 10.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '123 street dr', 'Houston', 'TX', '70001', 'John Cena', '4242424242424242', '02', '2030', '456'),
(3, 4, 10.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '123 street dr', 'Houston', 'TX', '70001', 'John Cena', '4242424242424242', '02', '2030', '456'),
(4, 5, 10.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '123 street dr', 'Houston', 'TX', '70001', 'John Cena', '4242424242424242', '02', '2030', '456'),
(5, 6, 10.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '123 street dr', 'Houston', 'TX', '70001', 'John Cena', '4242424242424242', '02', '2030', '456'),
(6, 7, 10.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '123 street dr', 'Houston', 'TX', '70001', 'John Cena', '4242424242424242', '02', '2030', '456');

-- COUPON --
INSERT INTO `coupon` (`id`, `code`, `value`, `start_at`, `end_at`, `type`)
VALUES
(3, '5PERCENT', 0.05, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 0),
(4, '5BUCKS', 5.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1),
(5, '10PERCENT', 0.10, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 0),
(6, '10BUCKS', 10.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1);
