# Système de Sponsoring - Documentation Technique

## 📋 Vue d'ensemble

Le système de sponsoring permet aux entreprises de promouvoir leurs produits sur TrustCode via un abonnement mensuel Stripe à **99€/mois**.

## ✅ Fonctionnalités implémentées

### 1. Base de données
- ✅ Table `sponsors` créée dans `supabase-schema.sql`
- ✅ Champs : email, stripe_customer_id, stripe_subscription_id, website_url, company_name, description, status, payment_date, expires_at
- ✅ Row Level Security (RLS) configuré
- ✅ Index pour optimiser les requêtes

### 2. API Routes

#### `/api/sponsors/create-checkout` (POST)
Crée une session Stripe Checkout pour l'abonnement mensuel
- **Input** : `{ email: string }`
- **Output** : `{ sessionId: string, url: string }`
- **Redirections** :
  - Succès : `/sponsor/setup?session_id={CHECKOUT_SESSION_ID}`
  - Annulation : `/?canceled=true`

#### `/api/sponsors/webhook` (POST)
Gère les événements Stripe (webhooks)
- **Événements gérés** :
  - `checkout.session.completed` : Crée/met à jour le sponsor avec status "pending"
  - `invoice.paid` : Prolonge l'abonnement d'un mois
  - `customer.subscription.deleted` : Marque le sponsor comme "cancelled"
  - `customer.subscription.updated` : Met à jour les informations d'abonnement

#### `/api/sponsors` (GET/POST)
- **GET** : Récupère le sponsor actif (status = 'active' et non expiré)
- **POST** : Met à jour les informations du sponsor après paiement
  - **Input** : `{ sessionId, websiteUrl, companyName, description }`
  - **Output** : `{ success: true, sponsor: Sponsor }`

### 3. Interface utilisateur

#### Composant `SponsorPanel`
- ✅ Charge automatiquement le sponsor actif via l'API
- ✅ Affiche le sponsor avec nom, description et lien cliquable
- ✅ Affiche "Promote your product here" si aucun sponsor actif
- ✅ Gère le clic pour démarrer le processus de paiement
- ✅ Demande l'email et redirige vers Stripe Checkout

#### Page `/sponsor/setup`
- ✅ Formulaire pour entrer les informations après paiement :
  - Nom de l'entreprise (requis)
  - URL du site web (requis)
  - Description (optionnel, max 200 caractères)
- ✅ Validation des champs
- ✅ Gestion des erreurs
- ✅ Redirection vers la page d'accueil après soumission

#### Page d'accueil
- ✅ Deux panneaux SponsorPanel (gauche et droite)
- ✅ Affichage dynamique des sponsors actifs
- ✅ Support des props supprimées (plus besoin de données statiques)

### 4. Gestion des abonnements

#### Statuts des sponsors
- **pending** : Paiement effectué, en attente des informations du sponsor
- **active** : Sponsor actif, affiché sur le site
- **cancelled** : Abonnement annulé par l'utilisateur
- **expired** : Abonnement expiré (dépassé la date expires_at)

#### Renouvellements automatiques
- ✅ Géré via webhook `invoice.paid`
- ✅ Prolonge automatiquement `expires_at` d'un mois
- ✅ Maintient le statut "active"

#### Annulations
- ✅ Géré via webhook `customer.subscription.deleted`
- ✅ Change le statut en "cancelled"
- ✅ Le sponsor disparaît du site

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers
```
app/api/sponsors/
  ├── create-checkout/route.ts  (Création session Stripe)
  ├── webhook/route.ts           (Gestion webhooks Stripe)
  └── route.ts                   (CRUD sponsors)

app/sponsor/
  └── setup/page.tsx             (Formulaire après paiement)

types/sponsor.ts                 (Types TypeScript)
STRIPE_SETUP.md                  (Guide de configuration)
SPONSOR_SYSTEM.md                (Ce fichier)
```

### Fichiers modifiés
```
supabase-schema.sql              (Ajout table sponsors)
components/SponsorPanel.tsx      (Rendu dynamique)
app/page.tsx                     (Suppression props statiques)
package.json                     (Ajout stripe, @stripe/stripe-js)
```

## 🔧 Configuration requise

### Variables d'environnement

Ajoutez ces variables dans `.env.local` :

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase (déjà existantes)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### Étapes de configuration

1. **Créer la table dans Supabase**
   ```bash
   # Exécuter supabase-schema.sql dans la console SQL Supabase
   ```

2. **Configurer Stripe**
   - Créer un compte Stripe
   - Récupérer les clés API
   - Configurer le webhook (voir STRIPE_SETUP.md)

3. **Installer les dépendances**
   ```bash
   npm install
   ```

4. **Tester localement**
   ```bash
   npm run dev
   ```

