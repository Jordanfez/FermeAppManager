-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 16 déc. 2025 à 16:05
-- Version du serveur : 10.4.19-MariaDB
-- Version de PHP : 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `piasoft-test`
--
CREATE DATABASE IF NOT EXISTS `piasoft-test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `piasoft-test`;

-- --------------------------------------------------------

--
-- Structure de la table `animal`
--

CREATE TABLE `animal` (
  `id_animal` int(11) NOT NULL,
  `code_animal` varchar(50) DEFAULT NULL,
  `id_categorie` int(11) DEFAULT NULL,
  `date_enregistrement` date DEFAULT NULL,
  `etat` enum('disponible','vendu') DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `animal`
--

INSERT INTO `animal` (`id_animal`, `code_animal`, `id_categorie`, `date_enregistrement`, `etat`) VALUES
(1, 'VCH-001', 1, '2025-01-10', 'vendu'),
(2, 'VCH-002', 1, '2025-01-12', 'disponible'),
(3, 'MOU-001', 2, '2025-01-11', 'vendu'),
(4, 'MOU-002', 2, '2025-01-13', 'disponible'),
(5, 'CHV-001', 3, '2025-01-14', 'disponible'),
(6, 'CHV-002', 3, '2025-01-15', 'disponible'),
(7, 'VCH-003', 1, '2025-01-10', 'vendu'),
(8, 'MOU-003', 2, '2025-01-13', 'disponible'),
(9, 'CHV-004', 3, '2025-01-14', 'vendu'),
(10, 'CHV-005', 3, '2025-01-15', 'vendu'),
(12, 'CHV-007', 3, '2025-12-16', 'disponible');

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id_categorie` int(11) NOT NULL,
  `nom_categorie` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id_categorie`, `nom_categorie`) VALUES
(1, 'Vache'),
(2, 'Mouton'),
(3, 'Chèvre');

-- --------------------------------------------------------

--
-- Structure de la table `detail_vente`
--

CREATE TABLE `detail_vente` (
  `id_detail` int(11) NOT NULL,
  `id_vente` int(11) DEFAULT NULL,
  `id_animal` int(11) DEFAULT NULL,
  `prix_vente` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `detail_vente`
--

INSERT INTO `detail_vente` (`id_detail`, `id_vente`, `id_animal`, `prix_vente`) VALUES
(1, 1, 1, '250000.00'),
(2, 1, 2, '240000.00'),
(3, 1, 4, '70000.00');

-- --------------------------------------------------------

--
-- Structure de la table `newvente`
--

CREATE TABLE `newvente` (
  `code_vente` int(11) NOT NULL,
  `id_categorie` int(11) NOT NULL,
  `quantite` int(11) NOT NULL CHECK (`quantite` > 0),
  `prix_unitaire` decimal(10,2) NOT NULL CHECK (`prix_unitaire` > 0),
  `date_vente` date NOT NULL,
  `id_vendeur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `newvente`
--

INSERT INTO `newvente` (`code_vente`, `id_categorie`, `quantite`, `prix_unitaire`, `date_vente`, `id_vendeur`) VALUES
(3, 2, 2, '600000.00', '2025-12-05', 1),
(4, 1, 2, '1200000.00', '2025-12-17', 2);

-- --------------------------------------------------------

--
-- Structure de la table `vendeur`
--

CREATE TABLE `vendeur` (
  `id_vendeur` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `vendeur`
--

INSERT INTO `vendeur` (`id_vendeur`, `nom`, `prenom`, `telephone`) VALUES
(1, 'Ndi', 'Paul', '699000111'),
(2, 'Tchoua', 'Marie', '677222333');

-- --------------------------------------------------------

--
-- Structure de la table `vente`
--

CREATE TABLE `vente` (
  `id_vente` int(11) NOT NULL,
  `date_vente` date DEFAULT NULL,
  `id_vendeur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `vente`
--

INSERT INTO `vente` (`id_vente`, `date_vente`, `id_vendeur`) VALUES
(1, '2025-02-01', 1),
(2, '2025-02-05', 2);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `animal`
--
ALTER TABLE `animal`
  ADD PRIMARY KEY (`id_animal`),
  ADD UNIQUE KEY `nom_animal` (`code_animal`),
  ADD KEY `id_categorie` (`id_categorie`);

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id_categorie`);

--
-- Index pour la table `detail_vente`
--
ALTER TABLE `detail_vente`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `id_vente` (`id_vente`),
  ADD KEY `id_animal` (`id_animal`);

--
-- Index pour la table `newvente`
--
ALTER TABLE `newvente`
  ADD PRIMARY KEY (`code_vente`),
  ADD KEY `id_categorie` (`id_categorie`),
  ADD KEY `id_vendeur` (`id_vendeur`);

--
-- Index pour la table `vendeur`
--
ALTER TABLE `vendeur`
  ADD PRIMARY KEY (`id_vendeur`);

--
-- Index pour la table `vente`
--
ALTER TABLE `vente`
  ADD PRIMARY KEY (`id_vente`),
  ADD KEY `id_vendeur` (`id_vendeur`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `animal`
--
ALTER TABLE `animal`
  MODIFY `id_animal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id_categorie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `detail_vente`
--
ALTER TABLE `detail_vente`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `newvente`
--
ALTER TABLE `newvente`
  MODIFY `code_vente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `vendeur`
--
ALTER TABLE `vendeur`
  MODIFY `id_vendeur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `vente`
--
ALTER TABLE `vente`
  MODIFY `id_vente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `animal`
--
ALTER TABLE `animal`
  ADD CONSTRAINT `animal_ibfk_1` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`);

--
-- Contraintes pour la table `detail_vente`
--
ALTER TABLE `detail_vente`
  ADD CONSTRAINT `detail_vente_ibfk_1` FOREIGN KEY (`id_vente`) REFERENCES `vente` (`id_vente`),
  ADD CONSTRAINT `detail_vente_ibfk_2` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`);

--
-- Contraintes pour la table `newvente`
--
ALTER TABLE `newvente`
  ADD CONSTRAINT `newvente_ibfk_1` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`),
  ADD CONSTRAINT `newvente_ibfk_2` FOREIGN KEY (`id_vendeur`) REFERENCES `vendeur` (`id_vendeur`);

--
-- Contraintes pour la table `vente`
--
ALTER TABLE `vente`
  ADD CONSTRAINT `vente_ibfk_1` FOREIGN KEY (`id_vendeur`) REFERENCES `vendeur` (`id_vendeur`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
