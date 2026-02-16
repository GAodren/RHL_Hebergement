# ValoFenua - Estimation Immobiliere en Polynesie Francaise

## Presentation du projet

**ValoFenua** est une application web d'estimation immobiliere dediee au marche polynesien. Elle permet aux agents immobiliers et particuliers de Tahiti d'obtenir une estimation de prix pour un bien immobilier en quelques clics, basee sur l'analyse de plus de 1 300 annonces actives du marche local.

> *Valo = valeur, Fenua = terre en tahitien*

**Contexte** : Le marche immobilier polynesien manquait d'un outil d'estimation accessible et gratuit. ValoFenua repond a ce besoin en proposant une interface simple, responsive et sans inscription pour les particuliers, avec un espace professionnel pour les agents immobiliers.

---

## Stack technique

| Technologie | Version | Role |
|---|---|---|
| **React** | 19.2 | Framework UI (SPA) |
| **React Router** | 7.12 | Routage client-side |
| **Vite** | 7.2 | Build tool & serveur de developpement |
| **Tailwind CSS** | 4.1 | Framework CSS utility-first |
| **Supabase** | 2.91 | Backend-as-a-Service (Auth, BDD, Storage) |
| **n8n** (webhook) | - | Moteur d'estimation via API REST |
| **React PDF Renderer** | 4.3 | Generation de rapports PDF cote client |
| **Lucide React** | 0.562 | Librairie d'icones |
| **Vercel** | - | Hebergement & deploiement |

---

## Architecture technique

```
                  +------------------+
                  |   Navigateur     |
                  |   (React SPA)    |
                  +--------+---------+
                           |
              +------------+------------+
              |                         |
     +--------v--------+     +---------v---------+
     |    Supabase      |     |   n8n Webhook     |
     |  (Auth + BDD +   |     |  (API estimation) |
     |   Storage)        |     +-------------------+
     +------------------+
```

### Frontend (React + Vite)

