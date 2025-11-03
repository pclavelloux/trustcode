# 🔑 Guide : GitHub Personal Access Token

## Pourquoi un token personnel ?

Le **GitHub Personal Access Token (PAT)** permet d'accéder à vos **contributions privées**. Sans token :
- Seules les contributions publiques sont visibles
- Le total peut être bien inférieur à la réalité
- Exemple : 2,569 contributions réelles → 0 affiché

Avec un token :
- ✅ Contributions publiques + privées
- ✅ Le vrai total incluant tous vos commits
- ✅ Mise à jour automatique possible (CRON à venir)

## 📝 Comment créer votre token ?

### Étape 1 : Accéder à GitHub Settings

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Ou : **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**

### Étape 2 : Créer le token

1. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**

2. **Note** : `TrustCode Contributions`
   - Ce nom vous aidera à identifier ce token plus tard

3. **Expiration** : Choisissez selon votre préférence
   - `No expiration` : Le token ne expire jamais (recommandé si vous voulez des mises à jour automatiques)
   - `1 year` : Plus sécurisé, mais il faudra le renouveler chaque année

4. **Scopes requis** : Cochez ces permissions
   - ✅ `read:user` - Lire les informations du profil
   - ✅ `repo` - Accès aux repositories (nécessaire pour les contributions privées)
     - Cela inclut automatiquement `repo:status`, `repo_deployment`, `public_repo`, etc.

5. Cliquez sur **"Generate token"**

### Étape 3 : Copier le token

⚠️ **IMPORTANT** : Vous ne verrez ce token qu'**une seule fois** !

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Le token commence par `ghp_`
- Copiez-le immédiatement
- Si vous le perdez, il faudra en créer un nouveau

## 🔒 Sécurité

### Est-ce sécurisé ?

✅ **Oui**, votre token est :
- Stocké de manière sécurisée dans Supabase
- Protégé par Row Level Security (RLS)
- Seul vous pouvez y accéder
- Utilisé uniquement pour récupérer vos contributions

### Bonnes pratiques

1. **Ne partagez JAMAIS votre token**
   - Ne le commitez pas dans git
   - Ne le partagez pas sur Slack/Discord/etc.
   - Ne le collez pas dans des screenshots

2. **Limitez les permissions**
   - Utilisez uniquement les scopes nécessaires
   - Pour TrustCode : `read:user` + `repo`

3. **Surveillez l'utilisation**
   - GitHub vous envoie un email si le token est utilisé
   - Vérifiez régulièrement dans Settings > Developer settings

4. **Révoquez si compromis**
   - Si vous pensez que votre token a fuité
   - Allez sur GitHub Settings > Developer settings > Tokens
   - Cliquez sur "Delete" à côté du token

## 💻 Comment l'utiliser dans TrustCode ?

### Première utilisation

1. Connectez-vous à TrustCode avec GitHub OAuth (bouton "Connect GitHub")
2. Sur votre profil, cliquez sur **"🔑 Update contributions (GitHub Token)"**
3. Collez votre token dans le champ
4. Cliquez sur **"🚀 Mettre à jour mes contributions"**
5. ✨ Vos vraies contributions s'affichent !

### Mise à jour ultérieure

- Cliquez à nouveau sur **"🔑 Update contributions"** pour forcer un refresh
- (À venir) Les contributions seront mises à jour automatiquement chaque jour via CRON

## 🔄 Mise à jour automatique (CRON - À venir)

Une fois votre token ajouté, vos contributions seront automatiquement mises à jour :
- 🕐 Tous les jours à minuit UTC
- 🔄 Sans action de votre part
- 📊 Toujours à jour avec vos derniers commits

## ❓ FAQ

### Q: Pourquoi pas OAuth pour les contributions privées ?

**R:** GitHub OAuth, même avec tous les scopes, ne permet pas d'accéder à la granularité nécessaire pour les contributions privées via l'API GraphQL. Le PAT est la seule solution fiable.

### Q: Que se passe-t-il si mon token expire ?

**R:** 
- Vos contributions resteront affichées (anciennes données)
- Vous recevrez une notification (à venir)
- Vous devrez créer un nouveau token et le mettre à jour

### Q: Puis-je utiliser un Fine-grained token ?

**R:** Pas pour le moment. Les Fine-grained tokens ne supportent pas encore l'API GraphQL pour les contributions. Utilisez un token **Classic**.

### Q: Puis-je supprimer mon token ?

**R:** Oui, à tout moment :
1. Dans TrustCode : (feature à venir)
2. Sur GitHub : Settings > Developer settings > Tokens > Delete

Si vous supprimez le token dans TrustCode, vos contributions resteront affichées mais ne seront plus mises à jour automatiquement.

### Q: Le token donne-t-il accès à mes repositories privés ?

**R:** Oui, techniquement. Mais TrustCode utilise **uniquement** l'API GraphQL pour récupérer les statistiques de contributions. Le code est open-source, vous pouvez vérifier.

### Q: Pourquoi demander `repo` et pas juste `read:org` ?

**R:** Le scope `read:org` ne donne accès qu'aux contributions dans les organisations. Pour avoir **toutes** vos contributions (personnelles + orgs, publiques + privées), il faut `repo`.

## 🛠️ Dépannage

### "Invalid token"

- Vérifiez que vous avez copié le token complet
- Vérifiez qu'il commence par `ghp_`
- Vérifiez que le token n'a pas expiré
- Vérifiez que les scopes `read:user` et `repo` sont bien cochés

### "API rate limit exceeded"

- GitHub limite à 5,000 requêtes/heure avec un token
- Attendez quelques minutes et réessayez
- Avec le CRON, cela n'arrivera plus (1 requête/jour)

### "Token does not match"

- Le token que vous avez entré ne correspond pas à votre compte GitHub
- Vérifiez que vous êtes connecté au bon compte GitHub

## 📚 Références

- [GitHub Personal Access Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)

---

**🔒 Votre token est en sécurité avec TrustCode**

Questions ? Ouvrez une issue sur GitHub !

