# Projet J - Frontend (Expo React Native)

Application mobile pour l'application de santé mentale hybride (IA + Psychologue).

## 📋 Stack Technique

- **Framework:** Expo (SDK 51)
- **Navigation:** Expo Router
- **Langage:** TypeScript
- **Styling:** NativeWind (Tailwind CSS pour React Native)
- **État global:** React Context API
- **HTTP Client:** Axios
- **Notifications:** Expo Notifications
- **Stockage:** AsyncStorage

## 🚀 Installation

### Prérequis

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (iOS/Android) pour tester sur device physique
- OU iOS Simulator / Android Emulator

### Étapes

1. **Installer les dépendances**

```bash
cd app
npm install
```

2. **Configurer les variables d'environnement**

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Modifier l'URL de l'API selon votre environnement :

```env
# Local (iOS Simulator)
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# Android Emulator
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# Device physique (remplacer par l'IP de votre machine)
# EXPO_PUBLIC_API_URL=http://192.168.1.X:5000/api
```

3. **Démarrer l'application**

```bash
npm start
```

Ensuite :
- Appuyez sur `i` pour iOS Simulator
- Appuyez sur `a` pour Android Emulator
- Scannez le QR code avec Expo Go sur un device physique

## 📁 Structure du Projet

```
app/
├── app/                         # Expo Router screens
│   ├── (auth)/                  # Groupe auth
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (patient)/               # Groupe patient
│   │   ├── chat.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   ├── (pro)/                   # Groupe pro
│   │   ├── dashboard.tsx
│   │   ├── invite.tsx
│   │   └── patient/[id].tsx
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Redirection initiale
│
├── components/
│   ├── ui/                      # Composants UI génériques
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── chat/                    # Composants chat
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── TypingIndicator.tsx
│   └── dashboard/               # Composants dashboard pro
│       ├── PatientCard.tsx
│       ├── ReportCard.tsx
│       ├── GravityBadge.tsx
│       └── LiveIndicator.tsx
│
├── contexts/
│   ├── AuthContext.tsx          # Gestion authentification
│   └── NotificationContext.tsx  # Push notifications
│
├── services/
│   ├── api.ts                   # Client Axios
│   ├── auth.service.ts
│   ├── chat.service.ts
│   ├── dashboard.service.ts
│   └── storage.service.ts       # AsyncStorage
│
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   └── usePolling.ts
│
├── types/
│   ├── user.types.ts
│   ├── conversation.types.ts
│   └── report.types.ts
│
├── utils/
│   ├── constants.ts
│   ├── formatters.ts
│   └── validators.ts
│
├── global.css                   # NativeWind global styles
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Design System

### Couleurs (Tailwind/NativeWind)

```typescript
// Gravity Scores
gravity-stable: #10B981 (Vert)
gravity-vigilance: #F59E0B (Orange)
gravity-critical: #EF4444 (Rouge)

// App Colors
primary-600: #2563EB (Bleu principal)
secondary-600: #4B5563 (Gris)
```

### Composants Réutilisables

- **Button** : Variants (primary, secondary, danger, outline), sizes (sm, md, lg), loading state
- **Input** : Label, error, password toggle, character counter
- **Card** : Variants (default, outlined, elevated), pressable
- **Badge** : Color variants, sizes
- **GravityBadge** : Score 1-3 avec couleurs, animation pour score 3

## 🔐 Authentification

### Flux Patient

1. Patient reçoit lien d'invitation du pro : `https://app.com/signup?token=XXX`
2. Token validé via `GET /auth/validate-token/:token`
3. Formulaire d'inscription (email, password, firstName, lastName)
4. JWT stocké dans AsyncStorage
5. Redirection automatique vers `/( patient)/chat`

### Flux Pro

1. Login classique email/password
2. Accès dashboard avec liste patients
3. Génération liens d'invitation depuis `/invite`

## 💬 Chat Patient

**Fonctionnalités :**
- Démarrage automatique conversation au montage
- Messages style iMessage (user à gauche, AI à droite)
- Indicateur "en train d'écrire..." pendant génération AI
- Affichage gravity scores (dots colorés)
- Badge "Votre thérapeute consulte" si `isBeingViewedByPro = true`
- Bouton "Terminer la conversation" → Génère SessionReport

**Hooks utilisés :**
- `useChat()` : Gestion état conversation, envoi messages, fin conversation

## 📊 Dashboard Pro

**Fonctionnalités :**
- Liste patients triée par `highestGravityScore` desc
- PatientCard avec badges :
  - Gravity score animé
  - "En conversation" (vert)
  - "X alertes non lues" (rouge)
- Pull-to-refresh
- Navigation vers détail patient

**TODO (à implémenter) :**
- Onglets patient detail (Conversations, Rapports, Live)
- Polling temps réel pour conversation live
- Filtres rapports (read/unread)

## 🔔 Notifications Push

**Setup Expo Notifications :**

1. Permissions demandées au démarrage
2. Token Expo Push stocké dans `NotificationContext`
3. Alertes critiques (gravity = 3) envoyées par le backend

**Format notification :**

```json
{
  "title": "🚨 Alerte Détresse",
  "body": "Patient X - Intervention potentiellement nécessaire",
  "data": {
    "conversationId": "...",
    "patientId": "..."
  }
}
```

## 🌐 API Integration

**Base URL configurée dans `.env` :**

```typescript
// services/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
```

**Intercepteurs Axios :**
- **Request** : Ajoute JWT automatiquement (`Authorization: Bearer <token>`)
- **Response** : Gère erreurs 401 (supprime token + redirige login)

## 🧪 Testing (Future)

- **Unit Tests** : Jest + React Native Testing Library
- **E2E Tests** : Detox
- **Type Safety** : TypeScript strict mode

## 📱 Build & Deploy

### Development Build

```bash
npx expo install expo-dev-client
npx expo run:android
npx expo run:ios
```

### Production Build (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

## 🐛 Debugging

```bash
# Logger les requêtes API
# Ajouter dans services/api.ts
api.interceptors.request.use(config => {
  console.log('API Request:', config.method, config.url);
  return config;
});

# React Native Debugger
# https://github.com/jhen0409/react-native-debugger

# Expo Dev Tools
# Appuyez sur 'm' dans le terminal Expo
```

## 🚀 Roadmap Post-MVP

- [ ] WebSockets (Socket.io) pour temps réel au lieu de polling
- [ ] Indicateur "en train d'écrire..." bidirectionnel
- [ ] Tests E2E complets
- [ ] Mode hors ligne avec cache
- [ ] Internationalisation (i18n)
- [ ] Accessibilité (A11y)
- [ ] Analytics (Amplitude, Mixpanel)

## 📚 Ressources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://expo.github.io/router/docs/)
- [NativeWind](https://www.nativewind.dev/)
- [React Native](https://reactnative.dev/)

---

**Version:** 1.0.0 (MVP)  
**Dernière mise à jour:** Janvier 2026
