# ValoFenua - Guide du projet

## 🎯 Objectif

Créer un site web d'estimation immobilière pour la Polynésie française, inspiré de [valomaison.fr](https://valomaison.fr/).

**Nom du projet : ValoFenua** (Valo = valeur, Fenua = terre en tahitien)

---

## 👥 Cible utilisateur

- **Qui** : Agents immobiliers et particuliers de Tahiti
- **Niveau tech** : Pas très avancé technologiquement
- **Usage** : Obtenir rapidement une estimation de prix pour un bien immobilier
- **Appareils** : Desktop et mobile (beaucoup utilisent leur téléphone)
- **Accès** : 100% gratuit, sans inscription

---

## 🛠️ Stack technique

```
Framework : React + Vite (ou Next.js)
Style : Tailwind CSS
Langage : JavaScript ou TypeScript
Icônes : Lucide React
```

---

## 🔌 API disponible

### Endpoint d'estimation

```
URL : https://n8n.srv1206491.hstgr.cloud/webhook/estimation
Méthode : POST
Content-Type : application/json
```

**Request :**
```json
{
  "commune": "Punaauia",
  "categorie": "Maison",
  "type_bien": "F4",
  "surface": 120
}
```

**Response :**
```json
{
  "prix_bas": 95000000,
  "prix_moyen": 116500000,
  "prix_haut": 138000000,
  "prix_m2_moyen": 900000
}
```

### Valeurs des champs

**Communes (12) :**
- Papeete
- Punaauia
- Faaa
- Pirae
- Arue
- Mahina
- Paea
- Papara
- Taiarapu-Est
- Taiarapu-Ouest
- Teva I Uta
- Hitiaa O Te Ra

**Catégories :**
- Maison
- Appartement
- Terrain

**Types de bien :**
- Studio
- F1
- F2
- F3
- F4
- F5
- >F5

---


## 🔐 Authentification & Base de données

### Supabase Configuration
```
URL : https://eamccielxfkhdpmlthti.supabase.co
Anon Key : [eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbWNjaWVseGZraGRwbWx0aHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzU2OTcsImV4cCI6MjA4MTY1MTY5N30.dHvqmsPjWPD15KKOpbprvcWQoOTSalz38yRNBdU28Pk]
```

### Installation
```bash
npm install @supabase/supabase-js
```

### Client Supabase (src/utils/supabase.js)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Variables d'environnement (.env)
```
VITE_SUPABASE_URL=https://[TON_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[TA_CLE_ANON_PUBLIC]
```

### Table users_profiles

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | ID utilisateur (lié à auth.users) |
| nom | text | Nom de l'agent |
| prenom | text | Prénom |
| email | text | Email professionnel |
| telephone | text | Téléphone |
| agence | text | Nom de l'agence |
| numero_carte_pro | text | Carte professionnelle |
| logo_url | text | Logo de l'agence |

### Authentification

- **Pas d'inscription publique** : les comptes sont créés manuellement par l'admin
- **Connexion uniquement** : email + mot de passe
- Utiliser `supabase.auth.signInWithPassword()`
- Stocker la session avec `supabase.auth.getSession()`

### Exemples d'utilisation

