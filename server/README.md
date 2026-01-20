# Projet J - Backend API

Backend Node.js + Express pour l'application de santé mentale hybride (IA + Psychologue).

## 📋 Stack Technique

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de données:** MongoDB avec Mongoose
- **Authentification:** JWT + bcryptjs
- **IA:** OpenAI GPT-4
- **Validation:** express-validator
- **Logging:** Winston
- **Rate Limiting:** express-rate-limit

## 🚀 Installation

### Prérequis

- Node.js 18+ installé
- MongoDB (local ou Atlas)
- Clé API OpenAI (GPT-4)

### Étapes

1. **Installer les dépendances**

```bash
cd server
npm install
```

2. **Configurer les variables d'environnement**

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Puis éditer `.env` avec vos valeurs :

```env
# Obligatoires
MONGODB_URI=mongodb://localhost:27017/projet-j
JWT_SECRET=your-very-long-secret-key-minimum-32-characters
OPENAI_API_KEY=sk-your-openai-api-key

# Optionnels
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:19006
```

**⚠️ Important:** Générez un JWT_SECRET sécurisé avec :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Démarrer MongoDB**

Si MongoDB local :

```bash
mongod
```

Si MongoDB Atlas, utilisez l'URI de connexion dans `.env`.

4. **Créer des comptes de test (optionnel)**

```bash
npm run seed
```

Cela créera :
- 1 compte pro : `dr.martin@example.com` / `Password123`
- 2 comptes patients test

5. **Démarrer le serveur**

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`.

## 📁 Structure du Projet

```
server/
├── src/
│   ├── config/          # Configurations (DB, JWT, OpenAI)
│   ├── models/          # Schémas Mongoose
│   ├── routes/          # Routes Express
│   ├── controllers/     # Logique métier
│   ├── services/        # Services (OpenAI, reports, notifications)
│   ├── middleware/      # Middlewares (auth, rate limiting, etc.)
│   ├── utils/           # Utilitaires (logger, validators, constants)
│   └── server.js        # Point d'entrée
├── scripts/             # Scripts utilitaires
├── logs/                # Logs Winston (auto-créé)
├── .env.example         # Template variables d'environnement
└── package.json
```

## 🔌 Endpoints API

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription patient (avec invite token) | Non |
| POST | `/login` | Connexion (patient ou pro) | Non |
| POST | `/generate-invite` | Générer un lien d'invitation | Pro |
| GET | `/validate-token/:token` | Valider un invite token | Non |
| GET | `/me` | Profil utilisateur courant | Oui |

### Chat (`/api/chat`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/start` | Démarrer une conversation | Patient |
| POST | `/send` | Envoyer un message + réponse IA | Patient |
| POST | `/end/:conversationId` | Terminer une conversation | Patient |
| GET | `/history` | Historique des conversations | Patient |
| GET | `/conversation/:id` | Détails d'une conversation | Patient/Pro |
| GET | `/conversation/:id/messages` | Polling nouveaux messages | Patient/Pro |
| PATCH | `/conversation/:id/view` | Marquer comme vue par le pro | Pro |

### Dashboard (`/api/dashboard`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/patients` | Liste des patients avec stats | Pro |
| GET | `/patient/:id/conversations` | Historique conversations d'un patient | Pro |
| GET | `/patient/:id/live` | Conversation active d'un patient | Pro |
| GET | `/reports` | Liste des rapports (filtrable) | Pro |
| PATCH | `/report/:id/read` | Marquer un rapport comme lu | Pro |

## 🤖 Intégration OpenAI

L'application utilise GPT-4 pour trois fonctions :

### 1. Calcul du Gravity Score (1-3)

Analyse chaque message patient pour détecter le niveau de détresse émotionnelle.

### 2. Génération de Résumés

Crée un résumé professionnel des conversations pour les psychologues.

### 3. Réponses du Chatbot

Génère des réponses empathiques et bienveillantes pour le support émotionnel.

**Tous les prompts sont définis dans :** `src/utils/constants.js`

## 🔒 Sécurité

- **JWT:** Expiration 24h, secret minimum 32 caractères
- **Bcrypt:** 12 salt rounds pour le hachage des mots de passe
- **Rate Limiting:**
  - Login: 5 tentatives / 15 min
  - Register: 3 / heure
  - Messages: 30 / min
- **Validation:** express-validator sur tous les endpoints
- **CORS:** Configuré pour autoriser uniquement le frontend

## 📊 Modèles de Données

### User
- Rôle: `patient` | `pro`
- Authentification: email + passwordHash (bcrypt)
- Relation: patients liés à un pro via `linkedProId`

### Conversation
- Messages (array): `{sender, text, timestamp, gravityScore?}`
- Status: `active` | `ended`
- Tracking: `highestGravityScore`, `reportGenerated`

### SessionReport
- Résumé IA de la conversation
- Gravity score global
- Key topics (mots-clés)
- Trigger reason: pourquoi le rapport a été généré
- Status: `unread` | `read`

### InviteToken
- Tokens UUID v4 one-time use
- Expiration: 7 jours par défaut
- Nettoyage automatique via cron

## 🧪 Tests

TODO: Tests avec Jest/Supertest (Phase 2)

## 📝 Logs

Les logs sont écrits dans :
- `logs/combined.log` : Tous les logs
- `logs/error.log` : Erreurs uniquement
- Console : En mode développement

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Démarrage avec nodemon (hot reload)
npm start            # Démarrage production
npm run seed         # Créer des comptes de test
npm run cleanup-tokens  # Nettoyer les tokens expirés
```

## 🚨 Alertes Détresse Critique

Lorsqu'un patient envoie un message avec `gravityScore = 3` :

1. ✅ SessionReport créé immédiatement
2. 📲 Notification push au psychologue
3. 💬 Message d'urgence auto-inséré (numéros d'aide)
4. 🔵 Flag `isBeingViewedByPro` activé

## 🌐 Déploiement

### Variables d'environnement requises

- `MONGODB_URI` : URI MongoDB
- `JWT_SECRET` : Secret JWT (32+ caractères)
- `OPENAI_API_KEY` : Clé API OpenAI
- `FRONTEND_URL` : URL du frontend (pour CORS)
- `NODE_ENV=production`

### Recommandations

- **Backend:** Render, Railway, ou serveur VPS
- **MongoDB:** MongoDB Atlas (cluster gratuit disponible)
- **Logs:** Configurer un service de monitoring (Sentry, DataDog)
- **Cron:** Configurer `cleanup-tokens.js` pour s'exécuter quotidiennement

## 📞 Support

Pour toute question, consulter la documentation ou contacter l'équipe de développement.

---

**Version:** 1.0.0 (MVP)  
**Dernière mise à jour:** Janvier 2026
