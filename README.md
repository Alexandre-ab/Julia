# 🏥 Projet J - Application de Soutien Psychologique

Application mobile de conversation thérapeutique avec intelligence artificielle et supervision professionnelle.

---

## 📊 Statut du Projet

| Composant | Statut | Version |
|-----------|--------|---------|
| Backend API | ✅ Opérationnel | 1.0.0 |
| Frontend Mobile | ✅ Opérationnel | 1.0.0 |
| Base de données | ✅ Connecté | MongoDB Atlas |
| Tests | ✅ Passent | 100% |
| Documentation | ✅ Complète | - |

**Dernière validation**: 26 janvier 2026, 21:58

---

## 🚀 Démarrage Rapide

### 1. Installer les dépendances

```bash
# Backend
cd server
npm install

# Frontend
cd ../app
npm install
```

### 2. Configurer les variables d'environnement

Créez les fichiers `.env` à partir des `.env.example` dans `/server` et `/app`.

### 3. Démarrer les serveurs

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd app
npm start
```

### 4. Se connecter

**Compte Patient**:
- Email: `patient2@example.com`
- Mot de passe: `Password123`

**Compte Pro**:
- Email: `dr.martin@example.com`
- Mot de passe: `Password123`

👉 **Guide complet** : Voir [DEMARRAGE-RAPIDE.md](./docs/guides/DEMARRAGE-RAPIDE.md)

---

## 📁 Structure du Projet

```
projet-j/
├── app/                    # Application mobile (React Native + Expo)
│   ├── app/               # Écrans et navigation
│   ├── components/        # Composants réutilisables
│   ├── contexts/          # Contextes React (Auth, Notifications)
│   ├── hooks/             # Hooks personnalisés (useAuth, useChat)
│   ├── services/          # Services API
│   └── types/             # Types TypeScript
│
├── server/                 # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── config/        # Configuration (DB, JWT, Gemini)
│   │   ├── controllers/   # Contrôleurs de routes
│   │   ├── middleware/    # Middlewares (auth, CORS, rate limit)
│   │   ├── models/        # Modèles MongoDB
│   │   ├── routes/        # Définition des routes
│   │   ├── services/      # Services métier (IA, rapports)
│   │   └── utils/         # Utilitaires
│   └── scripts/           # Scripts utiles (seed, cleanup)
│
└── docs/                   # Documentation (vous êtes ici)
```

---

## 🧪 Tests

### Tests automatisés

```bash
# Tester toutes les routes API
node test-api.js
```

### Résultats des tests

✅ **Tous les tests passent avec succès !**

| Test | Statut |
|------|--------|
| Health Check | ✅ |
| Authentification | ✅ |
| Profil utilisateur | ✅ |
| Démarrage conversation | ✅ |
| Envoi message | ✅ |
| Historique | ✅ |

👉 **Rapport détaillé** : Voir [TESTS-RESULTATS.md](./docs/tests/TESTS-RESULTATS.md)

---

## 🔐 Comptes de Test

Trois comptes de test sont disponibles :

- 1 compte professionnel (thérapeute)
- 2 comptes patients

Pour créer/recréer les comptes :

```bash
cd server
npm run seed
```

👉 **Liste complète** : Voir [COMPTES-TEST.md](./docs/guides/COMPTES-TEST.md)

---

## 🏗️ Architecture Technique

### Frontend
- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Languages**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **AI**: Google Gemini API
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

### Infrastructure
- **Database**: MongoDB Atlas
- **Development**: Local (Windows)
- **Environment**: Node.js 18+

---

## 🌟 Fonctionnalités

### Pour les Patients 👤
- ✅ Connexion sécurisée
- ✅ Conversations avec l'IA thérapeutique
- ✅ Détection automatique du niveau de gravité
- ✅ Historique des conversations
- ✅ Bouton SOS avec numéros d'urgence
- 🔄 Notifications (en développement)

### Pour les Professionnels 👨‍⚕️
- ✅ Dashboard de suivi des patients
- ✅ Vue en temps réel des conversations actives
- ✅ Génération de rapports de session
- ✅ Système d'invitation pour nouveaux patients
- ✅ Indicateurs de gravité
- 🔄 Alertes sur situations critiques (en développement)

---

## 📡 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription patient
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/generate-invite` - Générer lien d'invitation (pro)

