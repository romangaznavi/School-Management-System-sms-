# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 5.7.23)
# Database: sms
# Generation Time: 2019-06-13 05:31:49 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table assignment
# ------------------------------------------------------------

CREATE TABLE `assignment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studentId` int(11) NOT NULL,
  `assignmentSubject` int(11) NOT NULL,
  `assignmentTeacher` int(11) NOT NULL,
  `completed` varchar(255) NOT NULL,
  `incomplete` varchar(255) NOT NULL DEFAULT '',
  `notes` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table class
# ------------------------------------------------------------

CREATE TABLE `class` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `className` varchar(255) NOT NULL DEFAULT '',
  `teacherId` int(11) NOT NULL,
  `subjectId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table login
# ------------------------------------------------------------

CREATE TABLE `login` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `confirm_password` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table parent
# ------------------------------------------------------------

CREATE TABLE `parent` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studentName` int(11) NOT NULL,
  `fatherName` varchar(255) NOT NULL DEFAULT '',
  `motherName` varchar(255) NOT NULL DEFAULT '',
  `fatherMobile` int(15) NOT NULL,
  `motherMobile` int(15) NOT NULL,
  `address` text NOT NULL,
  `note` text CHARACTER SET utf8mb4,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table staff
# ------------------------------------------------------------

CREATE TABLE `staff` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL DEFAULT '',
  `designation` varchar(255) NOT NULL DEFAULT '',
  `mobile` int(14) NOT NULL,
  `address` varchar(255) NOT NULL DEFAULT '',
  `joiningDate` varchar(255) NOT NULL DEFAULT '',
  `salary` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table student
# ------------------------------------------------------------

DROP TABLE IF EXISTS `student`;

CREATE TABLE `student` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `classId` int(11) NOT NULL,
  `gender` varchar(255) NOT NULL DEFAULT '',
  `dob` int(11) NOT NULL,
  `fatherName` int(11) NOT NULL,
  `motherName` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;

INSERT INTO `student` (`id`, `name`, `classId`, `gender`, `dob`, `fatherName`, `motherName`)
VALUES
	(1,'Yalda',1,'Male',20130204,1,3),
	(2,'Mateen',2,'Male',90808908,4,5);

/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table subject
# ------------------------------------------------------------

CREATE TABLE `subject` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `subjectName` varchar(255) NOT NULL DEFAULT '',
  `teacherId` int(11) NOT NULL,
  `subjectTeachingDay` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `startTime` varchar(255) NOT NULL DEFAULT '',
  `endTime` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table teacher
# ------------------------------------------------------------

CREATE TABLE `teacher` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL DEFAULT '',
  `classId` int(11) NOT NULL,
  `dob` int(11) NOT NULL,
  `gender` varchar(255) NOT NULL DEFAULT '',
  `joiningDate` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
