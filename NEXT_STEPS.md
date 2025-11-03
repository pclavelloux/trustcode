# 🎯 Prochaines étapes - Vous avez déjà exécuté le SQL

Comme vous avez déjà exécuté le SQL dans Supabase, voici ce qu'il vous reste à faire :

## 1. ⚠️ Mettre à jour votre base de données

Le schéma a changé (de `users` vers `profiles` avec Supabase Auth). Vous avez 2 options :

### Option A : Migration simple (recommandé)

Exécutez ce SQL dans Supabase > SQL Editor :

```sql
-- Supprimer l'ancienne table
DROP TABLE IF EXISTS public.users CASCADE;

-- Créer la nouvelle structure
-- Puis copiez-collez le contenu complet de supabase-schema.sql
```

### Option B : Garder les données existantes (avancé)

```sql
-- Renommer la table
ALTER TABLE public.users RENAME TO profiles;

-- Ajouter la contrainte de clé étrangère vers auth.users
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Le reste du supabase-schema.sql (trigger, fonction, etc.)
```

## 2. 🔐 Configurer GitHub OAuth dans Supabase

### Étape par étape :

1. **Ouvrez votre dashboard Supabase**
   - Allez dans **Authentication** > **Providers**

2. **Activez GitHub**
   - Trouvez "GitHub" dans la liste
   - Cliquez dessus
   - **Activez** le provider
   - **Copiez** le "Callback URL" (ex: `https://xxxxx.supabase.co/auth/v1/callback`)

3. **Configurez votre GitHub OAuth App**
   - Allez sur [github.com/settings/developers](https://github.com/settings/developers)
   - Si vous avez déjà une OAuth App:
     - Éditez-la
     - **Changez le Callback URL** pour celui de Supabase (étape précédente)
   - Si vous n'en avez pas:
     - Cliquez sur "New OAuth App"
     - Name: TrustCode
     - Homepage: `http://localhost:3000`
     - Callback URL: Collez celui de Supabase
   - **Copiez le Client ID**
   - **Générez/copiez le Client Secret**

4. **Retour dans Supabase**
   - Collez le Client ID dans le champ correspondant
   - Collez le Client Secret
   - Cliquez sur **Save**

## 3. 📝 Mettre à jour .env.local

Simplifiez votre fichier `.env.local` :

**Avant :**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GITHUB_CLIENT_ID=...           ← À supprimer
GITHUB_CLIENT_SECRET=...       ← À supprimer
NEXTAUTH_URL=...               ← À supprimer
NEXTAUTH_SECRET=...            ← À supprimer
```

**Après :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**C'est tout !** 🎉

## 4. 🧹 Nettoyer et relancer

```bash
# Nettoyer les modules (optionnel mais recommandé)
rm -rf node_modules package-lock.json
npm install

# Vérifier la configuration
npm run check-env

# Lancer l'application
npm run dev
```

## 5. ✅ Tester

1. Ouvrez [http://localhost:3000](http://localhost:3000)
2. Si vous étiez connecté avant, **supprimez les cookies** de votre navigateur pour localhost:3000
3. Cliquez sur **"Connect GitHub"**
4. Autorisez l'accès
5. Vous devriez être redirigé et voir votre profil !
6. Testez **"Edit profile"** et **"Sign Out"**

## 🐛 Problèmes courants

### "Invalid redirect URI" ou "Redirect URI mismatch"

**Cause :** Le Callback URL dans GitHub ne correspond pas à celui de Supabase

**Solution :**
1. Vérifiez le Callback URL dans Supabase (Authentication > Providers > GitHub)
2. Vérifiez qu'il est **exactement le même** dans votre GitHub OAuth App
3. Le format doit être : `https://xxxxx.supabase.co/auth/v1/callback`

### "Supabase error: relation 'users' does not exist"

**Cause :** L'ancienne table `users` n'a pas été renommée en `profiles`

**Solution :** Exécutez l'Option A (migration simple) ci-dessus

### "No rows returned" ou profil vide

**Cause :** Le trigger de création automatique n'est pas actif

**Solution :**
1. Vérifiez que le trigger existe dans Supabase (Database > Functions)
2. Réexécutez la partie trigger du `supabase-schema.sql`
3. Reconnectez-vous

### GitHub OAuth non activé

**Cause :** Vous avez oublié d'activer GitHub dans Supabase

**Solution :**
1. Supabase > Authentication > Providers
2. GitHub > Enable

## 📚 En savoir plus

- [QUICKSTART.md](QUICKSTART.md) - Guide complet de configuration
- [MIGRATION_SUPABASE_AUTH.md](MIGRATION_SUPABASE_AUTH.md) - Détails de la migration
- [README.md](README.md) - Documentation générale

## 💡 Pourquoi Supabase Auth ?

✅ **Plus simple** - 2 variables au lieu de 6  
✅ **Plus sécurisé** - Tokens gérés par Supabase  
✅ **Plus maintenable** - Moins de code custom  
✅ **Mieux intégré** - RLS avec auth.uid()  

---

**🚀 Bon développement !**

Une fois que tout fonctionne, vous pouvez supprimer ce fichier.

