# 🔒 Sécurité - Projet J

Guide complet des mesures de sécurité implémentées dans l'application.

---

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Authentification](#-authentification)
- [Autorisation](#-autorisation)
- [Protection des Données](#-protection-des-données)
- [Sécurité API](#-sécurité-api)
- [Conformité RGPD](#-conformité-rgpd)
- [Bonnes Pratiques](#-bonnes-pratiques)
- [Audit de Sécurité](#-audit-de-sécurité)

---

## 🛡️ Vue d'ensemble

### Principes de Sécurité

1. **Défense en Profondeur** : Multiples couches de sécurité
2. **Principe du Moindre Privilège** : Accès minimal nécessaire
3. **Chiffrement par Défaut** : Données sensibles toujours chiffrées
4. **Validation Stricte** : Toutes les entrées utilisateur validées
5. **Journalisation** : Traçabilité complète des actions

### Niveau de Sécurité

| Composant | Niveau | Certification |
|-----------|--------|---------------|
| Authentification | ⭐⭐⭐⭐⭐ | JWT + Bcrypt |
| API | ⭐⭐⭐⭐ | Rate Limiting + CORS |
| Base de données | ⭐⭐⭐⭐⭐ | MongoDB Atlas (TLS 1.2+) |
| Frontend | ⭐⭐⭐⭐ | HTTPS + Secure Storage |

---

## 🔐 Authentification

### 1. JSON Web Tokens (JWT)

#### Configuration

```javascript
// server/src/config/jwt.js

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,      // Min 32 caractères
  expiresIn: '24h',                    // Token expire après 24h
  algorithm: 'HS256',                  // HMAC SHA-256
  issuer: 'projet-j-api',
  audience: 'projet-j-app'
};
```

#### Génération de Secret Sécurisé

```bash
# Générer un secret JWT de 64 caractères
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Résultat (exemple):
# 4f8a7b2e9d3c1f6e5a8b7c4d2f1e9a6b3c5d7e9f1a2b4c6d8e0f2a4b6c8d0e2f4
```

#### Structure du Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "patient@example.com",
    "role": "patient",
    "iat": 1643000000,  // Issued At
    "exp": 1643086400,  // Expiration (+24h)
    "iss": "projet-j-api",
    "aud": "projet-j-app"
  },
  "signature": "..."
}
```

#### Vérification Token

```javascript
// Middleware authJWT.js

export const verifyToken = async (req, res, next) => {
  try {
    // 1. Extraire token du header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Vérifier et décoder
    const decoded = jwt.verify(token, JWT_CONFIG.secret, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    });

    // 3. Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur inexistant' });
    }

    // 4. Attacher user à la requête
    req.userId = user._id;
    req.userRole = user.role;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
};
```

#### Stockage Sécurisé (Frontend)

```typescript
// app/services/storage.service.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  // Stocker le token
  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  },

  // Récupérer le token
  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },

  // Supprimer le token (logout)
  async removeAuthToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  }
};
```

**⚠️ Important** : AsyncStorage est **sécurisé** sur iOS/Android (keychain/keystore).

---

### 2. Hachage des Mots de Passe

#### Configuration Bcrypt

```javascript
// Paramètres
const SALT_ROUNDS = 12;  // 2^12 itérations (recommandé OWASP)

// Temps de hachage: ~200-300ms (acceptable pour UX)
```

#### Inscription (Hachage)

```javascript
// auth.controller.js

export const register = async (req, res) => {
  const { password } = req.body;

  // 1. Valider force du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre'
    });
  }

  // 2. Hacher le mot de passe
  const passwordHash = await bcrypt.hash(password, 12);

  // 3. Créer l'utilisateur (JAMAIS stocker password en clair)
  const user = await User.create({
    email,
    passwordHash,  // ✅ Hash stocké
    // password    // ❌ JAMAIS ÇA
    ...otherFields
  });
};
```

#### Login (Vérification)

```javascript
// auth.controller.js

export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Trouver utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    // ⚠️ Message générique (évite énumération)
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // 2. Comparer mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // 3. Générer JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_CONFIG.secret,
    { expiresIn: JWT_CONFIG.expiresIn }
  );

  res.json({ user, token });
};
```

#### Règles Mots de Passe

| Règle | Valeur | Raison |
|-------|--------|--------|
| Longueur minimale | 8 caractères | Standard industrie |
| Majuscule | Obligatoire | Complexité |
| Minuscule | Obligatoire | Complexité |
| Chiffre | Obligatoire | Complexité |
| Caractère spécial | Recommandé | Sécurité renforcée |

---

## 🛡️ Autorisation

### Contrôle d'Accès par Rôle (RBAC)

#### Middleware roleCheck

```javascript
// middleware/roleCheck.js

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: `Cette action est réservée aux: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};
```

#### Utilisation dans les Routes

