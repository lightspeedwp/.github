-- Synthetic fixture for spec 024: statements the sanitiser reports but never changes. No real data.

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `beta` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `beta`;
SET @@GLOBAL.max_allowed_packet = 67108864;

CREATE TABLE `wp_search` (
  `id` int NOT NULL,
  `trigger` varchar(20) DEFAULT NULL,
  `body` text,
  `body_length` int GENERATED ALWAYS AS (char_length(`body`)) VIRTUAL,
  FULLTEXT KEY `body` (`body`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wp_search` (`id`, `trigger`, `body`) VALUES (1,'x','CREATE TRIGGER in post text is data, not a statement; DEFINER=nobody');

DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `wp_search_bi` BEFORE INSERT ON `wp_search` FOR EACH ROW SET NEW.id = NEW.id */;;
DELIMITER ;
