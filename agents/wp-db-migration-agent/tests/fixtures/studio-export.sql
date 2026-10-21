-- phpMyAdmin SQL Dump
-- Synthetic fixture for spec 024: a Studio site exported through phpMyAdmin.
-- No real data.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `wordpress` DEFAULT CHARACTER SET utf8mb4;
USE `wordpress`;

DROP TABLE IF EXISTS `_wp_sqlite_global_variables`;
CREATE TABLE `_wp_sqlite_global_variables` (
  `name` text NOT NULL,
  `value` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `_wp_sqlite_global_variables` (`name`, `value`) VALUES
('_wp_sqlite_driver_version', '3.0.2');

DROP TABLE IF EXISTS `wp_options`;
CREATE TABLE `wp_options` (
  `option_id` bigint(20) UNSIGNED NOT NULL,
  `option_name` varchar(191) NOT NULL DEFAULT '',
  `option_value` longtext NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `wp_options` (`option_id`, `option_name`, `option_value`, `autoload`) VALUES
(1, 'siteurl', 'https://beta.local', 'yes'),
(2, 'home', 'https://beta.local', 'yes'),
(3, 'blogname', 'Beta; a test, (with) punctuation', 'yes');

DROP TABLE IF EXISTS `wp_posts`;
CREATE TABLE `wp_posts` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `post_content` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `wp_posts` (`ID`, `post_content`) VALUES
(1, '<img src=\"https://beta.local/wp-content/uploads/a.jpg\">'),
(2, 'See http://localhost:8881/page and https://beta.local/about'),
(3, '<!-- wp:image {\"url\":\"https:\\/\\/beta.local\\/a.jpg\"} /-->');

DROP TABLE IF EXISTS `custom_log`;
CREATE TABLE `custom_log` (
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

COMMIT;
