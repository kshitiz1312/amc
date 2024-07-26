-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: amc_management
-- ------------------------------------------------------
-- Server version	8.0.38

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
-- Table structure for table `amc_details`
--

DROP TABLE IF EXISTS `amc_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amc_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `amc_number` int DEFAULT NULL,
  `amc_start_date` date DEFAULT NULL,
  `amc_end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `amc_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `amc_details_chk_1` CHECK ((`amc_number` between 1 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amc_details`
--

LOCK TABLES `amc_details` WRITE;
/*!40000 ALTER TABLE `amc_details` DISABLE KEYS */;
INSERT INTO `amc_details` VALUES (1,1,1,'2023-01-02','2024-01-01'),(2,1,2,'2024-01-02','2025-01-01'),(3,2,1,'2023-02-02','2024-02-01'),(4,3,1,'2023-03-02','2024-03-01'),(5,4,1,'2023-04-02','2024-04-01'),(6,5,1,'2023-05-02','2024-05-01'),(7,6,1,'2023-06-02','2024-06-01'),(8,7,1,'2023-07-02','2024-07-01'),(9,8,1,'2023-08-02','2024-08-01'),(10,9,1,'2023-09-02','2024-09-01'),(11,10,1,'2022-10-02','2023-10-01'),(12,10,2,'2023-10-02','2024-10-01'),(13,11,1,'2024-07-20','2025-07-19'),(15,13,1,'2024-07-20','2025-07-20'),(16,14,1,'2025-07-21','2026-07-20'),(18,16,1,'2025-07-25','2026-07-24'),(19,17,1,'2025-07-28','2026-07-27'),(20,18,1,'2024-10-25','2024-12-24'),(21,19,1,'2025-07-26','2026-07-25');
/*!40000 ALTER TABLE `amc_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `purchase_date` date NOT NULL,
  `warranty_start_date` date NOT NULL,
  `warranty_end_date` date NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'Product A','2022-01-01','2022-01-01','2023-01-01'),(2,'Product B','2022-02-01','2022-02-01','2023-02-01'),(3,'Product C','2022-03-01','2022-03-01','2023-03-01'),(4,'Product D','2022-04-01','2022-04-01','2023-04-01'),(5,'Product E','2022-05-01','2022-05-01','2023-05-01'),(6,'Product F','2022-06-01','2022-06-01','2023-06-01'),(7,'Product G','2022-07-01','2022-07-01','2023-07-01'),(8,'Product H','2022-08-01','2022-08-01','2023-08-01'),(9,'Product I','2022-09-01','2022-09-01','2023-09-01'),(10,'Product J','2021-10-01','2021-10-01','2022-10-01'),(11,'product k','2024-07-19','2024-07-20','2025-07-19'),(13,'product o','2024-07-20','2024-07-20','2025-07-20'),(14,'product m','2024-07-21','2024-07-21','2025-07-20'),(16,'productf','2024-07-24','2024-07-25','2025-07-24'),(17,'product l','2024-07-27','2024-07-28','2025-07-27'),(18,'productz','2024-07-24','2024-07-25','2024-10-24'),(19,'productq','2024-07-25','2024-07-26','2025-07-25');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email_id` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1330 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (101,'nimitya ','9560562310','bhsbswvggs@gmail.com','$2b$10$N.w86pDX6R1gFE14dyRlXeMs2VfuTx4LtPAQ4ReMqQYOTlkW8lxUi','user'),(102,'god','8368199348','sgvxggh@gmail.com','$2b$10$YJQ6N1n.5jduJP6p4b3Ayuwu3bYoMB7mFjFhRc8DoN3AhwlL6jh3i','user'),(501,'gaur','987654321','kkshitiz2004gaur@gmail.com','$2b$10$cN01DEZR/QiRBxKveVcR0uytajRMwvWd9JoYbuubEibkFdXwwIWu2','user'),(1312,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','$2b$10$bABaIratGt0QLe4NLW8brue6upjMd1vpCgEq/0nBJPPfuFOKhRnv.','user'),(1313,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','$2b$10$Z4zdISeZ5GD/r1pu006hPujSpzJaBvz3M0a2ND9pwxbnfYEdA9O3q','admin'),(1314,'nitya','9560562312','nityamahajn@gmail.com','nitya1','user'),(1315,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','7896','user'),(1316,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','12','user'),(1317,'gaur','8368199348','kkshitiz2004gaur@gmail.com','12','admin'),(1318,'gaur','9560562310','kkshitiz2004gaur@gmail.com','12','user'),(1319,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','12','user'),(1320,'amit','9560562310','sgvxggh@gmail.com','12','user'),(1321,'good','9560562310','bhsbswvggs@gmail.com','13','admin'),(1322,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','56','admin'),(1323,'gaur','8368199348','sgvxggh@gmail.com','30','admin'),(1324,'kshitiz','9560562310','bhsbswvggs@gmail.com','9876','user'),(1325,'gaur','9560562310','bhsbswvggs@gmail.com','56','user'),(1326,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','56','user'),(1327,'kshitiz','8368199348','kkshitiz2004gaur@gmail.com','65','user'),(1328,'gaur','8368199348','kkshitiz2004gaur@gmail.com','13','admin'),(1329,'gaur','8368199348','kkshitiz2004gaur@gmail.com','13','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-26 22:45:28
