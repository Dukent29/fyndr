# EmoCrypt

Application de messagerie sécurisée avec chiffrement Vigenère et affichage en emojis.

## Description

EmoCrypt est une application web de messagerie chiffrée qui transforme vos messages en emojis grâce à un algorithme de chiffrement Vigenère avancé. Chaque conversation est protégée par un système de chiffrement unique basé sur les UUID des utilisateurs et un sel temporel.

## Fonctionnalités

- Chiffrement Vigenère avec sel dynamique (SHA-256)
- Messages transformés en emojis
- Conversations en temps réel
- Interface utilisateur moderne et intuitive
- Sélecteur d'emojis intégré
- Système d'authentification par username
- Protection maximale des données

## Technologies

- **Backend**: Node.js, Express.js
- **Base de données**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Sécurité**: Chiffrement Vigenère, SHA-256, UUID

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL
- XAMPP (optionnel)

### Étapes

1. Cloner le repository
```bash
git clone https://github.com/Dukent29/fyndr.git
cd fyndr
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer la base de données
   - Créer une base de données MySQL nommée `emocrypt`
   - Importer le fichier `emocrypt.sql`

4. Configurer les variables d'environnement
   - Copier `.env.example` vers `.env`
   - Modifier les paramètres de connexion MySQL

5. Démarrer le serveur
```bash
npm start
```

6. Accéder à l'application
```
http://localhost:3000
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=emocrypt
PORT=3000
```

## Utilisation

1. Entrer un username (minimum 2 caractères)
2. Sélectionner un contact dans la liste
3. Envoyer des messages chiffrés
4. Cliquer sur "Afficher" pour déchiffrer les messages reçus
5. Utiliser le sélecteur d'emojis pour enrichir vos messages

## Architecture

```
fyndr/
├── config/          # Configuration de la base de données
├── controllers/     # Logique métier
├── routes/          # Routes API
├── public/          # Frontend (HTML, CSS, JS)
│   ├── js/         # Scripts JavaScript
│   └── style.css   # Styles
├── server.js        # Point d'entrée
└── emocrypt.sql     # Schéma de base de données
```

## Sécurité

- Chiffrement unique par conversation
- Sel dynamique basé sur UUID + timestamp
- Hash SHA-256 pour la génération des offsets
- Aucun stockage de clés en clair
- Messages chiffrés côté client avant envoi

## Licence

MIT