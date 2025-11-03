# TrustCode - Résumé du Projet

## 📋 Vue d'ensemble

**TrustCode** est une application web de classement (leaderboard) des contributions GitHub. Elle permet aux développeurs de connecter leur compte GitHub en lecture seule pour afficher leurs contributions de l'année écoulée sous forme de grille interactive, et de se comparer avec d'autres développeurs.

## 🎯 Fonctionnalités principales

### Authentification
- ✅ Connexion GitHub OAuth (accès en lecture seule)
- ✅ Session persistante avec cookies HTTP-only
- ✅ Déconnexion possible

### Affichage des données
- ✅ Grille de contributions style GitHub (heatmap)
- ✅ Calcul automatique du total de contributions
- ✅ Classement automatique par nombre de contributions (décroissant)
- ✅ Avatar GitHub affiché pour chaque utilisateur
- ✅ Lien vers le profil GitHub

### Profils personnalisables
- ✅ Édition du nom d'affichage (username personnalisé)
- ✅ Ajout d'un lien vers site web personnel
- ✅ Modal d'édition accessible depuis son propre profil
- ✅ Indicateur visuel "You" sur son propre profil

### Statistiques
- ✅ Total d'utilisateurs inscrits
- ✅ Total de contributions cumulées
- ✅ Moyenne de contributions par utilisateur
- ✅ Top contributeur mis en avant

### Interface utilisateur
- ✅ Design moderne avec Tailwind CSS
- ✅ Support du dark mode (automatique selon les préférences système)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states et états vides
- ✅ Messages de succès/erreur
- ✅ Animations fluides

## 🏗️ Architecture technique

### Stack technologique

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL)
- GitHub REST & GraphQL API

**Déploiement:**
- Recommandé: Vercel
- Alternatives: Netlify, VPS

### Structure des fichiers

```
trustcode/
├── app/                      # Application Next.js (App Router)
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentification GitHub
│   │   ├── users/           # Gestion des utilisateurs
│   │   └── me/              # Utilisateur connecté
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Page d'accueil
│   └── globals.css          # Styles globaux
├── components/               # Composants React
│   ├── ContributionGrid.tsx # Grille de contributions
│   ├── UserList.tsx         # Liste des utilisateurs
│   ├── UserCard.tsx         # Carte utilisateur
│   ├── GitHubConnectButton.tsx
│   ├── ProfileModal.tsx     # Modal d'édition
│   └── Statistics.tsx       # Statistiques globales
├── lib/                     # Utilitaires
│   ├── supabase.ts          # Client Supabase (browser)
│   ├── supabase-server.ts   # Client Supabase (server)
│   └── github.ts            # API GitHub
├── types/                   # Types TypeScript
│   └── user.ts              # Type User
├── scripts/                 # Scripts utilitaires
│   └── check-env.js         # Vérification config
├── public/                  # Assets statiques
└── docs/                    # Documentation
    ├── README.md
    ├── SETUP.md
    ├── QUICKSTART.md
    ├── API.md
    ├── DEPLOYMENT.md
    ├── CONTRIBUTING.md
    └── CHANGELOG.md
```

## 🗄️ Base de données

### Table `users`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | ID unique (PK) |
| `github_username` | VARCHAR(255) | Username GitHub (unique) |
| `github_id` | VARCHAR(255) | ID GitHub (unique) |
| `display_username` | VARCHAR(255) | Nom d'affichage personnalisé |
| `website_url` | TEXT | URL du site web |
| `avatar_url` | TEXT | URL de l'avatar GitHub |
| `total_contributions` | INTEGER | Total de contributions |
| `contributions_data` | JSONB | Données détaillées (date => count) |
| `last_updated` | TIMESTAMP | Dernière mise à jour |
| `created_at` | TIMESTAMP | Date de création |

**Index:**
- `github_username` (pour les recherches rapides)
- `total_contributions DESC` (pour le classement)

**Row Level Security (RLS):**
- Lecture publique activée
- Modification réservée au propriétaire du profil

## 🔌 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/github` | GET | Initie OAuth GitHub |
| `/api/auth/github/callback` | GET | Callback OAuth |
| `/api/users` | GET | Liste tous les utilisateurs |
| `/api/users/[githubId]` | PATCH | Met à jour un profil |
| `/api/me` | GET | Récupère l'utilisateur connecté |