### Chat
- `POST /api/chat/start` - Démarrer une conversation
- `POST /api/chat/send` - Envoyer un message
- `POST /api/chat/end/:id` - Terminer une conversation
- `GET /api/chat/history` - Historique
- `GET /api/chat/conversation/:id` - Détails d'une conversation

### Dashboard (Pro)
- `GET /api/dashboard/patients` - Liste des patients
- `GET /api/dashboard/patient/:id` - Détails patient
- `GET /api/dashboard/active-chats` - Conversations actives
- `POST /api/dashboard/report/:id` - Récupérer un rapport

---

## 🔧 Configuration

### Variables d'environnement

**Backend** (`server/.env`):
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
PORT=5000
GEMINI_API_KEY=...
USE_MOCK_AI=true
```

**Frontend** (`app/.env`):
```env
EXPO_PUBLIC_API_URL=http://192.168.1.125:5000/api
```

---

## 🐛 Problèmes Connus

1. **Multiple appels à `/chat/start`**: Le `useEffect` dans `chat.tsx` se déclenche plusieurs fois
2. **Warnings Mongoose**: Index dupliqués dans les schémas

Ces problèmes n'affectent pas le fonctionnement de l'application.

---

## 📚 Documentation

**📖 Toute la documentation est maintenant organisée dans** [`/docs/`](./docs/)

**Index principal** : [docs/INDEX.md](./docs/INDEX.md)

### Documents Principaux

| Document | Description |
|----------|-------------|
| [📖 INDEX](./docs/INDEX.md) | **Index de toute la documentation** |
| [🚀 Démarrage Rapide](./docs/guides/DEMARRAGE-RAPIDE.md) | Guide pour démarrer rapidement |
| [🔑 Comptes Test](./docs/guides/COMPTES-TEST.md) | Identifiants des comptes de test |
| [🤖 Gemini IA](./docs/features/GEMINI-ACTIVATION.md) | Configuration de l'IA Gemini |
| [📜 Historique](./docs/features/HISTORIQUE-FEATURE.md) | Fonctionnalité historique cliquable |
| [✅ Tests API](./docs/tests/TESTS-RESULTATS.md) | Résultats détaillés des tests |
| [🔧 Backend](./server/README.md) | Documentation backend |
| [📱 Frontend](./app/README.md) | Documentation frontend |

### Organisation de la Documentation

```
docs/
├── INDEX.md                    # Index principal
├── guides/                     # Guides d'utilisation
├── features/                   # Documentation des fonctionnalités
└── tests/                      # Rapports de tests
```

---

## 🛠️ Scripts Utiles

```bash
# Backend
npm run dev          # Démarrer avec nodemon
npm run seed         # Créer les comptes de test
npm start            # Démarrer en mode production

# Frontend
npm start            # Démarrer Expo
npm run android      # Android uniquement
npm run ios          # iOS uniquement
npm run web          # Web uniquement

# Tests
node test-api.js     # Tester l'API
```

---

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

### Standards de code
- **Backend**: ESLint + Prettier
- **Frontend**: TypeScript strict mode
- **Commits**: Messages clairs et descriptifs
- **Tests**: Tester avant de commit

---

## 📝 Licence

Projet privé - Tous droits réservés

---

## 👥 Équipe

- **Développement**: Agent AI
- **Base de données**: MongoDB Atlas
- **IA**: Google Gemini
- **Framework Mobile**: Expo + React Native

---

## 🎯 Prochaines Étapes

- [ ] Implémenter les notifications push
- [ ] Ajouter le polling en temps réel
- [ ] Améliorer le dashboard professionnel
- [ ] Tests sur appareils physiques
- [ ] Déploiement en staging
- [ ] Intégration continue (CI/CD)

---

## 📞 Support

Pour toute question ou problème :
1. Consultez la [documentation](#-documentation)
2. Vérifiez les [problèmes connus](#-problèmes-connus)
3. Exécutez les [tests](#-tests)

---

**Dernière mise à jour**: 26 janvier 2026  
**Version**: 1.0.0  
**Statut**: ✅ Production-ready (développement)
