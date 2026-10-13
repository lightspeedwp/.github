-- Synthetic fixture for spec 020: custom prefix and a multisite sub-site. No real data.

CREATE TABLE `wp123_options` (
  `option_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `option_name` varchar(191) NOT NULL DEFAULT '',
  `option_value` longtext NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`option_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

INSERT INTO `wp123_options` VALUES (1,'siteurl','https://staging.example.com','yes'),(2,'home','https://www.example.com','yes'),(3,'widget_text','a:1:{s:7:\"siteurl\";s:21:\"http://decoy.example\";}','yes');

CREATE TABLE `wp123_2_options` (
  `option_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `option_name` varchar(191) NOT NULL DEFAULT '',
  `option_value` longtext NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`option_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

INSERT INTO `wp123_2_options` VALUES (1,'siteurl','https://staging.example.com/shop','yes'),(2,'home','https://staging.example.com/shop','yes');

CREATE TABLE `wp123_postmeta` (
  `meta_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext,
  PRIMARY KEY (`meta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

INSERT INTO `wp123_postmeta` VALUES (1,'siteurl','http://not-an-option.example');
