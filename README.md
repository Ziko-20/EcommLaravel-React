# My E-Commerce — Application Web Full Stack

Application e-commerce complète construite avec **React + Vite** (frontend) et **Laravel 13 + Sanctum** (backend API REST). Elle permet de gérer une boutique virtuelle avec un espace client complet et un tableau de bord administrateur.

---

## Table des matières

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancer l'application](#lancer-lapplication)
- [Comptes de test](#comptes-de-test)
- [Fonctionnalités](#fonctionnalités)
- [Structure des dossiers](#structure-des-dossiers)
- [Routes API](#routes-api)
- [Base de données](#base-de-données)
- [Composants & Contextes](#composants--contextes)

---

## Aperçu

| Espace | Description |
|--------|-------------|
| **Client** | Parcourir les produits, gérer le panier, passer commande, suivre les livraisons, wishlist, profil |
| **Admin** | Dashboard avec statistiques et chart, CRUD produits/catégories, gestion clients et commandes |

---

## Stack technique

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 19 | Framework UI |
| Vite | 8 | Bundler / Dev server |
| Tailwind CSS | 4 | Styles utilitaires |
| React Router DOM | 7 | Routing SPA |
| Axios | 1.x | Appels HTTP |
| Chart.js + react-chartjs-2 | 4.x / 5.x | Graphique revenus |
| Lucide React | 1.x | Icônes |
| Framer Motion | 12 | Animations de transition |
| i18next + react-i18next | — | Internationalisation (FR / EN) |

### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| PHP | 8.2+ | Langage serveur |
| Laravel | 13 | Framework API REST |
| Laravel Sanctum | 4 | Authentification par token |
| MySQL / SQLite | — | Base de données |
| Eloquent ORM | — | Modèles et relations |

---

## Architecture du projet

```
My_E-commerce/
├── backend/          # API Laravel
├── frontend/         # Application React
├── README.md         # Ce fichier
└── guide.md          # Guide d'utilisation détaillé
```

Séparation stricte frontend / backend. Le frontend consomme l'API via Axios avec des tokens Bearer (Sanctum).

---

## Prérequis

| Outil | Version minimale |
|-------|-----------------|
| PHP | 8.2 |
| Composer | 2.x |
| Node.js | 18 |
| npm | 9 |
| MySQL | 8.0 (ou SQLite pour dev rapide) |

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd My_E-commerce
```

### 2. Backend

```bash
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

### 3. Frontend

```bash
cd frontend
npm install
```

---

## Configuration

### Base de données MySQL (recommandé)

Éditer `backend/.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nom_de_votre_base
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

### Base de données SQLite (développement rapide)

```env
DB_CONNECTION=sqlite
```

Puis créer le fichier :

```bash
# Windows
New-Item -ItemType File -Path "database\database.sqlite" -Force

# Linux / Mac
touch database/database.sqlite
```

### CORS

Le frontend tourne sur `http://localhost:5173` (ou `5174`). Laravel autorise les origines locales par défaut via `fruitcake/laravel-cors`.

---

## Lancer l'application

### Étape 1 — Migrations et données de test

```bash
cd backend

# Créer les tables
php artisan migrate

# Peupler avec des données de test (optionnel mais recommandé)
php artisan db:seed
```

Le seeder crée :
- 1 compte **admin** fixe
- 30 **clients** générés aléatoirement
- 8 **catégories** (Électronique, Vêtements, Alimentation, Maison, Sport, Beauté, Livres, Jouets)
- 60 **produits** avec prix et stock aléatoires
- 50 **commandes** avec 2 à 4 lignes chacune
- Des **wishlists** pour chaque client

### Étape 2 — Démarrer le backend

```bash
cd backend
php artisan serve
# API disponible sur http://localhost:8000
```

### Étape 3 — Démarrer le frontend

```bash
cd frontend
npm run dev
# Interface disponible sur http://localhost:5173
```

> Les deux serveurs doivent tourner simultanément.

---

## Comptes de test

### Administrateur

| Champ | Valeur |
|-------|--------|
| Email | `admin@boutique.ma` |
| Mot de passe | `admin123` |
| Accès | Tableau de bord admin complet |

### Client (généré par le seeder)

| Champ | Valeur |
|-------|--------|
| Email | N'importe quel email dans la table `users` (role = client) |
| Mot de passe | `password` |

Ou créer un compte directement via `/register`.

---

## Fonctionnalités

### Espace Client

#### Authentification
- Inscription avec nom, email, téléphone (indicatif pays), adresse, mot de passe
- Connexion avec redirection automatique selon le rôle (client → `/produits`, admin → `/admin/dashboard`)
- Déconnexion avec révocation du token Sanctum
- Garde de routes — les pages protégées redirigent vers `/` si non connecté

#### Catalogue produits (`/produits`)
- Grille responsive (1 à 4 colonnes selon la taille d'écran)
- **Recherche** en temps réel par nom de produit
- **Filtres** dépliables : catégorie + prix maximum
- Tags de filtres actifs avec suppression individuelle
- Badge de stock coloré (vert / orange / rouge)
- Pagination avec numéros de pages
- Ajout au panier depuis la liste

#### Détail produit (`/produits/:id`)
- Image, nom, description, stock, prix
- **Sélecteur de quantité** avec boutons `+` / `−` (limité au stock disponible)
- Prix total dynamique sur le bouton d'ajout
- Ajout à la wishlist

#### Panier (`/panier`)
- Liste des articles avec image, nom, prix unitaire
- Modification de quantité en ligne (`+` / `−`)
- Suppression d'un article
- Résumé avec sous-total, livraison gratuite, total
- Bouton "Passer au paiement" → redirection vers la page de paiement

#### Paiement simulé (`/paiement`)
- Page dédiée (pas de popup)
- Formulaire : numéro de carte (formaté auto en groupes de 4), nom du titulaire, expiration (MM/AA), CVV
- Validation inline sur chaque champ
- Récapitulatif des articles et du total à droite
- Simulation en 3 étapes : formulaire → processing (spinner 2s) → succès (checkmark + barre de progression) → redirect `/commandes`

#### Commandes (`/commandes`)
- Liste de toutes les commandes passées avec statut coloré
- Exclusion du panier en cours (statut `en_attente`)

#### Détail commande (`/commandes/:id`)
- Barre de progression visuelle en 3 étapes : Commande passée → En cours de livraison → Livrée
- Liste des articles commandés avec quantités et sous-totaux
- Récapitulatif du total

#### Wishlist (`/wishlist`)
- Grille des produits sauvegardés
- Ajout direct au panier depuis la wishlist
- Suppression d'un produit

#### Profil (`/profil`)
- Modification du nom, téléphone, adresse
- Changement de mot de passe (optionnel)
- Email affiché en lecture seule

#### Notifications Toast
- Toasts non-bloquants en bas à droite pour toutes les actions
- 3 types : `success` (vert), `error` (rouge), `info` (bleu)
- Fermeture automatique après 3 secondes ou manuelle

---

### Espace Administrateur

Accessible uniquement aux comptes avec `role = admin`. Toutes les routes `/admin/*` sont protégées côté frontend et backend.

#### Dashboard (`/admin/dashboard`)
- **4 KPI cards** : chiffre d'affaires total, nombre de commandes, clients, produits
- **Graphique revenus** (Chart.js) : courbe de surface sur les 12 derniers mois, tooltip personnalisé, dégradé vert
- **Top 5 produits** les plus vendus avec médailles
- Liens rapides vers toutes les sections

#### Gestion des produits (`/admin/produits`)
- Tableau avec image, catégorie, prix, badge stock
- Recherche par nom
- Ajout, modification, suppression (avec confirmation)

#### Formulaire produit (`/admin/produits/add` et `/admin/produits/edit/:id`)
- Champs : nom, description, prix, stock, URL image, catégorie
- Aperçu de l'image en temps réel
- Mode création et mode édition dans le même composant

#### Gestion des catégories (`/admin/categories`)
- Ajout inline
- Modification inline avec confirmation / annulation
- Suppression avec confirmation

#### Gestion des clients (`/admin/clients`)
- Tableau avec nom, email, téléphone, adresse
- Recherche par nom ou email
- Suppression de compte

#### Gestion des commandes (`/admin/commandes`)
- Tableau de toutes les commandes avec client, date, total, statut
- Filtre par statut
- Changement de statut via menu déroulant inline (`en_attente` → `expediee` → `livree`)

---

## Structure des dossiers

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AdminControllers/
│   │   │   │   ├── AdminCategorieController.php
│   │   │   │   ├── AdminClientController.php
│   │   │   │   ├── AdminCommandeController.php
│   │   │   │   ├── AdminProduitController.php
│   │   │   │   └── AdminStatsController.php
│   │   │   ├── AuthController.php
│   │   │   ├── CommandeController.php
│   │   │   ├── LigneCommandeController.php
│   │   │   ├── ProduitController.php
│   │   │   ├── ProfileController.php
│   │   │   └── WishlistController.php
│   │   └── Middleware/
│   │       └── IsAdmin.php
│   └── Models/
│       ├── Categorie.php
│       ├── Commande.php
│       ├── LigneCommande.php
│       ├── Produit.php
│       ├── User.php
│       └── Wishlist.php
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php

frontend/
└── src/
    ├── assets/
    ├── components/
    │   ├── Footer.jsx
    │   ├── Navbar.jsx
    │   ├── NotFound.jsx
    │   ├── PaymentModal.jsx       # (conservé mais non utilisé)
    │   ├── ProtectedRoute.jsx
    │   └── TransitionRegister.jsx
    ├── context/
    │   ├── AuthContext.jsx        # État utilisateur global
    │   ├── CartContext.jsx        # ID du panier actif
    │   └── ToastContext.jsx       # Notifications globales
    ├── locales/
    │   ├── en/translation.json
    │   └── fr/translation.json
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   └── client/
    │       ├── CommandeDetail.jsx
    │       ├── Commandes.jsx
    │       ├── Paiement.jsx
    │       ├── Panier.jsx
    │       ├── ProductDetail.jsx
    │       ├── Products.jsx
    │       ├── Profil.jsx
    │       └── Wishlist.jsx
    ├── Pages/
    │   └── admin/
    │       ├── AdminCategories.jsx
    │       ├── AdminClients.jsx
    │       ├── AdminCommandes.jsx
    │       ├── AdminLayout.jsx
    │       ├── AdminProduitForm.jsx
    │       ├── AdminProduits.jsx
    │       └── Dashboard.jsx
    ├── services/
    │   ├── authService.js         # login, register, logout, getMe, updateProfile
    │   └── productService.js      # produits, commandes, wishlist, admin
    ├── App.jsx
    ├── i18n.js
    └── main.jsx
```

---

## Routes API

### Publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/register` | Créer un compte |
| `POST` | `/api/login` | Se connecter, retourne un token |
| `GET` | `/api/produits` | Lister les produits (params: `nom_produit`, `prix`, `categorie`, `page`) |
| `GET` | `/api/produits/{id}` | Détail d'un produit |
| `GET` | `/api/categories` | Lister toutes les catégories |

### Authentifiées — `Authorization: Bearer {token}`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/logout` | Révoquer le token |
| `GET` | `/api/me` | Profil de l'utilisateur connecté |
| `PUT` | `/api/profile` | Modifier son profil |
| `GET` | `/api/commandes` | Mes commandes (avec lignes et produits) |
| `POST` | `/api/commandes` | Créer une commande (panier) |
| `GET` | `/api/commandes/{id}` | Détail d'une commande |
| `POST` | `/api/commandes/{id}/lignes` | Ajouter un article au panier |
| `PUT` | `/api/commandes/{id}/lignes/{ligne}` | Modifier la quantité d'un article |
| `DELETE` | `/api/commandes/{id}/lignes/{ligne}` | Supprimer un article du panier |
| `GET` | `/api/wishlist` | Ma wishlist |
| `POST` | `/api/wishlist` | Ajouter un produit à la wishlist |
| `DELETE` | `/api/wishlist/{id}` | Retirer un produit de la wishlist |

### Admin — `role = admin` requis

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/admin/produits` | Lister tous les produits |
| `POST` | `/api/admin/produits` | Créer un produit |
| `PUT` | `/api/admin/produits/{id}` | Modifier un produit |
| `DELETE` | `/api/admin/produits/{id}` | Supprimer un produit |
| `GET` | `/api/admin/categories` | Lister les catégories |
| `POST` | `/api/admin/categories` | Créer une catégorie |
| `PUT` | `/api/admin/categories/{id}` | Modifier une catégorie |
| `DELETE` | `/api/admin/categories/{id}` | Supprimer une catégorie |
| `GET` | `/api/admin/clients` | Lister les clients |
| `DELETE` | `/api/admin/clients/{id}` | Supprimer un client |
| `GET` | `/api/admin/commandes` | Toutes les commandes |
| `PUT` | `/api/admin/commandes/{id}` | Changer le statut d'une commande |
| `GET` | `/api/admin/stats` | Statistiques (CA, top produits, stocks, revenus mensuels) |

---

## Base de données

### Schéma des tables

```
users
├── id, name, email (unique), telephone (unique)
├── adresse, password, role (admin|client)
└── timestamps

categories
├── id, categorie
└── timestamps

produits
├── id, nom_prduit, description_prduit
├── prix (decimal 8,2), stock_produit (int)
├── image (nullable), categorie_id (FK)
└── timestamps

commandes
├── id, user_id (FK), date_commande
├── total (decimal 10,2), statut (en_attente|expediee|livree)
└── timestamps

ligne_commandes
├── id, commandes_id (FK), produit_id (FK)
├── quantite (int), sous_total (decimal 10,2)
└── timestamps

wishlists
├── id, user_id (FK), produit_id (FK)
├── UNIQUE(user_id, produit_id)
└── timestamps
```

### Relations Eloquent

| Modèle | Relations |
|--------|-----------|
| `User` | `hasMany` Commande, `hasMany` Wishlist |
| `Commande` | `belongsTo` User, `hasMany` LigneCommande |
| `LigneCommande` | `belongsTo` Commande, `belongsTo` Produit |
| `Produit` | `belongsTo` Categorie, `hasMany` LigneCommande, `hasMany` Wishlist |
| `Categorie` | `hasMany` Produit |
| `Wishlist` | `belongsTo` User, `belongsTo` Produit |

---

## Composants & Contextes

### Contextes React

| Contexte | Rôle |
|----------|------|
| `AuthContext` | Stocke l'utilisateur connecté, expose `login()`, `logout()` |
| `CartContext` | Stocke l'ID du panier actif (`en_attente`), expose `getPanierID()` |
| `ToastContext` | Expose `toast(message, type)` pour afficher des notifications |

### Gardes de routes

| Composant | Comportement |
|-----------|-------------|
| `ProtectedRoute` | Redirige vers `/` si non connecté |
| `AdminRoute` | Redirige vers `/produits` si connecté mais pas admin |

### Services

**`authService.js`**
```js
login(data)          // POST /api/login
register(data)       // POST /api/register
logout()             // POST /api/logout (avec token)
getMe()              // GET  /api/me
updateProfile(data)  // PUT  /api/profile
```

**`productService.js`**
```js
// Produits publics
getProduits()
getProduitById(id)
getCategories()
getProduitsFilter(nom, prix, categorie, page)

// Panier / Commandes
creerCommande()
getCommandes()
getCommandeById(id)
ajouterLigne(commandeId, produitId, quantite)
modifierLigne(commandeId, ligneId, quantite)
supprimerLigne(commandeId, ligneId)

// Wishlist
getWishlist()
ajouterWishlist(produitId)
supprimerWishlist(id)

// Admin — Produits
adminGetProduits()
adminCreateProduit(data)
adminUpdateProduit(id, data)
adminDeleteProduit(id)

// Admin — Catégories
adminGetCategories()
adminCreateCategorie(data)
adminUpdateCategorie(id, data)
adminDeleteCategorie(id)

// Admin — Clients
adminGetClients()
adminDeleteClient(id)

// Admin — Commandes
adminGetCommandes()
adminUpdateStatutCommande(id, statut)

// Admin — Stats
adminGetStats()
```

---

## Notes importantes

- Le **token** est stocké dans `localStorage` sous la clé `token`
- Le **panier** est une commande avec `statut = en_attente` — une seule par utilisateur à la fois
- La **gestion du stock** est automatique : décrémenté à l'ajout au panier, réincrémenté à la suppression
- Les **images produits** sont des URLs externes (pas d'upload de fichier)
- Le **paiement** est une simulation — aucune donnée bancaire n'est transmise
- L'application supporte **FR / EN** via i18next (sélecteur dans la navbar)
