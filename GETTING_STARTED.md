# 🚀 Bienvenue sur TrustCode !

Merci d'avoir choisi TrustCode ! Ce guide vous aidera à démarrer rapidement.

## 📖 Choix du guide

Choisissez le guide qui correspond à votre situation :

### 🏃 Je veux démarrer rapidement (5 minutes)
➡️ **[QUICKSTART.md](QUICKSTART.md)**
- Configuration minimale
- Lancez l'application en quelques commandes
- Idéal pour tester rapidement

### 📚 Je veux comprendre en détail (15 minutes)
➡️ **[SETUP.md](SETUP.md)**
- Explications détaillées
- Configuration pas à pas avec captures d'écran
- Dépannage inclus

### 💻 Je suis développeur et je veux contribuer
➡️ **[CONTRIBUTING.md](CONTRIBUTING.md)**
- Standards de code
- Architecture du projet
- Guide de contribution

### 🚢 Je veux déployer en production
➡️ **[DEPLOYMENT.md](DEPLOYMENT.md)**
- Guides pour Vercel, Netlify, VPS
- Configuration production
- Sécurité et performance

## 🎯 Prérequis

Avant de commencer, assurez-vous d'avoir :
- [ ] **Node.js 18+** installé ([télécharger](https://nodejs.org))
- [ ] Un compte **GitHub** ([créer](https://github.com/signup))
- [ ] Un compte **Supabase** gratuit ([créer](https://supabase.com))
- [ ] 15 minutes de votre temps ⏱️

## ⚡ Installation en 3 étapes

### 1️⃣ Cloner et installer

```bash
git clone https://github.com/yourusername/trustcode.git
cd trustcode
npm install
```

### 2️⃣ Configurer

Vous aurez besoin de :
- URL et clé Supabase (voir [QUICKSTART.md](QUICKSTART.md))
- Client ID et Secret GitHub OAuth (voir [QUICKSTART.md](QUICKSTART.md))

Créez `.env.local` avec vos clés.

### 3️⃣ Lancer

```bash
npm run check-env  # Vérifier la configuration
npm run dev        # Lancer l'application
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

## 🆘 Besoin d'aide ?

### Problèmes courants

| Problème | Solution |
|----------|----------|
| `Module not found` | `rm -rf node_modules && npm install` |
| `Supabase error` | Vérifiez que le script SQL est exécuté |
| `GitHub OAuth failed` | Vérifiez l'URL de callback |
| `Environment variables` | Utilisez `npm run check-env` |

### Ressources

- 📖 [Documentation complète](README.md)
- 🐛 [Signaler un bug](https://github.com/yourusername/trustcode/issues)
- 💬 [Discussions](https://github.com/yourusername/trustcode/discussions)

## 📁 Navigation dans la documentation

```
📚 Documentation
│
├── 📄 README.md              # Vue d'ensemble et présentation
├── ⚡ QUICKSTART.md         # Démarrage rapide (5 min)
├── 📖 SETUP.md              # Configuration détaillée
├── 🚀 GETTING_STARTED.md   # Ce fichier (point d'entrée)
│
├── 🔧 Configuration
│   ├── API.md              # Documentation API
│   └── supabase-schema.sql # Schéma de base de données
│
├── 🚢 Déploiement
│   └── DEPLOYMENT.md       # Guides de déploiement
│
├── 👨‍💻 Développement
│   ├── CONTRIBUTING.md     # Guide de contribution
│   ├── PROJECT_SUMMARY.md  # Architecture et structure
│   └── CHANGELOG.md        # Historique des versions
│
└── 📜 Scripts
    └── scripts/check-env.js # Vérification de configuration
```

## 🎓 Tutoriel vidéo (à venir)

Un tutoriel vidéo sera bientôt disponible pour vous guider pas à pas !

## 🌟 Prochaines étapes

Une fois l'application lancée :

1. ✅ Cliquez sur "Connect GitHub"
2. ✅ Autorisez l'accès (lecture seule)
3. ✅ Admirez votre grille de contributions !
4. ✅ Personnalisez votre profil
5. ✅ Invitez vos amis à rejoindre le classement

## 💡 Astuces

- **Première fois avec Next.js ?** Consultez la [documentation Next.js](https://nextjs.org/docs)
- **Problème de configuration ?** Le script `npm run check-env` vous aidera
- **Envie de contribuer ?** Lisez [CONTRIBUTING.md](CONTRIBUTING.md)
- **Prêt pour la production ?** Suivez [DEPLOYMENT.md](DEPLOYMENT.md)

## 📞 Support

Besoin d'aide ? Plusieurs options :

1. 📖 Consultez la [documentation](README.md)
2. 🔍 Recherchez dans les [issues existantes](https://github.com/yourusername/trustcode/issues)
3. 💬 Posez une question dans les [discussions](https://github.com/yourusername/trustcode/discussions)
4. 🐛 Signalez un bug via une [nouvelle issue](https://github.com/yourusername/trustcode/issues/new)

---

<div align="center">

**🚀 Bon développement avec TrustCode ! 🚀**

*Made with ❤️ for the developer community*

[⭐ Star sur GitHub](https://github.com/yourusername/trustcode) • [🐛 Signaler un bug](https://github.com/yourusername/trustcode/issues)

</div>