## 🔄 Flux utilisateur complet

```
1. Visiteur clique sur "Promote your product here"
   ↓
2. Entre son email
   ↓
3. Redirigé vers Stripe Checkout (99€/mois)
   ↓
4. Effectue le paiement
   ↓
5. Webhook "checkout.session.completed" → Crée sponsor avec status "pending"
   ↓
6. Redirigé vers /sponsor/setup?session_id=xxx
   ↓
7. Remplit le formulaire (nom, URL, description)
   ↓
8. Soumission → API met à jour sponsor avec status "active"
   ↓
9. Redirigé vers page d'accueil
   ↓
10. Le sponsor apparaît dans les panneaux latéraux

--- Chaque mois ---

11. Stripe charge automatiquement l'abonnement
    ↓
12. Webhook "invoice.paid" → Prolonge expires_at d'un mois
    ↓
13. Le sponsor reste actif

--- Si annulation ---

14. Utilisateur annule via Stripe
    ↓
15. Webhook "customer.subscription.deleted" → Status = "cancelled"
    ↓
16. Le sponsor disparaît du site
```

## 🛡️ Sécurité

### Vérifications implémentées
- ✅ Vérification des signatures webhook Stripe
- ✅ Row Level Security (RLS) sur la table sponsors
- ✅ Validation des emails côté frontend
- ✅ Validation des URLs (type="url" dans le formulaire)
- ✅ Limitation de la longueur des champs (company_name: 255, description: 200)
- ✅ Utilisation de SUPABASE_SERVICE_ROLE_KEY pour les opérations sensibles

### Bonnes pratiques
- ✅ Secrets Stripe stockés en variables d'environnement
- ✅ Pas de clés hardcodées dans le code
- ✅ Gestion des erreurs dans toutes les API routes
- ✅ Logs des erreurs pour le débogage

## 📊 Monitoring

### À surveiller

1. **Dashboard Stripe**
   - Paiements réussis/échoués
   - Abonnements actifs
   - Webhooks délivrés

2. **Base de données Supabase**
   - Nombre de sponsors actifs : `SELECT COUNT(*) FROM sponsors WHERE status = 'active'`
   - Sponsors en attente : `SELECT * FROM sponsors WHERE status = 'pending'`
   - Sponsors expirés : `SELECT * FROM sponsors WHERE expires_at < NOW()`

3. **Logs application**
   - Erreurs API routes
   - Erreurs webhooks
   - Échecs de création de checkout

## 🐛 Points d'attention

### Ce qui pourrait être amélioré
- [ ] Ajouter un dashboard admin pour gérer les sponsors
- [ ] Envoyer des emails de confirmation/rappel
- [ ] Permettre plusieurs sponsors en même temps (gestion de slots)
- [ ] Ajouter des images/logos pour les sponsors
- [ ] Permettre au sponsor de modifier ses infos après activation
- [ ] Ajouter des analytics (clics sur les liens sponsors)
- [ ] Job cron pour marquer les sponsors expirés

### Limitations actuelles
- Un seul sponsor peut être actif à la fois (premier arrivé)
- Pas de preview avant paiement
- Pas de remboursement automatique
- Pas d'email de notification

## 🧪 Tests

### Cartes de test Stripe
- Succès : `4242 4242 4242 4242`
- Échec : `4000 0000 0000 0002`
- 3D Secure : `4000 0027 6000 3184`

### Scénarios à tester
- ✅ Checkout réussi
- ✅ Checkout annulé
- ✅ Formulaire setup
- ✅ Affichage du sponsor actif
- ✅ Renouvellement (via Stripe CLI)
- ✅ Annulation d'abonnement
- ✅ Expiration de sponsor

## 📝 Notes importantes

1. **Environnement de test vs Production**
   - Utilisez les clés `sk_test_` et `pk_test_` en développement
   - Passez aux clés `sk_live_` et `pk_live_` en production

2. **Webhooks**
   - En local, utilisez Stripe CLI ou ngrok
   - En production, configurez l'URL dans Stripe Dashboard

3. **Base de données**
   - Exécutez le schema SQL APRÈS avoir configuré l'authentification Supabase
   - Les policies RLS permettent à tout le monde de voir les sponsors actifs

4. **Prix**
   - Actuellement fixé à 99€/mois
   - Modifiable dans `create-checkout/route.ts` (ligne `unit_amount: 9900`)

## 📞 Support

Pour toute question technique :
1. Consultez `STRIPE_SETUP.md` pour la configuration
2. Vérifiez les logs Stripe Dashboard
3. Consultez les logs de l'application
4. Vérifiez la base de données Supabase

---

**Version** : 1.0.0  
**Date** : Novembre 2025  
**Stack** : Next.js 16, Stripe API, Supabase, TypeScript, TailwindCSS