```javascript
// routes/chat.routes.js

router.post('/start',
  authJWT,                    // ✅ Authentifié
  requireRole('patient'),     // ✅ Uniquement patients
  chatController.start
);

router.get('/dashboard/patients',
  authJWT,                    // ✅ Authentifié
  requireRole('pro'),         // ✅ Uniquement pros
  dashboardController.getPatients
);
```

#### Matrice des Permissions

| Endpoint | Patient | Pro | Public |
|----------|---------|-----|--------|
| POST /auth/login | ✅ | ✅ | ✅ |
| POST /auth/register | ✅ | ❌ | ✅ (avec token) |
| POST /chat/start | ✅ | ❌ | ❌ |
| POST /chat/send | ✅ | ❌ | ❌ |
| GET /chat/history | ✅ (propres convs) | ❌ | ❌ |
| GET /dashboard/patients | ❌ | ✅ | ❌ |
| POST /auth/generate-invite | ❌ | ✅ | ❌ |

### Protection des Ressources

#### Vérification Ownership

```javascript
// chat.controller.js

export const getConversation = async (req, res) => {
  const { id } = req.params;
  const conversation = await Conversation.findById(id);

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation non trouvée' });
  }

  // ✅ Vérifier que l'utilisateur peut accéder à cette conversation
  if (req.userRole === 'patient') {
    // Patient: uniquement ses propres conversations
    if (conversation.patientId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
  } else if (req.userRole === 'pro') {
    // Pro: uniquement conversations de ses patients
    const patient = await User.findById(conversation.patientId);
    if (patient.linkedProId?.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
  }

  res.json({ conversation });
};
```

---

## 🔒 Protection des Données

### 1. Chiffrement en Transit (HTTPS)

#### Configuration TLS

```javascript
// Production (avec certificat SSL/TLS)
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem'),
  minVersion: 'TLSv1.2',  // TLS 1.2 minimum
  cipherSuites: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384'
  ]
};

https.createServer(options, app).listen(443);
```

#### Redirection HTTP → HTTPS

```javascript
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### 2. Chiffrement en Repos (Database)

```javascript
// MongoDB Atlas: Chiffrement automatique AES-256
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/projet-j?retryWrites=true&w=majority&tls=true
```

### 3. Sanitisation des Données

```javascript
// Prévention NoSQL Injection
import mongoSanitize from 'express-mongo-sanitize';

app.use(mongoSanitize({
  replaceWith: '_'  // Remplace $, . par _
}));

// Exemple attaque bloquée:
// { "email": { "$gt": "" }, "password": "anything" }
// Devient: { "email": { "_gt": "" }, "password": "anything" }
```

### 4. Protection XSS

```javascript
// Validation stricte des entrées
import { body } from 'express-validator';

router.post('/send',
  body('text')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape(),  // Échappe HTML (<script> → &lt;script&gt;)
  chatController.send
);
```

---

## 🚨 Sécurité API

### 1. Rate Limiting

#### Configuration Globale

```javascript
// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// Limite globale
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requêtes max
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,      // Retourne headers RateLimit-*
  legacyHeaders: false
});

// Limite stricte login (anti brute-force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 tentatives max
  skipSuccessfulRequests: true,
  message: {
    error: 'Trop de tentatives de connexion, compte temporairement bloqué',
    retryAfter: '15 minutes'
  }
});

// Limite messages (anti spam)
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 30,                    // 30 messages max
  message: {
    error: 'Vous envoyez des messages trop rapidement',
    retryAfter: '1 minute'
  }
});
```

#### Application

```javascript
// server.js
app.use('/api', globalLimiter);

// routes/auth.routes.js
router.post('/login', loginLimiter, authController.login);

// routes/chat.routes.js
router.post('/send', authJWT, messageLimiter, chatController.send);
```

### 2. CORS (Cross-Origin Resource Sharing)

```javascript
// server.js
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    // Liste blanche des origines autorisées
    const whitelist = [
      process.env.FRONTEND_URL,           // Ex: http://localhost:19006
      'https://votre-app.com',
      'https://staging.votre-app.com'
    ];

    // Autoriser requêtes sans origin (mobile apps)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS non autorisé pour cette origine'));
    }
  },
  credentials: true,                      // Autorise cookies/auth headers
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### 3. Headers de Sécurité (Helmet)

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.openai.com']
    }
  },
  hsts: {
    maxAge: 31536000,                    // 1 an
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },        // Anti clickjacking
  noSniff: true,                          // Anti MIME sniffing
  xssFilter: true                         // XSS protection
}));
```

### 4. Validation des Entrées

```javascript
// utils/validators.js
import { body, param, query } from 'express-validator';

