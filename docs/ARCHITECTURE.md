# 🏛️ Architecture Technique - Projet J

Documentation détaillée de l'architecture technique du système.

---

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture Frontend](#-architecture-frontend)
- [Architecture Backend](#-architecture-backend)
- [Modèles de Données](#-modèles-de-données)
- [Flux de Données](#-flux-de-données)
- [Intégration IA](#-intégration-ia)
- [Sécurité](#-sécurité)
- [Performance](#-performance)

---

## 🌐 Vue d'ensemble

### Stack Technologique Complète

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT MOBILE                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Expo SDK 54 + React Native 0.81                  │  │
│  │  TypeScript 5.3 + NativeWind (Tailwind CSS)       │  │
│  │  Expo Router (Navigation) + Context API (State)   │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS/REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   API BACKEND                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Node.js 18+ + Express.js 4.x                     │  │
│  │  JWT Auth + Bcrypt + Rate Limiting                │  │
│  │  Winston (Logging) + Mongoose (ODM)               │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
         │             │              │
         ▼             ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ MongoDB  │  │ OpenAI   │  │  Google  │
   │  Atlas   │  │  GPT-4   │  │  Gemini  │
   └──────────┘  └──────────┘  └──────────┘
```

### Principes Architecturaux

1. **Séparation des Préoccupations** : Frontend/Backend découplés
2. **API First** : Backend expose une API REST complète
3. **Stateless Authentication** : JWT sans session serveur
4. **Reactive UI** : React Context + Hooks pour la réactivité
5. **Mobile First** : Optimisé pour iOS/Android natif
6. **AI-Driven** : IA au cœur du système de détection et réponse

---

## 📱 Architecture Frontend

### Structure des Dossiers

```
app/
├── app/                          # Expo Router (File-based routing)
│   ├── _layout.tsx              # Layout racine (Auth provider)
│   ├── index.tsx                # Redirection initiale
│   │
│   ├── (auth)/                  # Groupe routes non-authentifiées
│   │   ├── _layout.tsx         # Layout auth
│   │   ├── login.tsx           # Écran login
│   │   └── signup.tsx          # Écran signup
│   │
│   ├── (patient)/              # Groupe routes patient
│   │   ├── _layout.tsx         # Layout avec bottom tabs
│   │   ├── chat.tsx            # Conversation IA
│   │   ├── history.tsx         # Historique conversations
│   │   └── profile.tsx         # Profil patient
│   │
│   └── (pro)/                  # Groupe routes pro
│       ├── _layout.tsx         # Layout dashboard
│       ├── dashboard.tsx       # Vue d'ensemble patients
│       ├── invite.tsx          # Génération invitations
│       └── patient/
│           └── [id].tsx        # Détail patient dynamique
│
├── components/
│   ├── ui/                     # Composants UI génériques
│   │   ├── Button.tsx          # Bouton réutilisable
│   │   ├── Input.tsx           # Input avec validation
│   │   ├── Card.tsx            # Card container
│   │   └── Badge.tsx           # Badge (status, scores)
│   │
│   ├── chat/                   # Composants spécifiques chat
│   │   ├── ChatBubble.tsx      # Bulle de message
│   │   ├── ChatInput.tsx       # Input avec bouton send
│   │   └── TypingIndicator.tsx # Animation "en train d'écrire"
│   │
│   └── dashboard/              # Composants dashboard pro
│       ├── PatientCard.tsx     # Card patient avec stats
│       ├── ReportCard.tsx      # Card rapport de session
│       ├── GravityBadge.tsx    # Badge score gravité animé
│       └── LiveIndicator.tsx   # Indicateur "en conversation"
│
├── contexts/
│   ├── AuthContext.tsx         # Gestion auth + user state
│   └── NotificationContext.tsx # Gestion push notifications
│
├── services/
│   ├── api.ts                  # Client Axios + intercepteurs
│   ├── auth.service.ts         # Login, register, me
│   ├── chat.service.ts         # Conversations, messages
│   ├── dashboard.service.ts    # Patients, rapports (pro)
│   └── storage.service.ts      # AsyncStorage wrapper
│
├── hooks/
│   ├── useAuth.ts              # Hook auth (login, logout, user)
│   ├── useChat.ts              # Hook chat (send, start, end)
│   └── usePolling.ts           # Hook polling temps réel
│
├── types/
│   ├── user.types.ts           # User, Patient, Pro
│   ├── conversation.types.ts   # Conversation, Message
│   └── report.types.ts         # SessionReport
│
└── utils/
    ├── constants.ts            # Constantes app (API_URL, etc.)
    ├── formatters.ts           # Format dates, textes
    └── validators.ts           # Validation formulaires
```

### Flux de Navigation

```
App Start
   │
   ├─► AuthContext initialise
   │   └─► Vérifie AsyncStorage pour JWT
   │
   ├─► JWT trouvé?
   │   ├─► OUI → Valide avec /auth/me
   │   │   └─► Redirige vers (patient) ou (pro)
   │   │
   │   └─► NON → Redirige vers (auth)/login
   │
   └─► User logout
       └─► Supprime JWT + redirige (auth)/login
```

### Gestion d'État

```typescript
// Contexte Auth (global)
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

// Contexte Notifications (global)
interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notification | null;
  registerForPushNotifications: () => Promise<void>;
}

// État local (hooks)
- useChat() : État conversation active
- usePolling() : Polling nouveaux messages
```

---

## ⚙️ Architecture Backend

### Structure des Dossiers

```
server/
├── src/
│   ├── config/
│   │   ├── database.js         # Connexion MongoDB
│   │   ├── jwt.js              # Config JWT (secret, expiration)
│   │   └── gemini.js           # Client Gemini AI
│   │
│   ├── models/
│   │   ├── User.js             # Schéma utilisateur
│   │   ├── Conversation.js     # Schéma conversation
│   │   ├── SessionReport.js    # Schéma rapport
│   │   └── InviteToken.js      # Schéma token invitation
│   │
│   ├── controllers/
│   │   ├── auth.controller.js  # Login, register, me, invite
│   │   ├── chat.controller.js  # Start, send, end, history
│   │   └── dashboard.controller.js # Patients, reports, live
│   │
│   ├── services/
│   │   ├── ai.service.js       # Interaction Gemini/OpenAI
│   │   ├── notification.service.js # Push notifications
│   │   └── token.service.js    # Génération/validation tokens
│   │
│   ├── middleware/
│   │   ├── authJWT.js          # Vérification JWT
│   │   ├── roleCheck.js        # Vérification rôle (patient/pro)
│   │   ├── errorHandler.js     # Gestion erreurs globale
│   │   └── rateLimiter.js      # Rate limiting
│   │
│   ├── routes/
│   │   ├── auth.routes.js      # /api/auth/*
│   │   ├── chat.routes.js      # /api/chat/*
│   │   └── dashboard.routes.js # /api/dashboard/*
│   │
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   ├── constants.js        # Prompts IA, constantes
│   │   └── validators.js       # Validators express-validator
│   │
│   └── server.js               # Point d'entrée
│
└── scripts/
    ├── seed.js                 # Créer comptes de test
    └── cleanup-tokens.js       # Nettoyer tokens expirés
```

### Middleware Chain

```
Request
   │
   ├─► CORS (origine autorisée)
   │
   ├─► Helmet (sécurité headers)
   │
   ├─► Express JSON parser
   │
   ├─► Rate Limiter (global: 100 req/15min)
   │
   ├─► Router (/api/auth, /api/chat, /api/dashboard)
   │   │
   │   ├─► Rate Limiter spécifique (login: 5/15min)
   │   │
   │   ├─► Validation (express-validator)
   │   │
   │   ├─► authJWT (vérif token si protégé)
   │   │
   │   ├─► roleCheck (vérifie rôle si nécessaire)
   │   │
   │   └─► Controller
   │       └─► Service (si logique complexe)
   │           └─► Model (MongoDB)
   │
   └─► Error Handler (global)
       └─► Response (JSON)
```

---

## 🗄️ Modèles de Données

### User

```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase, trimmed),
  passwordHash: String (bcrypt 12 rounds),
  role: Enum["patient", "pro"],
  firstName: String,
  lastName: String,
  linkedProId: ObjectId (ref: User) // Pour patients
  createdAt: Date,
  updatedAt: Date
}
```

**Index** : `email` (unique), `role`, `linkedProId`

### Conversation

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: User),
  messages: [
    {
      sender: Enum["user", "ai"],
      text: String,
      timestamp: Date,
      gravityScore: Number (1-3, optionnel)
    }
  ],
  status: Enum["active", "ended"],
  startedAt: Date,
  endedAt: Date,
  highestGravityScore: Number (1-3),
  reportGenerated: Boolean,
  isBeingViewedByPro: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Index** : `patientId`, `status`, `highestGravityScore`

### SessionReport

```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: Conversation),
  patientId: ObjectId (ref: User),
  proId: ObjectId (ref: User),
  summary: String, // Résumé IA
  overallGravityScore: Number (1-3),
  keyTopics: [String], // Mots-clés extraits
  triggerReason: Enum["manual", "gravity_3", "session_end"],
  status: Enum["unread", "read"],
  createdAt: Date,
  readAt: Date
}
```

**Index** : `conversationId` (unique), `patientId`, `proId`, `status`

### InviteToken

```javascript
{
  _id: ObjectId,
  token: String (UUID v4, unique),
  createdByProId: ObjectId (ref: User),
  email: String (optionnel, pour pré-remplir),
  expiresAt: Date (default: +7 jours),
  used: Boolean,
  usedByUserId: ObjectId (ref: User, optionnel),
  usedAt: Date,
  createdAt: Date
}
```

**Index** : `token` (unique), `used`, `expiresAt`

---

## 🔄 Flux de Données

### 1. Inscription Patient

```
[Frontend]                  [Backend]                 [Database]
     │                          │                         │
     ├─► POST /auth/register    │                         │
     │   { token, email, pwd }  │                         │
     │                          │                         │
     │                          ├─► Valide token         │
     │                          │   (non expiré, non      │
     │                          │    utilisé)             │
     │                          │                         │
     │                          ├─► Hash password        │
     │                          │   (bcrypt 12 rounds)    │
     │                          │                         │
     │                          ├─────────────────────► Create User
     │                          │                         │
     │                          ├─────────────────────► Mark token used
     │                          │                         │
     │                          ├─► Génère JWT           │
     │                          │                         │
     │   ◄──────────────────────┤ { user, token }        │
     │                          │                         │
     ├─► Stocke JWT             │                         │
     │   (AsyncStorage)         │                         │
     │                          │                         │
     └─► Redirige /patient      │                         │
```

### 2. Envoi Message Patient

```
[Frontend]                  [Backend]                 [IA]         [Database]
     │                          │                      │               │
     ├─► POST /chat/send        │                      │               │
     │   { conversationId,      │                      │               │
     │     text: "Je suis       │                      │               │
     │             triste" }    │                      │               │
     │                          │                      │               │
     │                          ├──────────────────► Analyse          │
     │                          │                    Gravity Score    │
     │                          │                                     │
     │                          │                    (Score = 2)      │
     │                          │   ◄─────────────────┤               │
     │                          │                      │               │
     │                          ├──────────────────────────────────► Save message
     │                          │                      │             (user, score=2)
     │                          │                      │               │
     │                          ├──────────────────► Génère           │
     │                          │                    réponse IA       │
     │                          │                                     │
     │                          │   ◄─────────────────┤               │
     │                          │   "Je comprends..."                 │
     │                          │                      │               │
     │                          ├──────────────────────────────────► Save AI response
     │                          │                      │               │
     │   ◄──────────────────────┤                      │               │
     │   { userMessage, aiMessage,                     │               │
     │     gravityScore: 2 }    │                      │               │
     │                          │                      │               │
     └─► Affiche messages       │                      │               │
```

### 3. Alerte Critique (Gravity = 3)

```
[Frontend]              [Backend]               [IA]        [Database]      [Pro]
     │                      │                     │              │             │
     ├─► POST /chat/send    │                     │              │             │
     │   "Je veux mourir"   │                     │              │             │
     │                      │                     │              │             │
     │                      ├─────────────────► Analyse          │             │
     │                      │                   Score = 3 ⚠️     │             │
     │                      │   ◄─────────────────┤              │             │
     │                      │                     │              │             │
     │                      ├───────────────────────────────► Save message     │
     │                      │                     │            (score=3)       │
     │                      │                     │              │             │
     │                      ├─► TRIGGER ALERT    │              │             │
     │                      │                     │              │             │
     │                      ├───────────────────────────────► Set isBeingViewedByPro
     │                      │                                    = true        │
     │                      │                     │              │             │
     │                      ├────────────────► Génère résumé     │             │
     │                      │   ◄─────────────────┤              │             │
     │                      │                     │              │             │
     │                      ├───────────────────────────────► Create SessionReport
     │                      │                     │              │             │
     │                      ├──────────────────────────────────────────────► Push
     │                      │                     │              │         Notification
     │                      │                     │              │             │
     │                      ├─► Insert message urgence          │             │
     │                      │   (numéros SOS)     │              │             │
     │                      │                     │              │             │
     │   ◄──────────────────┤                     │              │             │
     │   { ..., badge:      │                     │              │             │
     │     "Thérapeute      │                     │              │             │
     │      consulte" }     │                     │              │             │
     │                      │                     │              │             │
     └─► Affiche badge      │                     │              │             │
```

---

## 🤖 Intégration IA

### Services IA Disponibles

```javascript
// src/services/ai.service.js

export const AIService = {
  // 1. Calculer Gravity Score (1-3)
  async calculateGravityScore(message) {
    // Prompt: Analyse émotionnelle → 1-3
    return await gemini.generateContent(PROMPTS.GRAVITY_SCORE);
  },

  // 2. Générer Réponse Chatbot
  async generateChatResponse(conversationHistory) {
    // Prompt: Empathie + bienveillance
    return await gemini.generateContent(PROMPTS.CHAT_RESPONSE);
  },

  // 3. Générer Résumé SessionReport
  async generateSessionSummary(messages) {
    // Prompt: Résumé professionnel + key topics
    return await gemini.generateContent(PROMPTS.SESSION_SUMMARY);
  }
};
```

### Prompts (constants.js)

```javascript
export const PROMPTS = {
  GRAVITY_SCORE: `
Tu es un assistant psychologique expert.
Analyse ce message et évalue le niveau de détresse émotionnelle:
- 1 (Stable): Conversation normale, pas de détresse
- 2 (Vigilance): Soucis modérés, surveillance nécessaire
- 3 (Critique): Détresse aiguë, intervention urgente

Message: {message}

Réponds uniquement avec le chiffre 1, 2 ou 3.
  `,

  CHAT_RESPONSE: `
Tu es un chatbot de soutien psychologique empathique et bienveillant.
Historique: {history}
Message patient: {message}

Réponds de manière chaleureuse et soutenante (2-3 phrases max).
N'agis JAMAIS comme un thérapeute qualifié.
Rappelle au patient de consulter un professionnel si nécessaire.
  `,

  SESSION_SUMMARY: `
Tu es un psychologue générant un rapport de session.
Messages: {messages}

Génère:
1. Résumé professionnel (100-150 mots)
2. Thèmes principaux (5 mots-clés max)
3. Score gravité global (1-3)

Format JSON:
{ "summary": "...", "keyTopics": [...], "score": 1-3 }
  `
};
```

---

## 🔒 Sécurité

### 1. Authentification JWT

```javascript
// Token structure
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "patient",
  "iat": 1643000000,
  "exp": 1643086400  // +24h
}
```

**Génération** : `jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '24h' })`
**Vérification** : Middleware `authJWT` sur toutes les routes protégées

### 2. Hachage Mots de Passe

```javascript
// bcryptjs avec 12 salt rounds
const hash = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hash);
```

### 3. Rate Limiting

```javascript
// Global
rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Login
rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

