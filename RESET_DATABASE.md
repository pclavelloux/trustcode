# 🔄 Comment réinitialiser la base de données Supabase

Plusieurs méthodes pour tout supprimer et repartir de zéro :

## Méthode 1 : Via le Dashboard Supabase (Recommandé) ⭐

### Étape 1 : Supprimer les données

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **TrustCode**
3. Allez dans **Table Editor** (menu de gauche)
4. Cliquez sur la table **`profiles`**
5. Sélectionnez tous les enregistrements (checkbox en haut à gauche)
6. Cliquez sur **Delete** (ou appuyez sur Delete)
7. Confirmez la suppression

### Étape 2 : Supprimer les utilisateurs authentifiés

1. Allez dans **Authentication** > **Users**
2. Sélectionnez tous les utilisateurs
3. Cliquez sur **Delete users**
4. Confirmez

### Étape 3 : Recréer la structure

1. Allez dans **SQL Editor**
2. Copiez-collez le contenu de `supabase-schema.sql`
3. Cliquez sur **Run**
4. ✅ C'est fait !

---

## Méthode 2 : Via SQL (Plus rapide)

### Étape 1 : Exécuter le script de réinitialisation

1. Allez dans **Supabase Dashboard** > **SQL Editor**
2. Copiez-collez le contenu de `supabase-reset.sql`
3. Cliquez sur **Run**
4. ✅ Toutes les données sont supprimées

### Étape 2 : Recréer la structure

1. Toujours dans **SQL Editor**
2. Copiez-collez le contenu de `supabase-schema.sql`
3. Cliquez sur **Run**
4. ✅ Base de données réinitialisée !

---

## Méthode 3 : Supprimer et recréer le projet (Plus radical)

Si vous voulez vraiment tout repartir de zéro :

1. Dans Supabase Dashboard > **Settings** > **General**
2. Scroll jusqu'en bas
3. Cliquez sur **Delete Project**
4. Confirmez
5. Créez un nouveau projet
6. Réexécutez `supabase-schema.sql`

⚠️ **Attention** : Vous devrez aussi :
- Recréer la configuration GitHub OAuth dans Supabase
- Mettre à jour vos variables d'environnement si l'URL a changé

---

## ✅ Vérification après réinitialisation

1. **Vérifiez que la table profiles existe** :
   ```sql
   SELECT * FROM public.profiles;
   ```
   Doit retourner 0 lignes.

2. **Vérifiez que les triggers existent** :
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
   Doit retourner 1 ligne.

3. **Vérifiez que les policies RLS existent** :
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```
   Doit retourner 3 policies.

---

## 🚀 Après la réinitialisation

1. Allez sur votre app : `http://localhost:3000`
2. Cliquez sur **"Connect GitHub"**
3. Autorisez l'accès
4. Votre nouveau profil sera créé automatiquement !

---

## 💡 Conseils

- **Sauvegardez avant** : Si vous avez des données importantes, exportez-les d'abord
- **Test local** : C'est l'occasion parfaite pour tester le flow complet
- **Vérifiez OAuth** : Assurez-vous que GitHub OAuth est toujours configuré dans Supabase

---

## 🐛 Problèmes courants

### "Table does not exist"
→ Réexécutez `supabase-schema.sql`

### "Trigger already exists"
→ C'est normal si vous avez exécuté le script plusieurs fois, ignorez l'erreur

### "GitHub OAuth not working"
→ Vérifiez que GitHub OAuth est toujours activé dans Supabase > Authentication > Providers

---

**Bon test ! 🎉**