export const validators = {
  register: [
    body('email')
      .isEmail().withMessage('Email invalide')
      .normalizeEmail()
      .toLowerCase(),
    body('password')
      .isLength({ min: 8 }).withMessage('Minimum 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Doit contenir majuscule, minuscule et chiffre'),
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
        .withMessage('Prénom invalide'),
    body('inviteToken')
      .isUUID(4).withMessage('Token invalide')
  ],

  sendMessage: [
    body('conversationId')
      .isMongoId().withMessage('ID conversation invalide'),
    body('text')
      .trim()
      .isLength({ min: 1, max: 5000 })
        .withMessage('Message entre 1 et 5000 caractères')
      .escape()
  ],

  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page >= 1')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit entre 1 et 100')
      .toInt()
  ]
};

// Middleware de vérification
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation échouée',
      errors: errors.array()
    });
  }
  next();
};
```

---

## 📜 Conformité RGPD

### 1. Minimisation des Données

```javascript
// Collecter uniquement les données nécessaires
const userSchema = new Schema({
  email: String,            // ✅ Nécessaire (auth)
  passwordHash: String,     // ✅ Nécessaire (auth)
  firstName: String,        // ✅ Nécessaire (identification)
  lastName: String,         // ✅ Nécessaire (identification)
  role: String,             // ✅ Nécessaire (autorisation)

  // ❌ PAS collecté:
  // - Adresse complète (inutile pour l'app)
  // - Téléphone (pas de SMS/appels)
  // - Date de naissance (pas nécessaire)
  // - Photo de profil (pas implémenté)
});
```

### 2. Droit à l'Oubli

```javascript
// routes/user.routes.js

router.delete('/account',
  authJWT,
  async (req, res) => {
    try {
      // 1. Anonymiser les conversations (garder pour le pro)
      await Conversation.updateMany(
        { patientId: req.userId },
        {
          $set: {
            patientId: null,
            anonymized: true
          }
        }
      );

      // 2. Supprimer rapports
      await SessionReport.deleteMany({ patientId: req.userId });

      // 3. Supprimer compte
      await User.findByIdAndDelete(req.userId);

      res.json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression compte' });
    }
  }
);
```

### 3. Portabilité des Données

```javascript
// Exporter toutes les données utilisateur
router.get('/export',
  authJWT,
  async (req, res) => {
    const user = await User.findById(req.userId).select('-passwordHash');
    const conversations = await Conversation.find({ patientId: req.userId });

    const exportData = {
      user,
      conversations,
      exportedAt: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=mes-donnees.json');
    res.json(exportData);
  }
);
```

### 4. Conservation des Données

```javascript
// scripts/cleanup-old-data.js

// Supprimer conversations > 2 ans
const twoYearsAgo = new Date();
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

await Conversation.deleteMany({
  endedAt: { $lt: twoYearsAgo },
  status: 'ended'
});

// Nettoyer tokens expirés
await InviteToken.deleteMany({
  expiresAt: { $lt: new Date() }
});
```

---

## ✅ Bonnes Pratiques

### Checklist Développeur

- [ ] ✅ **Jamais de secrets en dur** dans le code
  ```javascript
  // ❌ MAL
  const apiKey = "sk-proj-abc123...";

  // ✅ BIEN
  const apiKey = process.env.OPENAI_API_KEY;
  ```

- [ ] ✅ **Toujours valider les entrées utilisateur**
- [ ] ✅ **Jamais de données sensibles dans les logs**
  ```javascript
  // ❌ MAL
  logger.info('Login:', { email, password });

  // ✅ BIEN
  logger.info('Login attempt:', { email });
  ```

- [ ] ✅ **Messages d'erreur génériques** (éviter fuite d'info)
  ```javascript
  // ❌ MAL: "Mot de passe incorrect pour user@example.com"
  // ✅ BIEN: "Email ou mot de passe incorrect"
  ```

- [ ] ✅ **Utiliser HTTPS en production**
- [ ] ✅ **Garder dépendances à jour**
  ```bash
  npm audit
  npm audit fix
  ```

---

## 🔍 Audit de Sécurité

### Tests de Pénétration

```bash
# OWASP ZAP (scanner vulnérabilités)
zap-cli quick-scan --self-contained http://localhost:5000

# SQLMap (injection SQL - pas applicable ici)
# Burp Suite (analyse manuelle)
```

### Scan Dépendances

```bash
# npm audit
npm audit --production

# Snyk
npx snyk test

# Dependabot (GitHub)
# Configure dans .github/dependabot.yml
```

### Checklist Pré-Production

- [ ] Certificat SSL/TLS valide
- [ ] Toutes les variables sensibles dans `.env`
- [ ] Rate limiting activé
- [ ] Helmet configuré
- [ ] CORS restrictif
- [ ] Logs ne contiennent pas de secrets
- [ ] Backup base de données automatisé
- [ ] Plan de réponse aux incidents défini

---

**Dernière mise à jour**: Février 2026
**Version**: 1.0.0
**Niveau de sécurité**: ⭐⭐⭐⭐ (Production-ready)
