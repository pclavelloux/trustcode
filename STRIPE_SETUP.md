# Configuration Stripe - Système de Sponsoring

Ce guide explique comment configurer le système de sponsoring avec Stripe pour TrustCode.

## Vue d'ensemble

Le système de sponsoring permet aux entreprises de promouvoir leurs produits sur TrustCode via un abonnement mensuel à 99€. Voici le flux :

1. Un visiteur clique sur "Promote your product here"
2. Il entre son email et est redirigé vers Stripe Checkout
3. Après paiement, il est redirigé vers un formulaire pour entrer les détails de son entreprise
4. Le sponsor apparaît dans les panneaux latéraux du site
5. L'abonnement se renouvelle automatiquement chaque mois

## Prérequis

- Compte Stripe (https://stripe.com)
- Accès au Dashboard Stripe
- Base de données Supabase configurée

## Étape 1 : Créer la table sponsors dans Supabase

Exécutez le script SQL `supabase-schema.sql` qui contient déjà la définition de la table `sponsors`.

```bash
# Connectez-vous à votre console Supabase et exécutez le script
```

## Étape 2 : Récupérer vos clés Stripe

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Allez dans **Developers** > **API keys**
3. Notez vos clés :
   - **Publishable key** (commence par `pk_`)
   - **Secret key** (commence par `sk_`)
   - ⚠️ Pour le test, utilisez les clés de test. Pour la production, utilisez les clés live.

## Étape 3 : Configurer les webhooks Stripe

Les webhooks permettent à Stripe de notifier votre application des événements (paiements, renouvellements, annulations).

### 3.1 Créer un endpoint webhook

1. Dans le Dashboard Stripe, allez dans **Developers** > **Webhooks**
2. Cliquez sur **Add endpoint**
3. Entrez l'URL de votre webhook :
   - **Développement local** : `https://votre-tunnel-ngrok.ngrok.io/api/sponsors/webhook`
   - **Production** : `https://votre-domaine.com/api/sponsors/webhook`

### 3.2 Sélectionner les événements

Cochez les événements suivants :
- `checkout.session.completed` - Quand un paiement est complété
- `invoice.paid` - Quand une facture est payée (renouvellements)
- `customer.subscription.deleted` - Quand un abonnement est annulé
- `customer.subscription.updated` - Quand un abonnement est modifié

### 3.3 Récupérer le secret du webhook

1. Après création, Stripe vous montre le **Signing secret** (commence par `whsec_`)
2. Notez cette clé pour la configuration

### 3.4 Tester en local avec Stripe CLI (Optionnel)

Pour tester les webhooks en local sans ngrok :

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/api/sponsors/webhook

# Cela vous donnera un webhook secret temporaire
```

## Étape 4 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Variables Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# Variables existantes
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
NEXT_PUBLIC_URL=http://localhost:3000
```

⚠️ **Important** : 
- Ne commitez JAMAIS ces clés dans Git
- En production, utilisez les clés Stripe live (pas les test)
- Configurez ces variables dans votre plateforme de déploiement (Vercel, etc.)

## Étape 5 : Tester le système

### Test du checkout

1. Démarrez votre serveur : `npm run dev`
2. Allez sur la page d'accueil
3. Cliquez sur "Promote your product here"
4. Entrez un email de test
5. Utilisez une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

### Test du webhook

1. Après le paiement, vérifiez dans les logs Stripe que les webhooks sont bien reçus
2. Vérifiez dans Supabase que l'entrée sponsor est créée avec `status = 'pending'`

### Test du formulaire sponsor

1. Après le paiement, vous devriez être redirigé vers `/sponsor/setup`
2. Remplissez les informations :
   - Nom de l'entreprise
   - URL du site
   - Description (optionnel)
3. Soumettez le formulaire
4. Le sponsor devrait apparaître dans les panneaux latéraux

## Étape 6 : Vérification

Vérifiez que tout fonctionne :

- [ ] Le bouton "Promote your product here" ouvre Stripe Checkout
- [ ] Après paiement, redirection vers le formulaire de setup
- [ ] Les informations sont enregistrées dans la table `sponsors`
- [ ] Le sponsor s'affiche dans les panneaux latéraux
- [ ] Les webhooks sont reçus et traités correctement
- [ ] Le statut passe de `pending` à `active` après soumission du formulaire

## Gestion des sponsors

### États possibles

- **pending** : Paiement effectué, en attente des informations
- **active** : Sponsor actif et affiché sur le site
- **cancelled** : Abonnement annulé par l'utilisateur
- **expired** : Abonnement expiré (date dépassée)

### Renouvellements automatiques

Stripe gère automatiquement les renouvellements mensuels. À chaque paiement réussi :
1. Le webhook `invoice.paid` est déclenché
2. La date d'expiration est prolongée d'un mois
3. Le statut reste `active`

### Annulations

Quand un utilisateur annule son abonnement :
1. Le webhook `customer.subscription.deleted` est déclenché
2. Le statut passe à `cancelled`
3. Le sponsor n'apparaît plus sur le site

## Gestion des prix

Pour modifier le prix de l'abonnement, éditez le fichier :
`app/api/sponsors/create-checkout/route.ts`

```typescript
unit_amount: 9900, // Montant en centimes (99€)
```

## Sécurité

### Vérification des signatures webhook

Le système vérifie automatiquement les signatures des webhooks pour s'assurer qu'ils proviennent bien de Stripe :

```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
)
```

### Permissions Supabase

La table `sponsors` utilise Row Level Security (RLS) :
- Lecture : Tous les utilisateurs peuvent voir les sponsors actifs
- Écriture : Seul le service role peut créer/modifier

## Surveillance

### Dashboard Stripe

Surveillez dans Stripe :
- Les paiements dans **Payments**
- Les abonnements dans **Subscriptions**
- Les webhooks dans **Developers** > **Webhooks**

### Base de données

Vérifiez régulièrement dans Supabase :
- Les sponsors actifs
- Les dates d'expiration
- Les éventuelles erreurs

## Dépannage

### Le webhook ne fonctionne pas

1. Vérifiez que l'URL du webhook est correcte
2. Vérifiez que le `STRIPE_WEBHOOK_SECRET` est correct
3. Consultez les logs dans Stripe Dashboard > Webhooks
4. Vérifiez les logs de votre application

### Le sponsor n'apparaît pas

1. Vérifiez le statut dans la base de données
2. Vérifiez la date d'expiration (`expires_at`)
3. Vérifiez que le sponsor a bien rempli le formulaire
4. Rechargez la page pour actualiser les données

### Erreur de paiement

1. Vérifiez que les clés Stripe sont correctes
2. Vérifiez que vous n'êtes pas en mode test avec des clés production (ou vice versa)
3. Consultez les logs Stripe pour plus de détails

## Support

Pour toute question sur Stripe :
- Documentation : https://stripe.com/docs
- Support : https://support.stripe.com

Pour les problèmes liés au code :
- Consultez les logs de l'application
- Vérifiez les erreurs dans la console du navigateur

