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

-- PRODUCT --
INSERT INTO product (sku, price, quantity, threshold, name, description) VALUES
('82310475', 19.99, 142, 50, 'Totoro Plush', 'Soft and cuddly Totoro plush from My Neighbor Totoro.'),
('01928374', 24.99, 135, 50, 'Pikachu Plush', 'Electric-type Pokémon Pikachu in plush form.'),
('78123456', 22.95, 127, 50, 'Naruto Plush', 'Plush toy of Naruto Uzumaki with headband.'),
('87236451', 15.50, 111, 50, 'Penguin Plush', 'Cute and round penguin stuffed animal.'),
('67284390', 12.99, 144, 50, 'Hello Kitty Plush', 'Adorable Hello Kitty plush in a pink dress.'),
('56192038', 21.25, 130, 50, 'Luffy Plush', 'Plushie of Monkey D. Luffy from One Piece.'),
('48291028', 18.75, 125, 50, 'Shiba Inu Plush', 'Super soft Shiba Inu dog plush.'),
('91374628', 20.00, 109, 50, 'Deku Plush', 'My Hero Academia Deku in soft plush form.'),
('83726149', 10.99, 115, 50, 'Elephant Plush', 'Floppy-eared elephant stuffed animal.'),
('62837465', 16.49, 118, 50, 'Panda Plush', 'Fluffy black and white panda bear.'),
('83472619', 25.99, 104, 50, 'Gojo Plush', 'Gojo Satoru plush from Jujutsu Kaisen with blindfold.'),
('09812345', 14.99, 138, 50, 'Teddy Bear Classic', 'Classic brown teddy bear with red bowtie.'),
('56283920', 23.50, 121, 50, 'Tanjiro Plush', 'Tanjiro Kamado plush with checkered haori.'),
('83294751', 17.95, 112, 50, 'Frog Plush', 'Green smiling frog plush with floppy legs.'),
('28374651', 19.89, 148, 50, 'Nezuko Plush', 'Nezuko plush from Demon Slayer with bamboo muzzle.'),
('17384920', 11.49, 101, 50, 'Fox Plush', 'Orange fox plush with white tail tip.'),
('98723145', 20.00, 140, 50, 'Levi Plush', 'Attack on Titan Levi plush with Survey Corps cape.'),
('56473829', 13.75, 143, 50, 'Koala Plush', 'Soft grey koala plush holding a leaf.'),
('27384910', 20.99, 107, 50, 'Sailor Moon Plush', 'Sailor Moon plush with mini moon wand.'),
('84736290', 14.25, 150, 50, 'Dinosaur Plush', 'Cute green dinosaur plush with tiny arms.'),
('18473926', 22.49, 114, 50, 'Chopper Plush', 'Tony Tony Chopper plush with big blue hat.'),
('63847592', 16.50, 122, 50, 'Cow Plush', 'Black and white cow plush with pink nose.'),
('90817263', 19.99, 119, 50, 'Zoro Plush', 'Zoro plush from One Piece with swords.'),
('17283946', 12.25, 149, 50, 'Rabbit Plush', 'White bunny plush with floppy ears and blue ribbon.'),
('28473619', 18.50, 137, 50, 'Goku Plush', 'Dragon Ball Goku plush in orange gi.'),
('72638490', 10.50, 145, 50, 'Cat Plush', 'Grey tabby cat plush with green eyes.'),
('83627149', 17.75, 120, 50, 'Vegeta Plush', 'Dragon Ball Vegeta plush with scouter.'),
('26483917', 18.95, 113, 50, 'Sloth Plush', 'Slow and smiley sloth plush with long arms.'),
('94738261', 23.99, 116, 50, 'Eren Plush', 'Eren Yeager plush with Survey Corps uniform.'),
('17384927', 11.99, 129, 50, 'Owl Plush', 'Wide-eyed owl plush with patterned feathers.'),
('85739261', 17.49, 133, 50, 'Rem Plush', 'Re:Zero Rem plush in maid outfit.'),
('64837210', 13.50, 134, 50, 'Duck Plush', 'Yellow duck plush with orange beak and feet.'),
('92837461', 15.95, 124, 50, 'Astro Boy Plush', 'Classic Astro Boy plush with bright eyes.'),
('17382940', 12.49, 147, 50, 'Dog Plush', 'Golden retriever stuffed animal with tongue out.'),
('98371624', 20.00, 126, 50, 'Asuka Plush', 'Evangelion Asuka plush in red plugsuit.'),
('47382910', 19.25, 108, 50, 'Seal Plush', 'Chubby white seal plush with blush cheeks.'),
('17384915', 16.49, 117, 50, 'Todoroki Plush', 'Half-hot, half-cold Todoroki plush.'),
('52637418', 16.99, 105, 50, 'Lion Plush', 'Mane-tastic lion plush with soft fur.'),
('37485910', 18.75, 103, 50, 'Edward Elric Plush', 'Edward Elric plush with tiny automail arm.'),
('16483920', 14.75, 128, 50, 'Monkey Plush', 'Hanging monkey plush with velcro hands.'),
('83726410', 20.49, 110, 50, 'Kakashi Plush', 'Kakashi Hatake plush with mask and book.'),
('67293810', 18.25, 106, 50, 'Wolf Plush', 'Grey wolf plush howling at the sky.'),
('48372619', 25.00, 123, 50, 'Ichigo Plush', 'Bleach Ichigo plush with tiny sword accessory.'),
('73829104', 13.95, 139, 50, 'Bear Plush', 'Sleepy bear plush with nightcap.'),
('28473628', 21.99, 131, 50, 'Luna Plush', 'Sailor Moon’s cat Luna plush with crescent moon.'),
('39485720', 11.25, 132, 50, 'Horse Plush', 'Majestic horse plush with flowing mane.'),
('72639401', 22.49, 136, 50, 'Spike Plush', 'Cowboy Bebop Spike plush with green jacket.'),
('18374659', 10.95, 141, 50, 'Pig Plush', 'Round pig plush with curly tail.'),
('56382947', 20.50, 146, 50, 'Ryuko Plush', 'Ryuko Matoi plush from Kill la Kill.'),
('82736459', 15.25, 100, 50, 'Sheep Plush', 'Fluffy sheep plush that’s super soft.'),
('73829163', 19.99, 142, 50, 'Sasuke Plush', 'Sasuke Uchiha plush with Sharingan eyes.');