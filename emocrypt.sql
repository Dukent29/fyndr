-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 30 sep. 2025 à 15:41
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `emocrypt`
--

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `recipient_id` int(11) NOT NULL,
  `recipient_username` varchar(255) DEFAULT NULL,
  `ciphertext_emoji` longtext NOT NULL,
  `salt_b64` text NOT NULL,
  `algo` varchar(64) DEFAULT 'vigenere-emoji-salted',
  `version` int(11) DEFAULT 1,
  `created_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `user_id`, `username`, `recipient_id`, `recipient_username`, `ciphertext_emoji`, `salt_b64`, `algo`, `version`, `created_at`) VALUES
(1, 1, 'test1', 2, 'test2', '🙊😸🙘🙠😱', 'tBaWPuYBtug/A83Ry7zJlma8hIrhfEQJo/DekNJZUfw=', 'vigenere-emoji-salted', 1, '2025-09-30 13:40:53.353'),
(2, 2, 'test2', 1, 'test1', '😣😎🗳😠🗽🗙😥', 'mjfqdHEcxeOdzgDcV8qrHXVmVOOT34Y7/KXr7kPyfJQ=', 'vigenere-emoji-salted', 1, '2025-09-30 13:41:00.245'),
(3, 2, 'test2', 1, 'test1', '🗶🗷😆🙧🗽🗥🗴', 'fer40ZPzFAoFdln4SF3JnNM/LTB3adfqVms6m3NSfZw=', 'vigenere-emoji-salted', 1, '2025-09-30 13:41:06.676');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_uuid` char(36) DEFAULT uuid()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `created_at`, `user_uuid`) VALUES
(1, 'test1', '2025-09-30 13:34:20', '2b7c6a7a-9e02-11f0-9a01-005056c00001'),
(2, 'test2', '2025-09-30 13:34:24', '2e26368e-9e02-11f0-9a01-005056c00001');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conv` (`user_id`,`recipient_id`,`created_at`),
  ADD KEY `fk_recipient` (`recipient_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `user_uuid` (`user_uuid`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sender` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
