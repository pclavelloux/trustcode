# 🚀 Démarrage Rapide - Système de Sponsoring

Guide express pour mettre en place le système de sponsoring en 10 minutes.

## ✅ Ce qui a été fait

Le système de sponsoring complet a été implémenté avec :
- ✅ Base de données (table `sponsors`)
- ✅ Intégration Stripe (checkout + webhooks)
- ✅ API routes pour gérer les sponsors
- ✅ Interface utilisateur (bouton + formulaire)
- ✅ Affichage dynamique des sponsors actifs
- ✅ Gestion automatique des renouvellements

## 📋 Prochaines étapes

### Étape 1 : Mettre à jour la base de données (2 min)

1. Connectez-vous à votre [console Supabase](https://app.supabase.com)
2. Sélectionnez votre projet TrustCode
3. Allez dans **SQL Editor**
4. Exécutez le fichier `migrations/001_add_sponsors_table.sql`
5. Vérifiez que la table `sponsors` est créée

### Étape 2 : Configurer Stripe (5 min)

#### 2.1 Créer un compte Stripe (si pas déjà fait)
- Allez sur https://stripe.com
- Créez un compte (gratuit)

#### 2.2 Récupérer les clés API
1. Dashboard Stripe > **Developers** > **API keys**
2. Notez ces clés (utilisez les clés de TEST pour commencer) :
   - **Secret key** : `sk_test_...`
   - **Publishable key** : `pk_test_...`

#### 2.3 Configurer le webhook
1. Dashboard Stripe > **Developers** > **Webhooks** > **Add endpoint**
2. Pour tester en local, vous aurez besoin de :
   - **Stripe CLI** (recommandé) : `stripe listen --forward-to localhost:3000/api/sponsors/webhook`
   - **OU ngrok** : `ngrok http 3000` puis utiliser l'URL ngrok

3. Pour la production, entrez votre URL : `https://votre-domaine.com/api/sponsors/webhook`

4. Sélectionnez ces événements :
   - ✅ `checkout.session.completed`
   - ✅ `invoice.paid`
   - ✅ `customer.subscription.deleted`
   - ✅ `customer.subscription.updated`

5. Notez le **Signing secret** : `whsec_...`

### Étape 3 : Configurer les variables d'environnement (1 min)

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Ajoutez ces lignes Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle
STRIPE_WEBHOOK_SECRET=whsec_votre_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# Vérifiez que ces variables existent déjà
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_URL=http://localhost:3000
```

⚠️ **Important** : Ne commitez jamais ce fichier dans Git !

### Étape 4 : Installer et démarrer (1 min)

```bash
# Les packages sont déjà installés, mais au cas où :
npm install

# Démarrer le serveur
npm run dev
```

### Étape 5 : Tester (2 min)

1. Allez sur http://localhost:3000
2. Cliquez sur **"Promote your product here"** dans un panneau latéral
3. Entrez un email de test
4. Vous serez redirigé vers Stripe Checkout
5. Utilisez cette carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future (ex: 12/25)
   - CVC : N'importe quel 3 chiffres (ex: 123)
6. Complétez le paiement
7. Vous serez redirigé vers le formulaire
8. Remplissez :
   - **Nom** : Test Company
   - **URL** : https://example.com
   - **Description** : Test description
9. Soumettez
10. Retournez sur la page d'accueil
11. ✅ Votre sponsor devrait apparaître dans les panneaux !

## 🎉 C'est terminé !

Le système fonctionne maintenant. Voici ce qui se passe automatiquement :

- ✅ Les utilisateurs peuvent cliquer et payer pour devenir sponsor
- ✅ Après paiement, ils remplissent un formulaire
- ✅ Leur sponsor apparaît immédiatement sur le site
- ✅ Chaque mois, Stripe renouvelle automatiquement l'abonnement
- ✅ Si annulation, le sponsor disparaît automatiquement

## 📚 Documentation complète

Pour plus de détails, consultez :
- **`SPONSOR_SYSTEM.md`** : Documentation technique complète
- **`STRIPE_SETUP.md`** : Guide détaillé de configuration Stripe

## 🚀 Passer en production

Quand vous êtes prêt :

1. **Stripe** : Passez aux clés live (`sk_live_`, `pk_live_`)
2. **Webhook** : Configurez avec votre vraie URL de production
3. **Variables d'env** : Mettez à jour dans votre plateforme de déploiement (Vercel, etc.)
4. **Base de données** : Exécutez la migration sur votre BDD de production

## ⚠️ Checklist avant production

- [ ] Clés Stripe LIVE configurées
- [ ] Webhook production configuré et testé
- [ ] Variables d'environnement en production
- [ ] Migration BDD exécutée en production
- [ ] Test complet du flux en production
- [ ] Monitoring Stripe activé

## 💰 Gestion des revenus

### Prix actuel
- **99€/mois** par sponsor

### Pour modifier le prix
Éditez `app/api/sponsors/create-checkout/route.ts` :
```typescript
unit_amount: 9900, // en centimes (99€)
```

### Combien de sponsors en même temps ?
Actuellement : **1 sponsor actif à la fois** (premier arrivé)

Pour avoir plusieurs sponsors simultanés :
- Ajoutez un champ `slot_position` dans la table
- Modifiez la requête GET pour récupérer N sponsors
- Adaptez le SponsorPanel pour afficher plusieurs sponsors

## 🐛 Problèmes courants

### Le webhook ne fonctionne pas en local
**Solution** : Utilisez Stripe CLI
```bash
stripe listen --forward-to localhost:3000/api/sponsors/webhook
```

### Le sponsor n'apparaît pas
**Vérifications** :
1. Le status est-il "active" ? (regardez dans Supabase)
2. La date expires_at est-elle dans le futur ?
3. Actualisez la page (Cmd+R / Ctrl+R)

### Erreur "No signature provided"
**Cause** : Le STRIPE_WEBHOOK_SECRET est incorrect ou manquant
**Solution** : Vérifiez `.env.local`

## 📞 Besoin d'aide ?

1. Consultez les logs dans la console du navigateur (F12)
2. Vérifiez les webhooks dans Stripe Dashboard
3. Consultez la base de données dans Supabase
4. Lisez `STRIPE_SETUP.md` pour plus de détails

---

**Bon développement ! 🎉**

