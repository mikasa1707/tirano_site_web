# Tirano Website

Site vitrine professionnel avec administration complète.

## Stack technique

### Frontend

* Angular Standalone
* TypeScript
* Bootstrap 5
* FontAwesome
* Lazy Loading Routes
* Components génériques :

  * DataTable
  * FormBuilder
  * Modal
  * Pagination
  * MediaUploader

### Backend

* NestJS
* TypeScript
* TypeORM
* MySQL / MariaDB
* JWT Authentication
* Upload Media
* API REST

---

# Architecture du projet

```
tirano/
│
├── tirano-frontend/
│   ├── src/
│   ├── environments/
│   └── angular.json
│
├── tirano-backend/
│   ├── src/
│   ├── uploads/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# Modules disponibles

## Public

* Accueil
* Services
* Projets
* Produits
* Articles
* Contact

## Administration

* Dashboard
* Utilisateurs
* Services
* Projets
* Produits
* Articles
* Témoignages
* Messages
* Paramètres du site

---

# Backend

## Installation

```bash
cd tirano-backend

npm install
```

---

## Configuration environnement

Créer un fichier :

```
.env
```

Exemple :

```env
NODE_ENV=development

PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=tirano

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d


UPLOAD_PATH=uploads

FRONTEND_URL=http://localhost:4200
```

---

## Environnements Backend

### Développement

Fichier :

```
.env
```

Configuration locale :

```env
NODE_ENV=development
```

Base locale MySQL/MariaDB.

---

### Production

Créer :

```
.env.production
```

Exemple :

```env
NODE_ENV=production

PORT=3000

DB_HOST=production_host
DB_PORT=3306
DB_USERNAME=production_user
DB_PASSWORD=production_password
DB_DATABASE=tirano

JWT_SECRET=production_secret

FRONTEND_URL=https://domain.com
```

Ne jamais versionner ces fichiers.

---

## Lancer le backend

Développement :

```bash
npm run start:dev
```

Production :

```bash
npm run build

npm run start:prod
```

---

# Frontend

## Installation

```bash
cd tirano-frontend

npm install
```

---

# Environnements Angular

Structure :

```
src/
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## Development

`environment.ts`

```ts
export const environment = {

 production:false,

 apiUrl:'http://localhost:3000'

};
```

---

## Production

`environment.prod.ts`

```ts
export const environment = {

 production:true,

 apiUrl:'https://api.domain.com'

};
```

---

## Lancer Angular

Développement :

```bash
npm start
```

ou :

```bash
ng serve
```

Production :

```bash
ng build --configuration production
```

---

# Authentification

Le système utilise :

* JWT Access Token
* Auth Guard Angular
* HTTP Interceptor
* Gestion des rôles utilisateurs

Rôles :

```
ADMIN
EDITOR
USER
```

---

# Gestion Media

Le système média est centralisé.

Utilisé par :

* Services
* Projects
* Products
* Articles
* Testimonials
* User Avatar

Fonctionnalités :

* Upload
* Suppression
* Galerie
* Association aux entités

---

# Base de données

ORM :

```
TypeORM
```

Entités principales :

```
User
Media
Setting
Service
Project
Product
Article
Testimonial
Message
```

---

# Développement

## Ajouter un module Angular

Convention :

```
features/
└── module/
    ├── pages/
    ├── components/
    ├── models/
    └── api.service.ts
```

---

## Ajouter une API Backend

Convention :

```
module/
├── controller
├── service
├── entity
├── dto
└── module
```

---

# Git

## Fichiers ignorés

Ne jamais envoyer :

```
.env
.env.production

node_modules/

dist/

uploads/

.angular/
```

---

# Installation complète

## Backend

```bash
cd tirano-backend

npm install

npm run start:dev
```

## Frontend

```bash
cd tirano-frontend

npm install

npm start
```

---

# Production

Process recommandé :

Frontend :

```
Angular build
        |
        v
Serveur Web / CDN
```

Backend :

```
NestJS
        |
        v
PM2 / Docker / Serveur Node
```

Base :

```
MySQL / MariaDB
```

---

# Sécurité

Avant mise en production :

* Modifier JWT_SECRET
* Désactiver synchronize TypeORM
* Configurer CORS
* Configurer HTTPS
* Sauvegarder la base
* Protéger les variables d'environnement

---

# Auteur

Projet développé avec Angular + NestJS.
