# Guide de configuration TrustCode

Ce guide vous accompagne pas à pas dans la configuration de l'application.

## Prérequis

- Node.js 18+ installé
- Un compte GitHub
- Un compte Supabase (gratuit)

## Étape 1 : Configuration de Supabase

### 1.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - Name : trustcode (ou votre choix)
   - Database Password : choisissez un mot de passe fort
   - Region : choisissez la région la plus proche
5. Attendez que le projet soit créé (environ 2 minutes)

### 1.2 Créer la table users

1. Dans votre projet Supabase, allez dans "SQL Editor"
2. Cliquez sur "New Query"
3. Copiez-collez le contenu du fichier `supabase-schema.sql`
4. Cliquez sur "Run" pour exécuter le script

### 1.3 Récupérer les clés

1. Allez dans "Project Settings" (icône engrenage en bas à gauche)
2. Cliquez sur "API"
3. Copiez :
   - `Project URL` → ce sera `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → ce sera `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Étape 2 : Configuration de GitHub OAuth

### 2.1 Créer une OAuth App

1. Allez sur [github.com/settings/developers](https://github.com/settings/developers)
2. Cliquez sur "OAuth Apps"
3. Cliquez sur "New OAuth App"
4. Remplissez :
   - Application name : `TrustCode Local` (pour le développement)
   - Homepage URL : `http://localhost:3000`
   - Application description : (optionnel)
   - Authorization callback URL : `http://localhost:3000/api/auth/github/callback`
5. Cliquez sur "Register application"

### 2.2 Récupérer les clés

1. Copiez le "Client ID" → ce sera `GITHUB_CLIENT_ID`
2. Cliquez sur "Generate a new client secret"
3. Copiez le secret → ce sera `GITHUB_CLIENT_SECRET`
   ⚠️ Vous ne pourrez voir ce secret qu'une seule fois !

## Étape 3 : Configuration du projet

### 3.1 Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase (copiez vos valeurs depuis Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# GitHub OAuth (copiez vos valeurs depuis GitHub)
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=générez_avec_openssl_rand_base64_32
```

### 3.2 Générer NEXTAUTH_SECRET

Dans votre terminal :

```bash
openssl rand -base64 32
```

Copiez le résultat dans votre `.env.local`

## Étape 4 : Lancer l'application

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Étape 5 : Tester

1. Cliquez sur "Connect GitHub" en haut à droite
2. Autorisez l'application
3. Vous devriez être redirigé vers la page d'accueil avec vos contributions affichées

## Déploiement en production

### Configuration pour la production

1. Créez une nouvelle OAuth App GitHub pour la production avec :
   - Homepage URL : `https://votre-domaine.com`
   - Authorization callback URL : `https://votre-domaine.com/api/auth/github/callback`

2. Mettez à jour vos variables d'environnement sur votre plateforme de déploiement :
   - Vercel : Project Settings > Environment Variables
   - Netlify : Site settings > Build & deploy > Environment
   - Autres : selon votre hébergeur

3. Changez `NEXTAUTH_URL` pour votre domaine de production

### Déploiement sur Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

Puis ajoutez vos variables d'environnement dans le dashboard Vercel.

## Dépannage

### Erreur "GitHub OAuth failed"

- Vérifiez que `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` sont corrects
- Vérifiez que l'URL de callback correspond exactement

### Erreur "Supabase connection failed"

- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
- Vérifiez que la table `users` existe dans Supabase

### Les contributions ne s'affichent pas

- Vérifiez que le token GitHub a bien les permissions de lecture
- Vérifiez la console du navigateur pour les erreurs

## Support

Si vous rencontrez des problèmes, ouvrez une issue sur GitHub.

