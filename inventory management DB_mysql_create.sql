CREATE TABLE `user` (
	`name` varchar(50) NOT NULL,
	`password` varchar(256) NOT NULL
);

CREATE TABLE `sewingOrders` (
	`orderId` INT(100) NOT NULL AUTO_INCREMENT,
	`customerName` varchar(500) NOT NULL,
	`customerMobile` varchar(20) NOT NULL,
	`customerAddress` varchar(500),
	`shirtIds` varchar(1000),
	`pantIds` varchar(1000),
	`totalPrice` varchar(1000),
	`orderDate` DATE NOT NULL,
	`status` INT(10),
	PRIMARY KEY (`orderId`)
);

CREATE TABLE `shirts` (
	`shirtId` INT(100) NOT NULL AUTO_INCREMENT,
	`height` varchar(255),
	`chest` varchar(255),
	`shoulder` varchar(255),
	`handGloves` varchar(255),
	`neck` varchar(255),
	`frontage` varchar(255),
	`price` INT(100) NOT NULL,
	`type` varchar(255),
	`category` varchar(255),
	PRIMARY KEY (`shirtId`)
);

CREATE TABLE `pants` (
	`pantId` INT(100) NOT NULL AUTO_INCREMENT,
	`height` varchar(255),
	`waist` varchar(255) NOT NULL,
	`seat` varchar(255),
	`knee` varchar(255),
	`bottom` varchar(255),
	`price` INT(100) NOT NULL,
	`type` varchar(255),
	`category` varchar(255),
	PRIMARY KEY (`pantId`)
);

CREATE TABLE `vendorManager` (
	`orderId` INT(100) NOT NULL AUTO_INCREMENT,
	`name` varchar(250) NOT NULL,
	`orderDate` DATE NOT NULL,
	`description` varchar(500) NOT NULL,
	`paymentDate` DATE,
	`amount` INT(100) NOT NULL,
	PRIMARY KEY (`orderId`)
);

CREATE TABLE `readymadeOrders` (
	`orderId` INT(100) NOT NULL AUTO_INCREMENT,
	`customerName` varchar(255) NOT NULL,
	`address` varchar(500) NOT NULL,
	`orderDate` DATE NOT NULL,
	`productTitle` varchar(100) NOT NULL,
	`unitPrice` INT(100) NOT NULL,
	`quantity` INT(100) NOT NULL,
	`totalPrice` INT(100) NOT NULL,
	`status` INT(100) NOT NULL,
	PRIMARY KEY (`orderId`)
);

CREATE TABLE `expenseManager` (
	`expenseId` INT NOT NULL AUTO_INCREMENT,
	`description` varchar(500) NOT NULL,
	`amount` INT(100) NOT NULL,
	`date` DATE NOT NULL,
	PRIMARY KEY (`expenseId`)
);

CREATE TABLE `workerManager` (
	`workerId` INT NOT NULL AUTO_INCREMENT,
	`workerName` varchar(255) NOT NULL,
	`address` varchar(500) NOT NULL,
	`mobile` varchar(20) NOT NULL,
	`type` INT(20) NOT NULL,
	PRIMARY KEY (`workerId`)
);

CREATE TABLE `workerPayments` (
	`paymentId` INT NOT NULL AUTO_INCREMENT,
	`workerId` INT NOT NULL,
	`amount` INT NOT NULL,
	`paymentDate` DATE NOT NULL,
	`status` INT NOT NULL,
	PRIMARY KEY (`paymentId`)
);

CREATE TABLE `workerBorrowings` (
	`borrowId` INT NOT NULL AUTO_INCREMENT,
	`workerId` INT NOT NULL,
	`borrowedAmount` INT NOT NULL,
	`borrowDate` DATE NOT NULL,
	`returnedAmount` INT NOT NULL,
	`status` INT(10) NOT NULL,
	PRIMARY KEY (`borrowId`)
);

CREATE TABLE `workerTasks` (
	`taskId` INT NOT NULL AUTO_INCREMENT,
	`workerId` INT NOT NULL,
	`sewingOrderId` INT NOT NULL,
	`shirtPrices` varchar(255) NOT NULL,
	`pantPrices` varchar(255) NOT NULL,
	`totalShirtPrice` INT NOT NULL,
	`totalPantPrice` INT NOT NULL,
	`status` INT NOT NULL,
	PRIMARY KEY (`taskId`)
);

CREATE TABLE `readymadeProductTitles` (
	`productId` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`productId`)
);

ALTER TABLE `sewingOrders` ADD CONSTRAINT `sewingOrders_fk0` FOREIGN KEY (`shirtIds`) REFERENCES `shirts`(`shirtId`);

ALTER TABLE `workerPayments` ADD CONSTRAINT `workerPayments_fk0` FOREIGN KEY (`workerId`) REFERENCES `workerManager`(`workerId`);

ALTER TABLE `workerBorrowings` ADD CONSTRAINT `workerBorrowings_fk0` FOREIGN KEY (`workerId`) REFERENCES `workerManager`(`workerId`);

ALTER TABLE `workerTasks` ADD CONSTRAINT `workerTasks_fk0` FOREIGN KEY (`workerId`) REFERENCES `workerManager`(`workerId`);

ALTER TABLE `workerTasks` ADD CONSTRAINT `workerTasks_fk1` FOREIGN KEY (`sewingOrderId`) REFERENCES `sewingOrders`(`orderId`);

