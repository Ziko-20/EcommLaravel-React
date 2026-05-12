# Guide d'utilisation — Mon E-Commerce

Application web e-commerce construite avec **React + Vite** (frontend) et **Laravel + Sanctum** (backend API).

---

## Sommaire

1. [Prérequis](#1-prérequis)
2. [Installation](#2-installation)
3. [Lancer l'application](#3-lancer-lapplication)
4. [Utilisation côté client](#4-utilisation-côté-client)
5. [Utilisation côté administrateur](#5-utilisation-côté-administrateur)
6. [Structure du projet](#6-structure-du-projet)
7. [Routes API](#7-routes-api)

---

## 1. Prérequis

| Outil | Version minimale |
|-------|-----------------|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 18+ |
| npm | 9+ |
| MySQL / MariaDB | 8.0+ |

---

## 2. Installation

### Backend (Laravel)

```bash
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_DATABASE=ecommerce
# DB_USERNAME=root
# DB_PASSWORD=

# Créer les tables et insérer les données de test
php artisan migrate --seed

# Lier le stockage public (pour les images)
php artisan storage:link
```

### Frontend (React)

```bash
cd frontend

# Installer les dépendances JS
npm install
```

---

## 3. Lancer l'application

### Démarrer le backend

```bash
cd backend
php artisan serve
# API disponible sur http://localhost:8000
```

### Démarrer le frontend

```bash
cd frontend
npm run dev
# Interface disponible sur http://localhost:5173
```

> Les deux serveurs doivent tourner en même temps.

---

## 4. Utilisation côté client

### 4.1 Créer un compte

1. Ouvrir `http://localhost:5173`
2. Cliquer sur **"Vous n'avez pas de compte ? Créez-en un"**
3. Remplir le formulaire :
   - Nom & Prénom
   - Email
   - Téléphone (sélectionner l'indicatif pays)
   - Adresse
   - Mot de passe
4. Cliquer sur **S'inscrire** → redirection automatique vers la boutique

### 4.2 Se connecter

1. Saisir l'email et le mot de passe
2. Cliquer sur **Se connecter**
3. Redirection automatique :
   - Compte **client** → page Produits
   - Compte **admin** → tableau de bord Admin

### 4.3 Parcourir les produits

- La page `/produits` affiche tous les produits en grille (4 colonnes)
- **Recherche** : taper dans la barre de recherche pour filtrer par nom
- **Filtre catégorie** : sélectionner une catégorie dans le menu déroulant
- **Filtre prix** : saisir un prix maximum
- **Pagination** : naviguer entre les pages avec les boutons ← →
- Cliquer sur une carte produit pour voir le **détail**

### 4.4 Détail d'un produit

La page de détail affiche :
- Image, nom, description, prix, stock disponible
- Bouton **Ajouter au panier** — ajoute 1 unité au panier actif
- Bouton **Ajouter à la wishlist** — sauvegarde le produit pour plus tard

### 4.5 Gérer le panier

Accéder au panier via la navbar → **Panier** ou `/panier`

- **Modifier la quantité** : utiliser les boutons `+` et `−` sur chaque article
- **Supprimer un article** : cliquer sur l'icône corbeille 🗑
- Le **résumé** à droite affiche le total et la livraison (gratuite)
- Cliquer sur **Valider la commande** pour confirmer l'achat

> Le panier correspond à une commande avec le statut `en_attente`. La validation la fait passer au suivi.

### 4.6 Suivre ses commandes

Accéder via la navbar → **Commandes** ou `/commandes`

- Liste de toutes les commandes passées avec leur statut :
  - 🟡 **En attente** — commande reçue
  - 🔵 **Expédiée** — en cours de livraison
  - 🟢 **Livrée** — commande reçue
- Cliquer sur une commande pour voir le **détail** avec :
  - Barre de progression visuelle (3 étapes)
  - Liste des articles commandés
  - Total de la commande

### 4.7 Wishlist

Accéder via la navbar → **Wishlist** ou `/wishlist`

- Affiche tous les produits sauvegardés
- Bouton **Panier** : ajouter directement au panier
- Bouton **Supprimer** : retirer de la wishlist

### 4.8 Modifier son profil

Accéder via le menu utilisateur (en haut à droite) → **Profil** ou `/profil`

- Modifier : nom, téléphone, adresse
- Changer le mot de passe (laisser vide pour ne pas le modifier)
- Cliquer sur **Enregistrer les modifications**

### 4.9 Se déconnecter

Cliquer sur le nom d'utilisateur en haut à droite → **Déconnexion**

---

## 5. Utilisation côté administrateur

> Le compte admin doit avoir `role = 'admin'` dans la base de données.

Après connexion avec un compte admin, redirection automatique vers `/admin/dashboard`.

### 5.1 Tableau de bord

URL : `/admin/dashboard`

Affiche :
- **Chiffre d'affaires total** (somme de toutes les commandes)
- **Nombre de produits en stock faible** (≤ 10 unités)
- **Top 5 produits** les plus vendus
- **Liste des stocks faibles** avec alerte visuelle
- **Liens rapides** vers toutes les sections admin

### 5.2 Gestion des produits

URL : `/admin/produits`

- **Lister** tous les produits avec image, catégorie, prix et stock
- **Rechercher** un produit par nom
- **Ajouter** un produit → bouton **Ajouter** en haut à droite
- **Modifier** un produit → icône crayon ✏️
- **Supprimer** un produit → icône corbeille 🗑 (confirmation requise)

#### Formulaire produit (`/admin/produits/add` ou `/admin/produits/edit/:id`)

Champs à remplir :
| Champ | Description |
|-------|-------------|
| Nom du produit | Nom affiché dans la boutique |
| Description | Texte descriptif |
| Prix (DH) | Prix de vente |
| Stock | Quantité disponible |
| URL de l'image | Lien vers l'image du produit |
| Catégorie | Sélectionner parmi les catégories existantes |

### 5.3 Gestion des catégories

URL : `/admin/categories`

- **Ajouter** une catégorie : saisir le nom et cliquer sur **Ajouter**
- **Modifier** une catégorie : cliquer sur ✏️, modifier le nom, valider avec ✓
- **Annuler** une modification : cliquer sur ✗
- **Supprimer** une catégorie : cliquer sur 🗑 (confirmation requise)

> Attention : supprimer une catégorie supprime aussi tous les produits associés (cascade).

### 5.4 Gestion des clients

URL : `/admin/clients`

- **Lister** tous les clients avec nom, email, téléphone et adresse
- **Rechercher** par nom ou email
- **Supprimer** un client → icône 🗑 (action irréversible)

### 5.5 Gestion des commandes

URL : `/admin/commandes`

- **Lister** toutes les commandes avec client, date, total et statut
- **Filtrer** par statut (En attente / Expédiée / Livrée)
- **Changer le statut** d'une commande via le menu déroulant dans la colonne Action

Workflow typique :
```
en_attente → expediee → livree
```

---

## 6. Structure du projet

```
My_E-commerce/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AdminControllers/   # Contrôleurs admin
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CommandeController.php
│   │   │   │   ├── LigneCommandeController.php
│   │   │   │   ├── ProduitController.php
│   │   │   │   ├── WishlistController.php
│   │   │   │   └── ProfileController.php
│   │   │   └── Middleware/
│   │   │       └── IsAdmin.php         # Garde rôle admin
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Produit.php
│   │       ├── Categorie.php
│   │       ├── Commande.php
│   │       ├── LigneCommande.php
│   │       └── Wishlist.php
│   ├── database/migrations/            # Schéma BDD
│   └── routes/api.php                  # Toutes les routes API
│
└── frontend/                   # Application React
    └── src/
        ├── context/
        │   ├── AuthContext.jsx         # État utilisateur global
        │   └── CartContext.jsx         # État panier global
        ├── services/
        │   ├── authService.js          # Appels API auth
        │   └── productService.js       # Appels API produits/commandes/admin
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProtectedRoute.jsx      # Gardes de routes
        ├── pages/
        │   ├── auth/                   # Login, Register
        │   └── client/                 # Products, Panier, Commandes...
        └── Pages/
            └── admin/                  # Dashboard, AdminProduits...
```

---

## 7. Routes API

### Publiques

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/register` | Créer un compte |
| POST | `/api/login` | Se connecter |
| GET | `/api/produits` | Lister les produits (filtres: `nom_produit`, `prix`, `categorie`, `page`) |
| GET | `/api/produits/{id}` | Détail d'un produit |
| GET | `/api/categories` | Lister les catégories |

### Authentifiées (token requis)

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/logout` | Se déconnecter |
| GET | `/api/me` | Profil de l'utilisateur connecté |
| PUT | `/api/profile` | Modifier son profil |
| GET | `/api/commandes` | Mes commandes |
| POST | `/api/commandes` | Créer une commande (panier) |
| GET | `/api/commandes/{id}` | Détail d'une commande |
| POST | `/api/commandes/{id}/lignes` | Ajouter un article au panier |
| PUT | `/api/commandes/{id}/lignes/{ligne}` | Modifier la quantité |
| DELETE | `/api/commandes/{id}/lignes/{ligne}` | Supprimer un article |
| GET | `/api/wishlist` | Ma wishlist |
| POST | `/api/wishlist` | Ajouter à la wishlist |
| DELETE | `/api/wishlist/{id}` | Retirer de la wishlist |

### Admin uniquement (`role = admin`)

| Méthode | URL | Description |
|---------|-----|-------------|
| GET/POST | `/api/admin/produits` | Lister / Créer un produit |
| PUT/DELETE | `/api/admin/produits/{id}` | Modifier / Supprimer un produit |
| GET/POST | `/api/admin/categories` | Lister / Créer une catégorie |
| PUT/DELETE | `/api/admin/categories/{id}` | Modifier / Supprimer une catégorie |
| GET | `/api/admin/clients` | Lister les clients |
| DELETE | `/api/admin/clients/{id}` | Supprimer un client |
| GET | `/api/admin/commandes` | Toutes les commandes |
| PUT | `/api/admin/commandes/{id}` | Changer le statut d'une commande |
| GET | `/api/admin/stats` | Statistiques globales |

---

## Notes

- L'authentification utilise **Laravel Sanctum** (tokens Bearer)
- Le token est stocké dans le `localStorage` du navigateur
- Les routes client et admin sont protégées côté frontend par `ProtectedRoute` et `AdminRoute`
- Le panier est une commande avec le statut `en_attente` — une seule par utilisateur à la fois
- Les images produits sont des URLs externes (pas d'upload fichier)
