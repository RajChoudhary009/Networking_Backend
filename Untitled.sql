-- MySQL dump 10.13  Distrib 8.0.31, for macos12 (x86_64)
--
-- Host: localhost    Database: networking
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Ranks`
--

DROP TABLE IF EXISTS `Ranks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ranks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `reward` varchar(255) DEFAULT NULL,
  `rewardAmount` float DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ranks`
--

LOCK TABLES `Ranks` WRITE;
/*!40000 ALTER TABLE `Ranks` DISABLE KEYS */;
INSERT INTO `Ranks` VALUES (1,'RANK_1',NULL,0,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(2,'RANK_2','Gold',5000,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(3,'RANK_3','Diamond',10000,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(4,'RANK_4','Blue Diamond',20000,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(5,'RANK_5','Ambassador',40000,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(6,'RANK_6','Blue Ambassador',60000,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(7,'RANK_7','Topaz',80000,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(8,'RANK_8','Blue Topaz',100000,'2026-03-29 14:39:55','2026-03-29 14:39:55'),(9,'RANK_9','Ambassador Elite',200000,'2026-03-29 14:39:55','2026-03-29 14:39:55');
/*!40000 ALTER TABLE `Ranks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Scanners`
--

DROP TABLE IF EXISTS `Scanners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Scanners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scannerImage` varchar(255) DEFAULT NULL,
  `scannerPayAdd` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Scanners`
--

