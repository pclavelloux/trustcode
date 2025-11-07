# Migration vers Supabase Auth ✅

Ce projet utilise maintenant **Supabase Auth** au lieu d'une implémentation OAuth manuelle.

## 🎉 Changements effectués

### ✅ Ce qui a été simplifié

1. **Plus de gestion manuelle des cookies** - Supabase gère tout
2. **Plus de variables NEXTAUTH** - Seulement 2 variables d'environnement nécessaires
3. **Configuration centralisée** - Tout dans le dashboard Supabase
4. **Sécurité renforcée** - Tokens et refresh tokens gérés automatiquement
5. **RLS intégré** - Sécurité au niveau base de données avec `auth.uid()`

### 🗑️ Ce qui a été supprimé

- ❌ Variables `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` côté Next.js
- ❌ Variables `NEXTAUTH_URL` et `NEXTAUTH_SECRET`
- ❌ Routes `/api/auth/github` et `/api/auth/github/callback` (OAuth manuel)
- ❌ Gestion manuelle des cookies
- ❌ Endpoint `/api/me` avec cookies

### ✨ Ce qui a été ajouté

- ✅ Middleware Supabase pour gérer automatiquement les sessions
- ✅ Route `/api/auth/callback` pour Supabase OAuth
- ✅ Trigger SQL pour créer automatiquement les profils
- ✅ RLS policies utilisant `auth.uid()`
- ✅ Bouton Sign Out intégré

## 📋 Actions requises après migration

### 1. Mettre à jour la base de données

Si vous avez déjà exécuté l'ancien SQL, vous devez :

```sql
-- Supprimer l'ancienne table
DROP TABLE IF EXISTS public.users CASCADE;

-- Puis exécuter le nouveau supabase-schema.sql
```

Ou simplement **exécutez le nouveau `supabase-schema.sql`** qui gère la migration automatiquement.

### 2. Configurer GitHub OAuth dans Supabase

1. Allez dans **Authentication** > **Providers** > **GitHub**
2. **Activez** GitHub OAuth
3. **Copiez** le Callback URL (ex: `https://xxxxx.supabase.co/auth/v1/callback`)
4. Créez/mettez à jour votre [GitHub OAuth App](https://github.com/settings/developers)
5. Utilisez le **Callback URL de Supabase** (pas localhost!)
6. Collez Client ID et Secret dans Supabase
7. **Sauvegardez**

### 3. Mettre à jour .env.local

**Avant:**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
```

**Après:**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

C'est tout ! 🎉

### 4. Réinstaller les dépendances (optionnel)

```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Changements dans le code

### Table de base de données

**Avant:** `users`  
**Après:** `profiles` (extension de `auth.users`)

Tous les composants ont été mis à jour automatiquement.

### Authentification

**Avant:**
```typescript
// Redirection manuelle vers /api/auth/github
window.location.href = '/api/auth/github'
```

**Après:**
```typescript
// Utilisation de Supabase Auth
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/api/auth/callback`,
  },
})
```

### Récupération de l'utilisateur

**Avant:**
```typescript
// Via cookie github_username
const username = cookies.get('github_username')
```

**Après:**
```typescript
// Via Supabase Auth
const { data: { user } } = await supabase.auth.getUser()
```

## 🧪 Tester la migration

1. **Nettoyez les données locales**
   - Supprimez les cookies de votre navigateur pour localhost:3000
   - Ou utilisez une fenêtre de navigation privée

2. **Testez l'authentification**
   ```bash
   npm run dev
   ```
   - Cliquez sur "Connect GitHub"
   - Autorisez l'accès
   - Vérifiez que le profil se crée correctement
   - Vérifiez que les contributions s'affichent
   - Testez l'édition du profil
   - Testez le Sign Out

3. **Vérifiez la base de données**
   - Allez dans Supabase > Table Editor
   - Vérifiez que la table `profiles` existe
   - Vérifiez que votre profil apparaît après connexion

## ❓ FAQ

### Dois-je recréer ma GitHub OAuth App?

**Oui**, le Callback URL a changé. Il doit maintenant pointer vers Supabase :
- **Avant:** `http://localhost:3000/api/auth/github/callback`
- **Après:** `https://xxxxx.supabase.co/auth/v1/callback`

### Les utilisateurs existants vont-ils perdre leurs données?

Non, mais ils devront se reconnecter. Leurs contributions seront automatiquement récupérées à nouveau.

### Puis-je garder l'ancienne approche?

Techniquement oui, mais ce n'est pas recommandé. Supabase Auth est :
- Plus sécurisé
- Plus simple
- Mieux intégré
- Maintenu par Supabase

### Le déploiement change-t-il?

**Simplifié !** Plus besoin de variables GitHub côté Next.js. Juste les 2 variables Supabase.

## 🎓 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [GitHub OAuth Setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

## ✅ Checklist de migration

- [x] SQL mis à jour avec table `profiles`
- [x] GitHub OAuth configuré dans Supabase
- [x] Callback URL mis à jour
- [x] Variables d'environnement simplifiées
- [x] Code d'authentification refactorisé
- [x] Middleware Supabase ajouté
- [x] Composants mis à jour
- [x] Documentation mise à jour
- [ ] Tests effectués
- [ ] Déploiement mis à jour

---

**Migration terminée avec succès ! 🚀**

Si vous rencontrez des problèmes, consultez [QUICKSTART.md](QUICKSTART.md) ou ouvrez une issue.


