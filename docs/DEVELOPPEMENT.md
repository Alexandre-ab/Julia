# 💻 Guide de Développement - Projet J

Guide complet pour les développeurs qui souhaitent contribuer au projet.

---

## 📋 Table des Matières

- [Configuration Environnement](#-configuration-environnement)
- [Standards de Code](#-standards-de-code)
- [Architecture du Code](#-architecture-du-code)
- [Workflow Git](#-workflow-git)
- [Tests](#-tests)
- [Debugging](#-debugging)
- [Contribution](#-contribution)

---

## 🛠️ Configuration Environnement

### Prérequis

| Outil | Version | Installation |
|-------|---------|--------------|
| **Node.js** | 18.x ou supérieur | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x ou supérieur | Inclus avec Node.js |
| **Git** | 2.x ou supérieur | [git-scm.com](https://git-scm.com/) |
| **MongoDB** | 7.x ou supérieur | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Expo CLI** | Dernière | `npm install -g expo-cli` |

### Installation Complète

#### 1. Cloner le Projet

```bash
# HTTPS
git clone https://github.com/votre-user/projet-j.git
cd projet-j

# SSH (recommandé si clés configurées)
git clone git@github.com:votre-user/projet-j.git
cd projet-j
```

#### 2. Backend

```bash
cd server

# Installer dépendances
npm install

# Créer .env depuis template
cp .env.example .env

# Éditer .env
nano .env
```

**Configuration .env Développement:**

```env
NODE_ENV=development
PORT=5000

# MongoDB local
MONGODB_URI=mongodb://localhost:27017/projet-j

# Générer un JWT secret
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=VOTRE_SECRET_GENERE_ICI_UTILISEZ_LA_COMMANDE_CI_DESSUS

# IA (obtenir clés sur platform.openai.com et ai.google.dev)
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
USE_MOCK_AI=true  # true = réponses simulées (dev sans clés)

# Frontend (Expo par défaut sur :19006)
FRONTEND_URL=http://localhost:19006
```

```bash
# Démarrer MongoDB local
mongod --dbpath ./data

# Créer comptes de test
npm run seed

# Démarrer serveur dev (avec hot reload)
npm run dev
```

**✅ Backend ready:** `http://localhost:5000`

#### 3. Frontend

```bash
cd ../app

# Installer dépendances
npm install

# Créer .env
cp .env.example .env

# Éditer .env
nano .env
```

**Configuration .env Frontend:**

```env
# iOS Simulator / Web
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# Android Emulator
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# Device physique (remplacer par votre IP locale)
# EXPO_PUBLIC_API_URL=http://192.168.1.X:5000/api
```

```bash
# Démarrer Expo
npm start

# Puis:
# - Appuyez sur 'i' pour iOS Simulator
# - Appuyez sur 'a' pour Android Emulator
# - Scannez QR code avec Expo Go sur device physique
```

**✅ Frontend ready:** `http://localhost:19006`

---

## 📏 Standards de Code

### Style Guide

#### Backend (JavaScript)

```javascript
// ✅ BON: ES6+ Modules
import express from 'express';
import { User } from './models/User.js';

// ❌ ÉVITER: CommonJS
const express = require('express');
const User = require('./models/User');

// ✅ BON: Async/Await
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ ÉVITER: Callbacks/Promises
exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.json({ user }))
    .catch(err => res.status(500).json({ error: err }));
};

// ✅ BON: Nommage
const userName = 'Jean';           // camelCase variables
const MAX_ATTEMPTS = 5;            // UPPER_CASE constantes
function calculateScore() {}       // camelCase fonctions
class UserController {}            // PascalCase classes

// ✅ BON: Destructuring
const { email, password } = req.body;
const { userId, role } = req;

// ✅ BON: Arrow functions (courtes)
const double = x => x * 2;
const add = (a, b) => a + b;

// ✅ BON: Fonctions normales (longues/contexte)
async function processConversation(conversationId) {
  // Code complexe...
}
```

#### Frontend (TypeScript)

```typescript
// ✅ BON: Types explicites
interface User {
  _id: string;
  email: string;
  role: 'patient' | 'pro';
  firstName: string;
  lastName: string;
}

const user: User = await fetchUser();

// ❌ ÉVITER: any
const user: any = await fetchUser();

// ✅ BON: Props avec interface
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false
}) => {
  // ...
};

// ✅ BON: Hooks personnalisés
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ✅ BON: Gestion erreurs
try {
  const response = await api.post('/chat/send', { text });
  setMessages(prev => [...prev, response.data]);
} catch (error) {
  if (axios.isAxiosError(error)) {
    Alert.alert('Erreur', error.response?.data?.error || 'Erreur réseau');
  }
}
```

### Commentaires

```javascript
// ✅ BON: Commentaire explique POURQUOI
// Utiliser bcrypt avec 12 rounds pour équilibrer sécurité/performance
const hash = await bcrypt.hash(password, 12);

// ❌ ÉVITER: Commentaire dit QUOI (déjà visible)
// Hasher le mot de passe
const hash = await bcrypt.hash(password, 12);

// ✅ BON: JSDoc pour fonctions publiques
/**
 * Calcule le gravity score d'un message patient
 * @param {string} message - Message du patient
 * @returns {Promise<number>} Score entre 1 et 3
 */
export async function calculateGravityScore(message) {
  // ...
}
```

### Formatage

```bash
# Installer Prettier
npm install --save-dev prettier

# .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}

# Formater automatiquement
npx prettier --write "src/**/*.{js,ts,tsx}"
```

---

## 🏗️ Architecture du Code

### Backend: Structure MVC

```
┌─────────────┐
│   Routes    │  Définit endpoints (/api/chat/send)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  Validation, Auth, Rate Limit
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  Logique métier (chat.controller.js)
└──────┬──────┘
       │
       ├──────► Service (si logique complexe)
       │
       ▼
┌─────────────┐
│    Model    │  Mongoose (Conversation, User)
└─────────────┘
```

#### Exemple: Créer un Nouveau Endpoint

```javascript
// 1. Créer route (routes/chat.routes.js)
import { Router } from 'express';
import * as chatController from '../controllers/chat.controller.js';
import { authJWT } from '../middleware/authJWT.js';

const router = Router();

router.delete('/:id',
  authJWT,
  chatController.deleteConversation
);

export default router;

// 2. Créer controller (controllers/chat.controller.js)
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    // Vérifier ownership
    if (conversation.patientId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await conversation.deleteOne();
    res.json({ message: 'Conversation supprimée' });

  } catch (error) {
    logger.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 3. Mettre à jour Model si nécessaire (models/Conversation.js)
// Pas de changement nécessaire ici

// 4. Tester avec curl/Postman
curl -X DELETE http://localhost:5000/api/chat/507f... \
  -H "Authorization: Bearer <token>"
```

### Frontend: Architecture Composants

```
┌─────────────┐
│   Screen    │  app/(patient)/chat.tsx
└──────┬──────┘
       │
       ├──────► Hook personnalisé (useChat)
       │
       ├──────► Contexte global (AuthContext)
       │
       ▼
┌─────────────┐
│ Components  │  ChatBubble, ChatInput
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │  chat.service.ts (API calls)
└─────────────┘
```

#### Exemple: Créer un Nouveau Composant

```typescript
// 1. Créer composant (components/ui/Avatar.tsx)
import { View, Image, Text } from 'react-native';
import React from 'react';

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  size = 'md',
  imageUrl
}) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };

  return (
    <View className={`${sizeStyles[size]} rounded-full bg-blue-500 items-center justify-center`}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className="w-full h-full rounded-full" />
      ) : (
        <Text className="text-white font-semibold">{initials}</Text>
      )}
    </View>
  );
};

// 2. Utiliser dans un Screen
import { Avatar } from '@/components/ui/Avatar';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View>
      <Avatar
        firstName={user.firstName}
        lastName={user.lastName}
        size="lg"
      />
    </View>
  );
}
```

---

## 🌿 Workflow Git

### Branches

```
main          Production (déployé automatiquement)
  │
  ├─ develop     Développement (features fusionnées ici)
  │   │
  │   ├─ feature/chat-voice      Nouvelle fonctionnalité
  │   ├─ feature/dark-mode
  │   ├─ bugfix/login-crash      Correction bug
  │   └─ refactor/auth-service   Refactoring
```

### Workflow Standard

```bash
# 1. Créer branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/notifications-push

# 2. Développer
git add src/services/notification.service.js
git commit -m "feat(notifications): add push notification service"

git add app/contexts/NotificationContext.tsx
git commit -m "feat(notifications): add notification context"

# 3. Pousser régulièrement
git push origin feature/notifications-push

# 4. Créer Pull Request (GitHub)
# Via interface GitHub: Compare & pull request

# 5. Review + Merge dans develop
# Après approbation, merge PR

# 6. Supprimer branche locale
git checkout develop
git pull origin develop
git branch -d feature/notifications-push
```

### Convention Commits

Format: `type(scope): message`

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction bug
- `refactor`: Refactoring (pas de nouvelle feature)
- `docs`: Documentation
- `style`: Formatage (pas de code)
- `test`: Ajout tests
- `chore`: Maintenance (deps, config)

**Exemples:**

```bash
git commit -m "feat(chat): add typing indicator"
git commit -m "fix(auth): resolve token expiration bug"
git commit -m "refactor(api): extract gravity score to service"
git commit -m "docs(readme): update installation steps"
git commit -m "test(chat): add send message unit tests"
git commit -m "chore(deps): update mongoose to 8.1.0"
```

### Pull Request Template

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Nouvelle fonctionnalité
- [ ] Correction bug
- [ ] Refactoring
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés
- [ ] Tests manuels effectués
- [ ] Tous les tests passent

## Checklist
- [ ] Code formaté (Prettier)
- [ ] Pas de console.log oubliés
- [ ] Documentation mise à jour
- [ ] Testé sur iOS/Android (frontend)
- [ ] Variables sensibles dans .env (pas en dur)

## Screenshots (si UI)
[Insérer captures d'écran]
```

---

## 🧪 Tests

### Tests Backend (À implémenter)

```bash
# Installer Jest
npm install --save-dev jest supertest @types/jest

# package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

**Exemple Test:**

```javascript
// __tests__/auth.test.js
import request from 'supertest';
import app from '../src/server.js';
import { User } from '../src/models/User.js';

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Setup DB test
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should reject invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrong'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Email ou mot de passe incorrect');
  });
});
```

### Tests Frontend (À implémenter)

```bash
# Installer React Native Testing Library
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

**Exemple Test:**

```typescript
// __tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} />
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} disabled />
    );

    const button = getByText('Click Me').parent;
    expect(button).toBeDisabled();
  });
});
```

---

## 🐛 Debugging

### Backend Debugging

#### Logs Winston

```javascript
import logger from './utils/logger.js';

// Niveaux: error, warn, info, debug
logger.error('Auth failed:', { userId, error });
logger.warn('High gravity score detected:', { conversationId, score: 3 });
logger.info('User logged in:', { userId, role });
logger.debug('Request payload:', { body: req.body });
```

#### Node.js Inspector (VS Code)

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server/src/server.js",
      "envFile": "${workspaceFolder}/server/.env"
    }
  ]
}
```

Appuyez sur **F5** dans VS Code pour démarrer en mode debug.

### Frontend Debugging

#### React DevTools

```bash
# Installer extension navigateur
# https://chrome.google.com/webstore/detail/react-developer-tools

# Dans Expo
# Appuyez sur 'd' → Open React DevTools
```

#### Expo DevTools

```bash
# Dans le terminal Expo
# Appuyez sur 'm' → Ouvrir menu développeur
# Appuyez sur 'j' → Ouvrir debugger Chrome
```

#### Console.log Avancé

```typescript
// ✅ BON: Logs structurés
console.log('API Response:', {
  endpoint: '/chat/send',
  status: response.status,
  data: response.data
});

// ❌ ÉVITER: Logs non structurés
console.log(response);

// ✅ BON: Groupes de logs
console.group('Chat Send');
console.log('Request:', payload);
console.log('Response:', data);
console.groupEnd();
```

---

## 🤝 Contribution

### Process de Contribution

1. **Fork** le projet sur GitHub
2. **Clone** votre fork localement
3. **Créer** une branche feature/bugfix
4. **Développer** + **Commiter** (convention commits)
5. **Pousser** sur votre fork
6. **Créer Pull Request** vers `develop`
7. **Répondre** aux reviews
8. **Merge** après approbation

### Code Review Checklist

**Reviewer vérifie:**
- [ ] Code suit les standards du projet
- [ ] Pas de secrets/clés API en dur
- [ ] Pas de console.log oubliés
- [ ] Gestion d'erreurs correcte
- [ ] Tests ajoutés (si applicable)
- [ ] Documentation mise à jour
- [ ] Pas de régression (tout fonctionne)

### Communauté

- **Issues:** Rapporter bugs, proposer features
- **Discussions:** Questions, idées
- **Wiki:** Documentation collaborative
- **Discord/Slack:** Chat en temps réel (si configuré)

---

## 📚 Ressources

### Documentation Officielle

- [Node.js](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [Mongoose](https://mongoosejs.com/docs/)
- [React Native](https://reactnative.dev/docs/)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Outils Recommandés

| Outil | Usage |
|-------|-------|
| **VS Code** | Éditeur de code |
| **Postman** | Tester API |
| **MongoDB Compass** | GUI MongoDB |
| **React Native Debugger** | Debug React Native |
| **Flipper** | Debug mobile avancé |

---

**Dernière mise à jour**: Février 2026
**Version**: 1.0.0
**Statut**: ✅ Guide complet