**Connexion :**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'agent@example.com',
  password: 'password123'
})
```

**Déconnexion :**
```javascript
await supabase.auth.signOut()
```

**Récupérer le profil :**
```javascript
const { data: profile } = await supabase
  .from('users_profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

**Mettre à jour le profil :**
```javascript
const { error } = await supabase
  .from('users_profiles')
  .update({ nom: 'Dupont', prenom: 'Jean' })
  .eq('id', user.id)
```

---

## 📄 Pages à ajouter

### Page Connexion (/connexion)

- Formulaire email + mot de passe
- Pas de lien "Créer un compte" (comptes créés par admin)
- Redirection vers /profil après connexion
- Message d'erreur si identifiants incorrects

### Page Mon Profil (/profil)

- Accessible uniquement si connecté (sinon redirection vers /connexion)
- Affiche et permet de modifier : nom, prénom, téléphone, agence, n° carte pro
- Bouton "Enregistrer"
- Bouton "Déconnexion"

### Header (modification)

- Si non connecté : afficher bouton "Connexion"
- Si connecté : afficher "Mon profil" + "Déconnexion"





## 📄 Structure du site

### Page d'accueil (/)

Structure inspirée de valomaison.fr :

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  Logo ValoFenua                        [Estimer mon bien]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO SECTION                                               │
│                                                             │
│  Estimez la valeur de votre bien                           │
│  immobilier à Tahiti                                        │
│                                                             │
│  Obtenez une estimation gratuite en 2 minutes,             │
│  basée sur les annonces du marché polynésien.              │
│                                                             │
│  [🎯 Estimer mon bien]    [Comment ça marche ?]            │
│                                                             │
│  ✓ 100% gratuit   ✓ Sans inscription   ✓ Résultat immédiat │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STATS SECTION (3 colonnes)                                 │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   1300+     │ │     12      │ │   2 min     │           │
│  │  annonces   │ │  communes   │ │   temps     │           │
│  │  analysées  │ │  couvertes  │ │  moyen      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  COMMENT ÇA MARCHE ? (3 étapes)                            │
│                                                             │
│  ①                    ②                    ③               │
│  Décrivez votre      Précisez les        Obtenez votre     │
│  bien                critères            estimation        │
│                                                             │
│  Commune, catégorie  Type de bien,       Fourchette de     │
│  du bien             surface en m²       prix basée sur    │
│                                          le marché         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  POURQUOI VALOFENUA ? (4 ou 6 cartes)                      │
│                                                             │
│  📊 Données du marché local                                │
│  Basé sur les annonces actives de Tahiti                   │
│                                                             │
│  🔒 100% confidentiel                                      │
│  Aucune donnée personnelle collectée                       │
│                                                             │
│  ⚡ Résultat instantané                                    │
│  Estimation en moins de 2 minutes                          │
│                                                             │
│  🆓 Totalement gratuit                                     │
│  Sans inscription, sans engagement                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CTA FINAL (fond bleu)                                     │
│                                                             │
│  Prêt à estimer votre bien ?                               │
│  [🎯 Estimer maintenant]                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
│  ValoFenua · Données basées sur immobilier.pf              │
│  Estimation indicative · © 2025                            │
└─────────────────────────────────────────────────────────────┘
```

### Page d'estimation (/estimation)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Estimez votre bien                                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Commune *                                          │   │
│  │  [Sélectionnez une commune          ▼]             │   │
│  │                                                     │   │
│  │  Catégorie *                                        │   │
│  │  [Maison / Appartement / Terrain    ▼]             │   │
│  │                                                     │   │
│  │  Type de bien                                       │   │
│  │  [F1 / F2 / F3 / F4 / F5 / >F5      ▼]             │   │
│  │                                                     │   │
│  │  Surface habitable (m²) *                           │   │
│  │  [        ]                                         │   │
│  │                                                     │   │
│  │  [🎯 Obtenir mon estimation]                        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  RÉSULTAT (affiché après soumission)                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  💰 Estimation pour votre bien                      │   │
│  │                                                     │   │
│  │  Maison F4 de 120 m² à Punaauia                    │   │
│  │                                                     │   │
│  │       95 MF         116,5 MF         138 MF        │   │
│  │       (bas)         (estimé)         (haut)        │   │
│  │         ●━━━━━━━━━━━━━●━━━━━━━━━━━━━●              │   │
│  │                                                     │   │
│  │  Prix au m² dans le secteur : 900 000 XPF          │   │
│  │                                                     │   │
│  │  [Nouvelle estimation]                              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design

### Couleurs

```css
:root {
  /* Couleur principale - Bleu océan */
  --primary: #0077B6;
  --primary-hover: #005f8a;
  --primary-light: #E0F4FF;
  
  /* Neutres */
  --background: #F8FAFC;
  --white: #FFFFFF;
  --text: #1E293B;
  --text-light: #64748B;
  --border: #E2E8F0;
}
```

### Style général

- ✅ Design épuré et professionnel (comme valomaison.fr)
- ✅ Beaucoup d'espace blanc
- ✅ Sections bien délimitées avec alternance fond blanc/gris clair
- ✅ Boutons larges avec hover states
- ✅ Mobile-first (responsive)
- ✅ Ombres légères sur les cartes
- ✅ Coins arrondis

### Typographie

- Police : Inter ou système
- Titres : font-bold
- Corps : text-base (16px)

---

## 💰 Formatage des prix

Les prix sont en **XPF (Francs Pacifiques)**.

```javascript
// utils/formatPrice.js

// Format complet : 116 500 000 XPF
export function formatPriceXPF(price) {
  if (!price) return '—';
  return new Intl.NumberFormat('fr-FR').format(price) + ' XPF';
}

// Format millions : 116,5 MF
export function formatPriceMF(price) {
  if (!price) return '—';
  const millions = price / 1000000;
  if (millions >= 1) {
    return millions.toFixed(1).replace('.', ',') + ' MF';
  }
  return new Intl.NumberFormat('fr-FR').format(price) + ' XPF';
}
```

**Règle d'affichage :**
- Fourchette de prix → format MF (ex: "116,5 MF")
- Prix au m² → format XPF (ex: "900 000 XPF")

---

## 📁 Structure des fichiers

```
/valofenua
├── /src
│   ├── /components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Stats.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Features.jsx
│   │   ├── CTA.jsx
│   │   ├── EstimationForm.jsx
│   │   ├── EstimationResult.jsx
│   │   └── PriceRangeBar.jsx
│   ├── /pages
│   │   ├── Home.jsx
│   │   └── Estimation.jsx
│   ├── /utils
│   │   ├── formatPrice.js
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── package.json
└── README.md
```

---

## ✅ Checklist fonctionnelle

### Formulaire d'estimation
- [ ] Dropdown Commune (12 options)
- [ ] Dropdown Catégorie (3 options)
- [ ] Dropdown Type de bien (7 options, optionnel)
- [ ] Input Surface (number, requis, min 10)
- [ ] Validation avant soumission
- [ ] État loading pendant l'appel API
- [ ] Gestion des erreurs

### Affichage du résultat
- [ ] Résumé du bien (ex: "Maison F4 de 120 m² à Punaauia")
- [ ] Prix bas, moyen, haut en MF
- [ ] Barre visuelle de fourchette de prix
- [ ] Prix au m² moyen en XPF
- [ ] Bouton "Nouvelle estimation"

### Responsive
- [ ] Mobile : tout pleine largeur, padding adapté
- [ ] Desktop : contenu centré, max-width approprié

---

## 🚀 Ordre de développement

1. **Setup projet** : Vite + React + Tailwind + React Router
2. **Layout** : Header + Footer
3. **Page accueil** : Hero, Stats, HowItWorks, Features, CTA
4. **Page estimation** : Formulaire
5. **Intégration API** : Appel webhook n8n
6. **Affichage résultat** : PriceRangeBar + formatage prix
7. **États UI** : Loading, erreurs
8. **Polish** : Responsive, animations légères

---

## 📝 Textes du site

### Hero
```
Titre : "Estimez la valeur de votre bien immobilier à Tahiti"
Sous-titre : "Obtenez une estimation gratuite en 2 minutes, basée sur les annonces du marché polynésien."
CTA principal : "Estimer mon bien"
CTA secondaire : "Comment ça marche ?"
Badges : "100% gratuit" · "Sans inscription" · "Résultat immédiat"
```

### Stats
```
"1300+" - "annonces analysées"
"12" - "communes couvertes"
"2 min" - "temps moyen"
```

### Comment ça marche
```
Étape 1 : "Décrivez votre bien" - "Renseignez la commune et la catégorie de votre bien."
Étape 2 : "Précisez les critères" - "Ajoutez le type de bien et la surface habitable."
Étape 3 : "Obtenez votre estimation" - "Recevez une fourchette de prix basée sur le marché local."
```

### Avantages (4 cartes)
```
"📊 Données du marché local" - "Basé sur les annonces actives à Tahiti et ses communes."
"🔒 100% confidentiel" - "Aucune inscription requise, aucune donnée personnelle collectée."
"⚡ Résultat instantané" - "Obtenez votre estimation en moins de 2 minutes."
"🆓 Totalement gratuit" - "Sans inscription, sans frais cachés, sans engagement."
```

### CTA final
```
"Prêt à estimer votre bien ?"
"Obtenez une estimation gratuite en moins de 2 minutes"
Bouton : "Estimer maintenant"
```

### Footer
```
"ValoFenua - Estimation immobilière en Polynésie française"
"Données basées sur les annonces de immobilier.pf"
"Estimation indicative ne constituant pas une évaluation officielle."
```

---

## ⚠️ Points d'attention

1. **L'API peut mettre 2-5 secondes** à répondre → afficher un spinner avec "Analyse en cours..."
2. **Les prix sont en XPF** (Francs Pacifiques), pas en euros
3. **Afficher les grands prix en millions (MF)** pour plus de lisibilité
4. **Si l'API échoue**, afficher un message d'erreur clair
5. **Mobile-first** : beaucoup d'utilisateurs sont sur téléphone
6. **Design simple** : la cible n'est pas tech-savvy

---

## 🧪 Tester l'API

```bash
curl -X POST https://n8n.srv1206491.hstgr.cloud/webhook/estimation \
  -H "Content-Type: application/json" \
  -d '{"commune": "Punaauia", "categorie": "Maison", "type_bien": "F4", "surface": 120}'
```
