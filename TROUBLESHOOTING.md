# 🔧 Guide de dépannage

## Problème: "invalid request: both auth code and code verifier should be non-empty"

### Cause
Cette erreur se produit lorsque le PKCE (Proof Key for Code Exchange) n'est pas correctement géré entre le client et le serveur.

### Solution ✅

Le problème a été corrigé dans le code. Si vous rencontrez toujours cette erreur :

1. **Videz le cache de votre navigateur**
   ```
   Chrome: Cmd+Shift+Delete (Mac) ou Ctrl+Shift+Delete (Windows)
   ```
   - Cochez "Cookies et autres données de site"
   - Cochez "Images et fichiers en cache"
   - Cliquez sur "Effacer les données"

2. **Supprimez les cookies localStorage pour localhost:3000**
   - Ouvrez les DevTools (F12)
   - Application > Local Storage > localhost:3000
   - Clic droit > Clear

3. **Relancez l'application**
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

4. **Testez en navigation privée**
   - Ouvrez une fenêtre privée/incognito
   - Allez sur http://localhost:3000
   - Testez la connexion GitHub

### Vérifications

✅ **Vérifiez que le callback est correct dans Supabase**
- Supabase > Authentication > Configuration > Site URL
- Doit être: `http://localhost:3000` (en dev)

✅ **Vérifiez le Redirect URL dans GitHub OAuth App**
- GitHub > Settings > Developer settings > OAuth Apps
- Authorization callback URL doit être: `https://xxxxx.supabase.co/auth/v1/callback`
- ⚠️ PAS `http://localhost:3000/...` !

✅ **Vérifiez que GitHub OAuth est activé dans Supabase**
- Supabase > Authentication > Providers > GitHub
- Doit être "Enabled"

---

## Autres problèmes courants

### "Failed to fetch" lors de la connexion

**Cause:** Le serveur n'est pas lancé ou problème de réseau

**Solution:**
```bash
npm run dev
```

### "Profile not found" après connexion

**Cause:** Le trigger SQL n'a pas créé le profil automatiquement

**Solution:**
1. Vérifiez que le trigger existe:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. Si absent, réexécutez la partie trigger de `supabase-schema.sql`

3. Reconnectez-vous (Sign Out puis Connect GitHub)

### "Unauthorized" lors de l'édition du profil

**Cause:** La session a expiré

**Solution:**
- Sign Out puis reconnectez-vous
- Supabase Auth gère le refresh automatiquement normalement

### Les contributions n'apparaissent pas

**Cause:** Plusieurs raisons possibles

**Solutions:**
1. Vérifiez que votre profil GitHub est public
2. Vérifiez que vous avez bien des contributions dans l'année écoulée
3. Reconnectez-vous pour forcer le refresh
4. Vérifiez les logs du serveur:
   ```bash
   # Dans le terminal où tourne npm run dev
   # Regardez s'il y a des erreurs lors de la connexion
   ```

### "Table 'users' does not exist"

**Cause:** Vous avez l'ancien schéma SQL

**Solution:**
```sql
-- Dans Supabase SQL Editor
DROP TABLE IF EXISTS public.users CASCADE;
-- Puis exécutez tout supabase-schema.sql
```

### CORS errors

**Cause:** Configuration Supabase incorrecte

**Solution:**
1. Supabase > Authentication > URL Configuration
2. Additional Redirect URLs: `http://localhost:3000/**`
3. Site URL: `http://localhost:3000`

### Middleware loop / Too many redirects

**Cause:** Le middleware redirige en boucle

**Solution:**
1. Vérifiez que `middleware.ts` a les bonnes exclusions
2. Le config devrait exclure `_next`, `api`, `favicon`, etc.

---

## 🔍 Debug mode

Pour activer les logs détaillés:

### 1. Ajoutez des logs dans le callback

Éditez `app/api/auth/callback/route.ts`:

```typescript
console.log('🔍 Callback called with code:', code)
console.log('🔍 Session:', session)
console.log('🔍 User:', session?.user)
```

### 2. Vérifiez les logs Supabase

1. Supabase > Logs > Auth Logs
2. Filtrez par "Sign In" ou "Sign Up"
3. Regardez les erreurs

### 3. Vérifiez les cookies

Dans DevTools > Application > Cookies > localhost:3000
- Devrait avoir des cookies `sb-*`
- Si absents après connexion = problème de session

---

## 📞 Besoin d'aide supplémentaire?

1. **Vérifiez les logs du serveur** (terminal où tourne `npm run dev`)
2. **Vérifiez la console du navigateur** (F12 > Console)
3. **Vérifiez les logs Supabase** (Dashboard > Logs)

### Informations à fournir si vous ouvrez une issue:

```
- Version Node.js: `node --version`
- Erreur exacte (screenshot)
- Logs du serveur
- Logs de la console navigateur
- OS: Mac/Windows/Linux
- Navigateur: Chrome/Firefox/Safari/etc.
```

---

## ✅ Checklist de fonctionnement

Tout devrait fonctionner si:

- [ ] `npm run dev` tourne sans erreur
- [ ] GitHub OAuth activé dans Supabase
- [ ] Callback URL correct dans GitHub OAuth App
- [ ] Table `profiles` existe dans Supabase
- [ ] Trigger `on_auth_user_created` existe
- [ ] Variables d'environnement correctes dans `.env.local`
- [ ] Pas d'erreurs dans les logs du serveur
- [ ] Pas d'erreurs dans la console du navigateur

Si tout est coché et ça ne fonctionne toujours pas, essayez de tout recommencer depuis zéro avec QUICKSTART.md 🔄


