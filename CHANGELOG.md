# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [0.1.0] - 2025-11-02

### Ajouté
- 🎉 Version initiale de TrustCode
- 🔐 Authentification GitHub OAuth (read-only)
- 📊 Affichage de la grille de contributions style GitHub
- 🏆 Classement des utilisateurs par nombre de contributions
- 👤 Profils personnalisables (display name et website)
- 💾 Intégration Supabase pour le stockage des données
- 🎨 Interface moderne avec Tailwind CSS
- 🌙 Support du dark mode
- 📱 Design responsive
- 📈 Statistiques globales (total users, total contributions, moyenne, top contributor)
- ✏️ Édition de profil en modal
- 🎯 Marquage visuel de l'utilisateur connecté
- 🔄 Mise à jour automatique des contributions lors de la reconnexion

### Structure du projet
- Application Next.js 15 avec App Router
- TypeScript pour la sécurité des types
- Supabase pour la base de données PostgreSQL
- GitHub GraphQL API pour récupérer les contributions
- date-fns pour la manipulation des dates

### Documentation
- README.md - Documentation générale
- SETUP.md - Guide de configuration détaillé
- QUICKSTART.md - Guide de démarrage rapide (5 minutes)
- API.md - Documentation de l'API
- CHANGELOG.md - Journal des modifications

### Composants
- `ContributionGrid` - Grille de contributions style GitHub
- `UserList` - Liste des utilisateurs
- `UserCard` - Carte individuelle d'utilisateur
- `GitHubConnectButton` - Bouton de connexion GitHub
- `ProfileModal` - Modal d'édition de profil
- `Statistics` - Statistiques globales

### API Endpoints
- `GET /api/auth/github` - Initie OAuth
- `GET /api/auth/github/callback` - Callback OAuth
- `GET /api/users` - Liste des utilisateurs
- `PATCH /api/users/[githubId]` - Mise à jour du profil
- `GET /api/me` - Utilisateur connecté

### Base de données
- Table `users` avec RLS (Row Level Security)
- Policies pour lecture publique et mise à jour authentifiée
- Index sur `github_username` et `total_contributions`

## [Prochaines versions]

### Prévu pour v0.2.0
- [ ] Système de badges (First Commit, Week Warrior, etc.)
- [ ] Graphiques de tendance des contributions
- [ ] Filtres par période (mois, semaine, année)
- [ ] Recherche d'utilisateurs
- [ ] Partage social des statistiques

### Idées futures
- [ ] Intégration GitLab
- [ ] Système de challenges/défis
- [ ] API publique
- [ ] Webhooks pour mises à jour automatiques
- [ ] Équipes/organisations
- [ ] Comparaison entre utilisateurs
- [ ] Export des données (CSV, JSON)
- [ ] Notifications (nouveaux records, etc.)