// Register
rateLimit({ windowMs: 60 * 60 * 1000, max: 3 });

// Messages
rateLimit({ windowMs: 60 * 1000, max: 30 });
```

### 4. Validation

```javascript
// express-validator sur TOUS les endpoints
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 8 }),
body('role').isIn(['patient', 'pro'])
```

### 5. CORS

```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:19006',
  credentials: true
});
```

---

## ⚡ Performance

### 1. Database Indexing

```javascript
// User.js
schema.index({ email: 1 }, { unique: true });

// Conversation.js
schema.index({ patientId: 1, status: 1 });
schema.index({ highestGravityScore: -1 });

// SessionReport.js
schema.index({ conversationId: 1 }, { unique: true });
schema.index({ status: 1, createdAt: -1 });
```

### 2. Caching (Frontend)

```typescript
// AsyncStorage pour JWT
await AsyncStorage.setItem('authToken', token);

// État local React (évite re-fetch)
const [conversations, setConversations] = useState([]);
```

### 3. Pagination

```javascript
// Historique conversations
router.get('/history', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const conversations = await Conversation
    .find({ patientId: req.userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
});
```

### 4. Lazy Loading (Frontend)

```typescript
// Navigation par Expo Router
// Chaque screen chargé uniquement quand nécessaire
```

---

## 🔮 Évolutions Futures

### Phase 2: Temps Réel

```
WebSockets (Socket.io)
   │
   ├─► Room par conversation
   ├─► Événement "message" (bidirectionnel)
   ├─► Événement "typing" (patient + pro)
   └─► Événement "pro_viewing" (badge temps réel)
```

### Phase 3: Scalabilité

```
Backend
   ├─► Load Balancer (Nginx)
   ├─► Horizontal Scaling (PM2 cluster mode)
   ├─► Redis (cache + sessions)
   └─► CDN (assets statiques)

Database
   ├─► MongoDB Sharding
   └─► Read Replicas
```

---

## 📊 Diagramme Architecture Complète

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE APP (Expo)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Login   │  │   Chat   │  │ History  │  │Dashboard │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │              │              │               │
│       └─────────────┴──────────────┴──────────────┘               │
│                          │                                        │
│                   ┌──────▼───────┐                                │
│                   │ AuthContext  │                                │
│                   │ (JWT Store)  │                                │
│                   └──────┬───────┘                                │
│                          │                                        │
│                   ┌──────▼───────┐                                │
│                   │ Axios Client │                                │
│                   │ (Interceptor)│                                │
│                   └──────┬───────┘                                │
└──────────────────────────┼────────────────────────────────────────┘
                           │ HTTPS REST
┌──────────────────────────▼────────────────────────────────────────┐
│                     EXPRESS BACKEND                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Auth    │  │   Chat   │  │Dashboard │  │  Utils   │          │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ (Logger) │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────┘          │
│       │             │              │                               │
│       └─────────────┴──────────────┘                               │
│                     │                                              │
│            ┌────────▼────────┐                                     │
│            │  Middleware     │                                     │
│            │  (JWT, Rate,    │                                     │
│            │   Validation)   │                                     │
│            └────────┬────────┘                                     │
│                     │                                              │
│            ┌────────▼────────┐                                     │
│            │  Controllers    │                                     │
│            └────────┬────────┘                                     │
│                     │                                              │
│            ┌────────▼────────┐                                     │
│            │    Services     │                                     │
│            │  (AI, Notif)    │                                     │
│            └────────┬────────┘                                     │
│                     │                                              │
│            ┌────────▼────────┐                                     │
│            │  Mongoose ODM   │                                     │
│            └────────┬────────┘                                     │
└─────────────────────┼──────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
        ▼             ▼             ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ MongoDB  │  │ OpenAI   │  │  Gemini  │  │   Expo   │
  │  Atlas   │  │  GPT-4   │  │   AI     │  │   Push   │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

**Dernière mise à jour**: Février 2026
**Version**: 1.0.0
**Statut**: ✅ Documentation complète