LOCK TABLES `Scanners` WRITE;
/*!40000 ALTER TABLE `Scanners` DISABLE KEYS */;
INSERT INTO `Scanners` VALUES (1,'uploads/1775038442114-scan-me-qr-code_78370-2915.avif','upi-adfgjnnn@ybl','2026-04-01 10:14:02','2026-04-01 10:14:02'),(2,'uploads/1775040052749-logo.jpeg','upi-adfgjnrks@ybl','2026-04-01 10:40:52','2026-04-01 10:40:52');
/*!40000 ALTER TABLE `Scanners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transactions`
--

DROP TABLE IF EXISTS `Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `amount` float NOT NULL,
  `screenshot` varchar(255) DEFAULT NULL,
  `paymentMethod` enum('BEP 20/USDT','TRC 20/USDT','Polygon/USDT') DEFAULT 'BEP 20/USDT',
  `withdrawMethod` enum('BEP 20/USDT','TRC 20/USDT','Polygon/USDT') DEFAULT 'BEP 20/USDT',
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `type` enum('deposit','withdraw') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transactions`
--

LOCK TABLES `Transactions` WRITE;
/*!40000 ALTER TABLE `Transactions` DISABLE KEYS */;
INSERT INTO `Transactions` VALUES (1,3,500,'uploads/1774949183652-locked.png','BEP 20/USDT',NULL,'approved','deposit','2026-03-31 09:26:23','2026-04-05 17:46:13'),(2,3,500,'uploads/1774950352807-locked.png','BEP 20/USDT',NULL,'pending','deposit','2026-03-31 09:45:52','2026-03-31 09:45:52'),(3,3,1000,'uploads/1774951293956-scaneer.avif','BEP 20/USDT',NULL,'rejected','deposit','2026-03-31 10:01:33','2026-04-06 10:10:05'),(4,8,1000,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-03-31 18:01:56','2026-04-05 17:47:12'),(5,8,1000,'uploads/1774980313872-1774949183652-locked.png','BEP 20/USDT',NULL,'pending','deposit','2026-03-31 18:05:13','2026-03-31 18:05:13'),(6,3,300,'uploads/1775305632221-logo.jpeg','BEP 20/USDT',NULL,'pending','deposit','2026-04-04 12:27:12','2026-04-04 12:27:12'),(7,3,400,'uploads/1775305738584-logo.jpeg','BEP 20/USDT',NULL,'pending','deposit','2026-04-04 12:28:58','2026-04-04 12:28:58'),(8,3,100,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-04 12:31:25','2026-04-05 17:48:57'),(9,3,100,'uploads/1775306152719-scaneer.avif','BEP 20/USDT',NULL,'pending','deposit','2026-04-04 12:35:52','2026-04-04 12:35:52'),(10,3,100,'uploads/1775307726231-scaneer.avif','BEP 20/USDT',NULL,'pending','deposit','2026-04-04 13:02:06','2026-04-04 13:02:06'),(11,3,100,'uploads/1775309457880-scaneer.avif','BEP 20/USDT',NULL,'pending','deposit','2026-04-04 13:30:57','2026-04-04 13:30:57'),(12,3,100,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-04 13:31:11','2026-04-05 17:51:24'),(15,11,100,'uploads/1775482618204-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-06 13:36:58','2026-04-06 13:40:03'),(16,11,100,'uploads/1775482991777-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-06 13:43:11','2026-04-06 13:43:49'),(17,11,90,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-06 13:47:44','2026-04-06 13:48:47'),(18,11,50,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-06 13:52:15','2026-04-06 13:55:42'),(19,11,50,'uploads/1775553304803-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-07 09:15:04','2026-04-07 09:15:49'),(20,11,50,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-07 09:16:23','2026-04-07 09:16:39'),(21,12,100,'uploads/1775553763681-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-07 09:22:43','2026-04-07 09:23:17'),(22,12,50,'uploads/1775553863998-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-07 09:24:24','2026-04-07 09:24:42'),(23,12,40,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-07 09:26:04','2026-04-07 09:26:59'),(24,12,100,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-08 02:39:52','2026-04-08 02:54:50'),(25,12,150,'uploads/1775616199249-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-08 02:43:19','2026-04-08 02:49:50'),(26,12,200,'uploads/1775616935608-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-08 02:55:35','2026-04-08 02:55:48'),(27,12,50,'uploads/1775617222253-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-08 03:00:22','2026-04-08 03:13:15'),(28,12,30,'uploads/1775617367267-logo.jpeg','BEP 20/USDT',NULL,'approved','deposit','2026-04-08 03:02:47','2026-04-08 03:03:09'),(29,12,200,NULL,NULL,'BEP 20/USDT','approved','withdraw','2026-04-08 03:15:52','2026-04-08 04:14:04'),(30,12,300,'uploads/1775625803028-logo.jpeg','BEP 20/USDT',NULL,'pending','deposit','2026-04-08 05:23:23','2026-04-08 05:23:23'),(31,12,400,'uploads/1775625823698-logo.jpeg','TRC 20/USDT',NULL,'pending','deposit','2026-04-08 05:23:43','2026-04-08 05:23:43'),(32,12,50,NULL,NULL,'TRC 20/USDT','approved','withdraw','2026-04-08 06:26:59','2026-04-08 06:31:56'),(33,12,50,NULL,NULL,'Polygon/USDT','approved','withdraw','2026-04-08 06:31:38','2026-04-08 06:38:00'),(34,12,50,NULL,NULL,'Polygon/USDT','approved','withdraw','2026-04-08 06:40:10','2026-04-08 06:40:39'),(35,12,80,NULL,NULL,'BEP 20/USDT','rejected','withdraw','2026-04-08 06:41:05','2026-04-08 06:41:56'),(36,12,80,NULL,NULL,'BEP 20/USDT','rejected','withdraw','2026-04-08 06:42:30','2026-04-08 06:42:43'),(37,11,100,'uploads/1775666813119-profile.png','TRC 20/USDT',NULL,'approved','deposit','2026-04-08 16:46:53','2026-04-08 16:48:34'),(38,11,100,NULL,NULL,'Polygon/USDT','approved','withdraw','2026-04-08 16:50:37','2026-04-08 16:52:38');
/*!40000 ALTER TABLE `Transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userCode` varchar(255) NOT NULL,
  `referralCode` varchar(255) NOT NULL,
  `referredBy` int DEFAULT NULL,
  `wallet` float DEFAULT '0',
  `investment` float DEFAULT '0',
  `userScanner` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `referralPaymentStatus` tinyint(1) DEFAULT '0',
  `paymentStatus` enum('pending','success') DEFAULT 'pending',
  `paymentAddress` varchar(255) DEFAULT NULL,
  `rankId` int DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `userCode` (`userCode`),
  UNIQUE KEY `referralCode` (`referralCode`),
  KEY `referredBy` (`referredBy`),
  KEY `rankId` (`rankId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`referredBy`) REFERENCES `Users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`rankId`) REFERENCES `Ranks` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (3,'Raj Choudhary','raaz02246@gmail.com','$2b$10$LBw15SZRDnr9EmmyglFG8O1cUptBTXWW/26ydlL6nSW.1vu/Fk0m2','IN19418','REF81528',NULL,100,100,'uploads/1775916768295-logo.jpeg','user',0,'success','hhhh',1,'2026-03-29 15:12:05','2026-04-12 18:30:00'),(7,'Raj Choudhary','raaz02256@gmail.com','$2b$10$1DE9ab1D5aBPdY1rIxBZZ.jJtXSMNQUzp5se8j1iAl8EPyl/BscR6','IN20817','REF35315',NULL,100,100,'uploads/1775891492655-locked.png','user',0,'pending','fffffffffffffg',1,'2026-03-29 16:40:54','2026-04-12 18:30:00'),(8,'Hemank','hemankishere@gmail.com','$2b$10$wAxEd4XsLvI/WCVyz9mr6.1gDpcLGLe6axTBk4eRzg8JU2zvrLSaG','IN97015','REF87950',NULL,100,100,NULL,'admin',0,'pending','rfshuiitmaaksha',1,'2026-03-29 17:00:02','2026-04-12 18:30:00'),(11,'Om Prakash','omprakashjee607@gmail.com','$2b$10$FNq23gWprI/q419aK9.QwuYtWHjQi6X1.48BThbZD.3zEdnzgVroW','IN91471','REF43494',8,100,100,'uploads/1775483199020-logo.jpeg','user',0,'success','sajhdg@ybl',1,'2026-04-06 13:34:35','2026-04-12 18:30:00'),(12,'rohi','rohi123@gmail.com','$2b$10$jhSKYXXclAd4udoHDqq4h.Cvw3caUa9EnpxkKObHr0NS80qwsZ91O','IN67526','REF69402',11,100,100,'uploads/1775553946160-logo.jpeg','user',0,'success','djhgjkhllhh@ybl',1,'2026-04-07 09:18:23','2026-04-12 18:30:00');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13  0:33:22