- **Single Page Application** avec React Router
- **Design mobile-first** responsive (Tailwind CSS)
- **Theming** : palette bleu ocean (#0077B6), design epure et professionnel
- **Formatage des prix** en XPF (Francs Pacifiques) et en MF (millions de francs)

### Backend (Supabase)

- **Authentification** : email/mot de passe via Supabase Auth (pas d'inscription publique, comptes crees par admin)
- **Base de donnees** PostgreSQL hebergee avec 2 tables principales :
  - `users_profiles` : profils agents (nom, agence, carte pro, logo...)
  - `estimations` : historique des estimations avec prix, photos, parametres de rapport
- **Storage** : 2 buckets pour les fichiers
  - `logos` : logos d'agences (max 2 Mo, JPG/PNG)
  - `estimation-photos` : photos de biens (max 5 Mo)

### API d'estimation (n8n)

- **Workflow n8n** expose via webhook REST
- **Endpoint** : `POST https://n8n.srv1206491.hstgr.cloud/webhook/estimation`
- **Principe** : le workflow n8n analyse les donnees du marche (annonces de immobilier.pf) et calcule une fourchette de prix en fonction des criteres du bien

---

## Integration API n8n - Detail

### Requete

```json
POST /webhook/estimation
Content-Type: application/json

{
  "commune": "Punaauia",
  "categorie": "Maison",
  "type_bien": "F4",
  "surface": 120,
  "surface_terrain": null,
  "etat_bien": "bon",
  "caracteristiques": ["piscine", "vue_mer"]
}
```

**Parametres :**

| Champ | Type | Requis | Description |
|---|---|---|---|
| `commune` | string | Oui | Parmi 12 communes de Tahiti |
| `categorie` | string | Oui | Maison, Appartement, Terrain |
| `type_bien` | string | Conditionnel | Studio, F1 a F5, >F5 |
| `surface` | number | Oui | Surface habitable en m2 |
| `surface_terrain` | number | Non | Surface terrain (requis si Terrain) |
| `etat_bien` | string | Non | neuf, excellent, bon, rafraichir, renover |
| `caracteristiques` | array | Non | villa, vue_mer, piscine, etc. |

### Reponse

```json
{
  "prix_bas": 95000000,
  "prix_moyen": 116500000,
  "prix_haut": 138000000,
  "prix_m2_moyen": 900000,
  "comparables": [
    {
      "titre": "Maison F4 Punaauia",
      "prix": 110000000,
      "surface": 115,
      "commune": "Punaauia"
    }
  ]
}
```

Les prix sont en **XPF (Francs Pacifiques)**. L'affichage utilise le format **MF** (millions de francs) pour les fourchettes et **XPF** pour le prix au m2.

---

## Fonctionnalites

### Estimation immobiliere

- Formulaire dynamique adapte selon la categorie (Maison/Appartement/Terrain)
- Champs conditionnels : type de bien, surface terrain, etat, caracteristiques
- Appel API n8n avec spinner de chargement ("Analyse en cours...")
- Affichage du resultat avec fourchette de prix (bas / estime / haut)
- Barre visuelle de fourchette de prix interactive
- Ajustement manuel du prix via slider
- Affichage des biens comparables retournes par l'API
- Graphique de tendances du marche (donnees historiques 2020-2025)

### Gestion des photos

- Upload de photo principale du bien
- Upload de photos supplementaires (jusqu'a 5) avec descriptions
- Stockage sur Supabase Storage
- Integration dans le rapport PDF

### Generation de rapport PDF

- Rapport professionnel genere cote client avec `@react-pdf/renderer`
- Branding de l'agence (logo, nom, description)
- Sections personnalisables (visibilite toggleable)
- Donnees du bien, fourchette de prix, photos, comparables
- Champs de notes et commentaires personnalisables
- Telechargement direct en PDF

### Espace professionnel

- Authentification securisee (Supabase Auth)
- Dashboard avec onglets
- Historique de toutes les estimations
- Gestion du profil agent (nom, agence, carte pro, logo)
- Sauvegarde automatique des estimations en base

### Pages du site

| Route | Page | Acces |
|---|---|---|
| `/connexion` | Connexion (email + mot de passe) | Public |
| `/` | Accueil (hero, stats, fonctionnement, avantages) | Protege |
| `/estimation` | Formulaire d'estimation + resultats | Protege |
| `/rapport` | Rapport d'estimation detaille | Protege |
| `/dashboard` | Tableau de bord (estimations + profil) | Protege |
| `/profil` | Edition du profil | Protege |
| `/about` | A propos | Protege |
| `/contact` | Contact | Protege |
| `/mentions-legales` | Mentions legales | Protege |
| `/cgv` | Conditions generales | Protege |

---

## Schema de la base de donnees

### Table `users_profiles`

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Lie a `auth.users` |
| `nom` | text | Nom de l'agent |
| `prenom` | text | Prenom |
| `email` | text | Email professionnel |
| `telephone` | text | Telephone |
| `agence` | text | Nom de l'agence |
| `numero_carte_pro` | text | Carte professionnelle |
| `adresse` | text | Adresse de l'agence |
| `site_web` | text | Site web |
| `description_agence` | text | Description de l'agence |
| `logo_url` | text | URL du logo (Supabase Storage) |

### Table `estimations`

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Identifiant unique |
| `user_id` | uuid (FK) | Lie a `auth.users` |
| `created_at` | timestamp | Date de creation |
| `commune` | text | Commune du bien |
| `categorie` | text | Maison / Appartement / Terrain |
| `type_bien` | text | Studio, F1-F5, >F5 |
| `surface` | numeric | Surface en m2 |
| `prix_bas` | numeric | Fourchette basse (XPF) |
| `prix_moyen` | numeric | Prix estime (XPF) |
| `prix_haut` | numeric | Fourchette haute (XPF) |
| `prix_m2_moyen` | numeric | Prix au m2 (XPF) |
| `prix_ajuste` | numeric | Prix ajuste manuellement |
| `photo_url` | text | Photo principale |
| `photos_supplementaires` | jsonb | Photos additionnelles |
| `comparables` | jsonb | Biens comparables |
| `section_visibility` | jsonb | Visibilite des sections PDF |
| `hidden_comparables` | jsonb | Comparables masques |
| `nom_client` | text | Nom du client (rapport) |
| `texte_*` | text | Champs de personnalisation du rapport |

---

## Structure du code source

```
valofenua/
├── public/
│   └── logo-icon.png
├── src/
│   ├── main.jsx                    # Point d'entree React
│   ├── App.jsx                     # Routeur + AuthProvider
│   ├── index.css                   # Styles globaux + Tailwind
│   ├── context/
│   │   └── AuthContext.jsx         # Contexte d'authentification
│   ├── components/
│   │   ├── Header.jsx              # Navigation responsive
│   │   ├── Footer.jsx              # Pied de page
│   │   ├── Logo.jsx                # Composant logo
│   │   ├── Hero.jsx                # Section hero (accueil)
│   │   ├── Stats.jsx               # Statistiques (accueil)
│   │   ├── HowItWorks.jsx          # Fonctionnement (accueil)
│   │   ├── Features.jsx            # Avantages (accueil)
│   │   ├── CTA.jsx                 # Call-to-action (accueil)
│   │   ├── EstimationForm.jsx      # Formulaire d'estimation
│   │   ├── EstimationResult.jsx    # Affichage des resultats
│   │   ├── PriceRangeBar.jsx       # Barre visuelle de prix
│   │   ├── PriceAdjuster.jsx       # Slider d'ajustement
│   │   ├── SimilarOffers.jsx       # Biens comparables
│   │   ├── MarketTrends.jsx        # Graphique tendances
│   │   ├── RapportPDF.jsx          # Generateur PDF
│   │   └── ProtectedRoute.jsx      # Protection des routes
│   ├── pages/
│   │   ├── Home.jsx                # Page d'accueil
│   │   ├── Estimation.jsx          # Page estimation
│   │   ├── Connexion.jsx           # Page connexion
│   │   ├── Profil.jsx              # Page profil
│   │   ├── Dashboard.jsx           # Tableau de bord
│   │   ├── MesEstimations.jsx      # Historique estimations
│   │   ├── RapportEstimation.jsx   # Page rapport
│   │   ├── About.jsx               # A propos
│   │   ├── Contact.jsx             # Contact
│   │   ├── MentionsLegales.jsx     # Mentions legales
│   │   └── CGV.jsx                 # CGV
│   ├── utils/
│   │   ├── supabase.js             # Client Supabase
│   │   ├── api.js                  # Appels API n8n + constantes
│   │   ├── formatPrice.js          # Formatage XPF / MF
│   │   └── estimations.js          # CRUD estimations (Supabase)
│   └── data/
│       └── prixHistorique.js       # Donnees historiques 2020-2025
├── vercel.json                     # Configuration Vercel (SPA)
├── vite.config.js                  # Configuration Vite + plugins
├── eslint.config.js                # Configuration ESLint
└── package.json                    # Dependances
```

---

## Flux utilisateur

```
Connexion (email/mot de passe)
    |
    v
Page d'accueil (presentation du service)
    |
    v
Formulaire d'estimation
    |-- Saisie : commune, categorie, type, surface, etat, caracteristiques
    |-- Upload photos (optionnel)
    |
    v
Appel API n8n (webhook POST)
    |
    v
Affichage des resultats
    |-- Fourchette de prix (barre visuelle)
    |-- Prix au m2
    |-- Biens comparables
    |-- Tendances du marche
    |-- Ajustement manuel du prix
    |
    v
Sauvegarde en base (Supabase)
    |
    v
Generation rapport PDF (personnalisable)
    |-- Branding agence
    |-- Sections selectionnables
    |-- Telechargement direct
```

---

## Couverture geographique

12 communes de Tahiti :

| # | Commune |
|---|---|
| 1 | Papeete |
| 2 | Punaauia |
| 3 | Faaa |
| 4 | Pirae |
| 5 | Arue |
| 6 | Mahina |
| 7 | Paea |
| 8 | Papara |
| 9 | Taiarapu-Est |
| 10 | Taiarapu-Ouest |
| 11 | Teva I Uta |
| 12 | Hitiaa O Te Ra |

---

## Competences mises en oeuvre

- **Frontend** : React 19, React Router, composants fonctionnels, hooks (useState, useEffect, useContext, useNavigate), Context API
- **Styling** : Tailwind CSS 4, design responsive mobile-first, theming custom
- **Backend-as-a-Service** : Supabase (Auth, PostgreSQL, Storage, Row Level Security)
- **Integration API** : consommation d'un webhook n8n en REST (POST/JSON), gestion des etats de chargement et d'erreur
- **Automatisation** : n8n comme moteur de calcul d'estimation via workflow automatise
- **Generation PDF** : creation de documents PDF structures cote client avec `@react-pdf/renderer`
- **Build & Deploy** : Vite (bundler), Vercel (CI/CD & hosting)
- **UX/UI** : interface accessible pour un public non technique, formulaires dynamiques, feedback visuel
- **Gestion d'etat** : Context API pour l'authentification et les donnees utilisateur
- **Securite** : routes protegees, authentification par session, pas d'exposition de donnees sensibles
