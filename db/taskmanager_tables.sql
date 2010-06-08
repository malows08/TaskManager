--
-- Database: `taskmanager`
--
-- CREATE DATABASE IF NOT EXISTS `taskmanager`;
-- USE `taskmanager`;
-- --------------------------------------------------------


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `password` varchar(10) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `lastname`, `firstname`, `password`, `email`) VALUES
(1, 'smith', 'john', 'john', 'john.smith@taskmanager.com'),
(2, 'smith', 'jane', 'jane', 'jane.smith@taskmanager.com');


--
-- Table structure for table `repos`
--

DROP TABLE IF EXISTS `repos` ;
CREATE TABLE IF NOT EXISTS `repos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `create_date` datetime NOT NULL,
  `create_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);


--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repo_id` int(11) NOT NULL,
  `title` varchar(500) DEFAULT NULL,
  `forum` varchar(100) DEFAULT NULL,
  `prime` varchar(100) DEFAULT NULL,
  `notes` longtext,
  `date_due` datetime DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `user_id_created` int(11) NOT NULL,
  `date_updated` datetime NOT NULL,
  `user_id_updated` int(11) NOT NULL,
  `date_completed` date DEFAULT NULL,
  `user_id_completed` int(11) DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT NULL,
  `is_archive` tinyint(1) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  `date_added` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);


--
-- Table structure for table `privileges`
--

DROP TABLE IF EXISTS `privileges`;
CREATE TABLE IF NOT EXISTS `privileges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repo_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `privilege` varchar(50) NOT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
);


--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `user_id` int(11) NOT NULL,
  `send_alert` tinyint(1) NOT NULL,
  KEY `user_id` (`user_id`)
);