## 🔧 Configuration requise

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=          # URL du projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Clé anonyme Supabase
GITHUB_CLIENT_ID=                  # Client ID OAuth GitHub
GITHUB_CLIENT_SECRET=              # Client Secret OAuth GitHub
NEXTAUTH_URL=                      # URL de l'application
NEXTAUTH_SECRET=                   # Secret pour NextAuth (32 chars)
```

### Services externes

1. **Supabase** (gratuit)
   - Base de données PostgreSQL
   - Authentification
   - API REST auto-générée

2. **GitHub OAuth App**
   - Permissions: `read:user` (lecture seule)
   - Callback URL: `{NEXTAUTH_URL}/api/auth/github/callback`

## 📚 Documentation disponible

| Fichier | Description |
|---------|-------------|
| `README.md` | Documentation générale |
| `QUICKSTART.md` | Démarrage rapide (5 min) |
| `SETUP.md` | Guide de configuration détaillé |
| `API.md` | Documentation de l'API |
| `DEPLOYMENT.md` | Guide de déploiement |
| `CONTRIBUTING.md` | Guide de contribution |
| `CHANGELOG.md` | Journal des modifications |
| `PROJECT_SUMMARY.md` | Ce fichier |

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
# Créer .env.local avec vos clés

# 3. Vérifier la configuration
npm run check-env

# 4. Lancer en développement
npm run dev
```

## 📊 Flux de données

```
1. Utilisateur clique "Connect GitHub"
   ↓
2. Redirection vers GitHub OAuth
   ↓
3. Utilisateur autorise l'accès (read-only)
   ↓
4. GitHub renvoie le code d'autorisation
   ↓
5. Application échange le code contre un token
   ↓
6. Récupération des données utilisateur (REST API)
   ↓
7. Récupération des contributions (GraphQL API)
   ↓
8. Sauvegarde dans Supabase
   ↓
9. Cookie de session créé
   ↓
10. Redirection vers la page d'accueil
```

## 🎨 Design System

### Couleurs
- **Primary**: Blue (liens, boutons)
- **Success**: Green (contributions)
- **Warning**: Amber (alertes)
- **Danger**: Red (erreurs)
- **Neutral**: Gray (textes, backgrounds)

### Typographie
- **Font**: Inter (via next/font/google)
- **Tailles**: text-xs à text-3xl

### Composants réutilisables
- Cards avec shadow-md
- Buttons avec hover states
- Inputs avec focus rings
- Modals avec backdrop blur

## 🔒 Sécurité

### Mesures implémentées
- ✅ OAuth GitHub (pas de stockage de mots de passe)
- ✅ Cookies HTTP-only (protection XSS)
- ✅ Row Level Security sur Supabase
- ✅ Variables d'environnement sécurisées
- ✅ Validation des données côté serveur

### Bonnes pratiques
- Accès GitHub en lecture seule uniquement
- Pas de token GitHub stocké côté client
- HTTPS en production (obligatoire)

## 📈 Performance

### Optimisations
- Server Components par défaut
- Images optimisées avec next/image
- Code splitting automatique
- CSS optimisé avec Tailwind
- Caching des contributions (1 connexion = 1 mise à jour)

## 🧪 Tests

**État actuel**: Pas de tests configurés

**Recommandations futures**:
- Jest/Vitest pour tests unitaires
- React Testing Library pour tests de composants
- Playwright/Cypress pour tests E2E

## 🌐 Internationalisation

**État actuel**: Français uniquement

**Pour ajouter l'anglais**:
- Utiliser next-intl ou react-i18next
- Créer des fichiers de traduction
- Ajouter un sélecteur de langue

## 🔮 Évolutions futures possibles

### Court terme (v0.2.0)
- [ ] Système de badges
- [ ] Graphiques de tendance
- [ ] Recherche d'utilisateurs
- [ ] Filtres par période

### Moyen terme
- [ ] Intégration GitLab
- [ ] Système de challenges
- [ ] Webhooks pour mises à jour auto
- [ ] Équipes/organisations

### Long terme
- [ ] API publique
- [ ] Application mobile
- [ ] Gamification avancée
- [ ] Analytics détaillées

## 📝 Licence

MIT - Voir LICENSE file

## 👥 Contribution

Contributions bienvenues ! Voir CONTRIBUTING.md

## 🐛 Support

- Issues: GitHub Issues
- Documentation: /docs
- Email: support@trustcode.dev (à configurer)

---

**Version actuelle**: 0.1.0  
**Dernière mise à jour**: 2 novembre 2025  
**Auteur**: TrustCode Team

