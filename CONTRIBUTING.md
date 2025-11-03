# Guide de contribution

Merci de votre intérêt pour contribuer à TrustCode ! 🎉

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/yourusername/trustcode/issues)
2. Ouvrez une nouvelle issue avec:
   - Un titre clair et descriptif
   - Une description détaillée du problème
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement actuel
   - Des captures d'écran si pertinent
   - Votre environnement (OS, navigateur, version Node.js)

### Proposer une fonctionnalité

1. Ouvrez une issue avec le label "enhancement"
2. Décrivez la fonctionnalité et pourquoi elle serait utile
3. Si possible, proposez une implémentation

### Soumettre une Pull Request

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

#### Critères pour une bonne PR

- Code propre et bien formaté
- Tests si applicable
- Documentation mise à jour
- Commits atomiques avec des messages clairs
- Pas d'erreurs ESLint

## Standards de code

### TypeScript

- Utilisez TypeScript pour tout nouveau code
- Définissez des types pour toutes les props et états
- Évitez `any`, préférez `unknown` si nécessaire

### Style

Le projet utilise:
- **ESLint** pour le linting
- **Prettier** (peut être ajouté) pour le formatage
- **Tailwind CSS** pour les styles

### Conventions de nommage

- **Components**: PascalCase (`UserCard.tsx`)
- **Fichiers utilitaires**: camelCase (`github.ts`)
- **API routes**: kebab-case pour les URLs
- **Variables/fonctions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### Structure des composants

```typescript
'use client' // Si nécessaire

import { /* imports */ } from 'react'
import { /* types */ } from '@/types'
import { /* components */ } from '@/components'

// Types/Interfaces
interface ComponentProps {
  // props
}

// Composant
export default function Component({ props }: ComponentProps) {
  // hooks
  // handlers
  // render
  return (
    // JSX
  )
}
```

### Commits

Utilisez des messages de commit clairs et descriptifs:

- `feat: add user search functionality`
- `fix: resolve issue with contribution grid`
- `docs: update API documentation`
- `style: format code with prettier`
- `refactor: simplify user card component`
- `test: add tests for GitHub API`
- `chore: update dependencies`

## Développement local

### Setup

```bash
# Clone votre fork
git clone https://github.com/yourusername/trustcode.git
cd trustcode

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.template .env.local
# Remplir les variables dans .env.local

# Lancer en dev
npm run dev
```

### Structure du projet

```
trustcode/
├── app/              # Pages et routes API (App Router)
├── components/       # Composants React
├── lib/             # Utilitaires et helpers
├── types/           # Définitions TypeScript
├── public/          # Assets statiques
└── ...
```

## Tests

Actuellement, le projet n'a pas de suite de tests configurée. Contributions bienvenues pour:
- Configurer Jest/Vitest
- Ajouter des tests unitaires
- Ajouter des tests d'intégration
- Ajouter des tests E2E

## Documentation

Lors de l'ajout de fonctionnalités:
1. Mettez à jour le README si nécessaire
2. Documentez les nouvelles API dans API.md
3. Ajoutez une entrée dans CHANGELOG.md
4. Commentez le code complexe

## Questions

Des questions ? N'hésitez pas à:
- Ouvrir une issue de discussion
- Contacter les mainteneurs
- Consulter la documentation existante

## Code de conduite

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Focalisez sur ce qui est mieux pour le projet
- Aidez les nouveaux contributeurs

Merci de contribuer à TrustCode ! 🚀

