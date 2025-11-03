# Guide de démarrage rapide - 5 minutes

## 1. Configuration de Supabase (3 minutes)

### Créer un projet
1. Allez sur [supabase.com](https://supabase.com) et créez un compte
2. Cliquez sur "New Project"
3. Donnez-lui un nom (ex: trustcode)
4. Créez le projet (attendez ~2 minutes)

### Configurer GitHub OAuth dans Supabase
1. Dans votre projet Supabase, allez dans **Authentication** > **Providers**
2. Trouvez **GitHub** dans la liste et cliquez dessus
3. **Activez** GitHub OAuth
4. Notez le **Callback URL** fourni par Supabase (ex: `https://xxxxx.supabase.co/auth/v1/callback`)
5. Laissez cette page ouverte, vous en aurez besoin

### Créer une GitHub OAuth App
1. Ouvrez [github.com/settings/developers](https://github.com/settings/developers) dans un nouvel onglet
2. Cliquez sur **OAuth Apps** puis **New OAuth App**
3. Remplissez:
   - **Name**: TrustCode Local
   - **Homepage**: `http://localhost:3000`
   - **Authorization callback URL**: Collez le **Callback URL** de Supabase (étape précédente)
4. Cliquez sur **Register application**
5. Copiez le **Client ID**
6. Cliquez sur **Generate a new client secret** et copiez le **Client Secret**

### Finaliser la configuration GitHub dans Supabase
1. Retournez sur la page Supabase (Authentication > Providers > GitHub)
2. Collez le **GitHub Client ID**
3. Collez le **GitHub Client Secret**
4. Cliquez sur **Save**

### Créer la base de données
1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez-collez le contenu du fichier `supabase-schema.sql`
4. Cliquez sur **Run**

### Récupérer les clés Supabase
1. Allez dans **Settings** > **API**
2. Copiez:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Configuration du projet (1 minute)

Créez le fichier `.env.local` à la racine du projet:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**C'est tout !** Plus besoin de GitHub Client ID/Secret côté Next.js, Supabase gère tout 🎉

## 3. Lancer l'application

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

## 4. Tester

1. Cliquez sur **"Connect GitHub"**
2. Autorisez l'accès (vous serez redirigé vers GitHub)
3. Revenez sur l'app → Admirez votre grille de contributions! 🎉
4. Votre profil apparaît dans le classement
5. Cliquez sur **"Edit profile"** pour personnaliser

---

## 🔧 Problèmes courants

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Supabase error"
- ✅ Vérifiez que vous avez exécuté le script SQL dans Supabase
- ✅ Vérifiez que les variables d'environnement sont correctes
- ✅ Vérifiez que le projet Supabase est bien actif

### "GitHub OAuth failed" ou "Invalid redirect URI"
- ✅ Vérifiez que GitHub OAuth est **activé** dans Supabase (Authentication > Providers)
- ✅ Vérifiez que le **Callback URL** dans GitHub OAuth App correspond **exactement** à celui de Supabase
- ✅ Le callback URL doit être: `https://xxxxx.supabase.co/auth/v1/callback` (PAS localhost!)

### Les contributions ne s'affichent pas
- ✅ Reconnectez-vous (Sign Out puis Connect GitHub)
- ✅ Vérifiez que votre profil GitHub est public
- ✅ Attendez quelques secondes après la première connexion

---

## Prochaines étapes

- Lisez `README.md` pour plus de détails
- Consultez `SETUP.md` pour le guide complet
- Consultez `API.md` pour la documentation de l'API

## 🚀 Déploiement rapide sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Suivez les instructions puis ajoutez vos variables d'environnement dans le dashboard
```

**Important pour la production:**
- Les variables d'environnement sont les mêmes (Supabase gère tout!)
- Le Callback URL de Supabase fonctionne pour tous les domaines
- Pas besoin de créer une nouvelle OAuth App GitHub 🎉

## ✨ Avantages de Supabase Auth

- 🔐 **Sécurité renforcée** - Tokens gérés par Supabase
- 🔄 **Refresh automatique** - Sessions maintenues automatiquement  
- 🎯 **Configuration centralisée** - Tout dans le dashboard Supabase
- 🚀 **Moins de code** - Plus simple à maintenir
- 🔗 **RLS intégré** - Sécurité au niveau base de données

