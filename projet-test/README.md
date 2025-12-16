# Gestion de Cheptel - Application Web

## 📝 Description
Application web complète pour la gestion d'un cheptel d'élevage, permettant le suivi des animaux, la gestion des ventes et la génération de rapports détaillés. L'application est conçue pour faciliter la traçabilité des animaux et optimiser la gestion quotidienne d'une exploitation agricole.

## 🏗 Structure du Projet

### Frontend (React + TypeScript)
- **/src**
  - **/components** : Composants réutilisables
  - **/pages** : Pages principales de l'application
  - **/types** : Définitions TypeScript
  - **/lib** : Utilitaires et configurations
  - **/styles** : Fichiers de style globaux
  - **/hooks** : Hooks personnalisés
  - **/api** : Appels API et configurations

### Backend (Node.js + Express + MySQL)
- **/back**
  - **/routes** : Définition des routes API
  - **/models** : Modèles de données
  - **/controllers** : Logique métier
  - **/middlewares** : Middlewares personnalisés
  - **db.js** : Configuration de la base de données

## Fonctionnalités

### Gestion du Cheptel
- Enregistrement des animaux avec code unique
- Suivi de l'état des animaux (disponible/vendu)
- Gestion des catégories d'animaux (Vaches, Moutons, Chèvres)

### Gestion des Ventes
- Enregistrement des ventes
- Suivi des transactions
- Historique des ventes

### Tableaux de Bord
- Vue d'ensemble du cheptel
- Statistiques de vente
- Rapports personnalisables

## Configuration
# Frontend
- cd src
- npm install

# Backend
- cd ../back
- npm install

# Backend
- cd back
- npm start

# Frontend (dans un autre terminal)
- cd src
- npm run dev

### Prérequis
- Node.js (v16+)
- MySQL (v8.0+)
- npm ou yarn

### Configuration
1. Cloner le dépôt
   ```bash
   git clone [URL_DU_REPO]
   cd projet-test