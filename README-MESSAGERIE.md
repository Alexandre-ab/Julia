# 📧 Système de Messagerie - Guide Rapide

## 🎯 Qu'est-ce que c'est ?

Un système de messagerie permettant aux **thérapeutes** d'envoyer des **retours personnalisés** à leurs patients concernant leurs séances. Les patients peuvent consulter ces messages dans un **onglet dédié**.

---

## 📱 Vue Patient

### Accès
Nouvel onglet **"Messages"** (📧) dans la navigation principale

### Interface
```
┌─────────────────────────────────┐
│  📧 Messages              [ 3 ] │  ← Badge messages non lus
│  Retours de votre thérapeute    │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │ [👤] Retour séance     🔵│   │  ← Point bleu = non lu
│  │      du 15/01            │   │
│  │                          │   │
│  │  Points positifs...      │   │
│  │                          │   │
│  │  ⏰ 14:30   [Séance]    │   │
│  │          ⌄               │   │  ← Chevron pour expand
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [👤] Conseils généraux   │   │  ← Message lu (pas de point)
│  │                          │   │
│  │  Je vous recommande...   │   │
│  │                          │   │
│  │  ⏰ Hier                 │   │
│  │          ⌃               │   │  ← Expanded
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Actions
- **Clic** → Expand/collapse le message
- **Auto-marquage** → Lu lors de l'ouverture
- **Pull to refresh** → Actualiser la liste

---

## 💼 Vue Praticien

### Accès
Bouton **✉️** dans le header de la page détail patient

### Modal d'envoi
```
┌─────────────────────────────────┐
│  Nouveau message          [✕]   │
│  🔗 Lié à une conversation       │
├─────────────────────────────────┤
│                                 │
│  Sujet                          │
│  ┌─────────────────────────┐   │
│  │ Retour séance du 15/01  │   │
│  └─────────────────────────┘   │
│  15/200 caractères              │
│                                 │
│  Message                        │
│  ┌─────────────────────────┐   │
│  │ Bonjour,                │   │
│  │                         │   │
│  │ J'ai été ravi de...     │   │
│  │                         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│  87/5000 caractères             │
│                                 │
│  ℹ️ Le patient recevra ce       │
│     message dans son onglet     │
│     "Messages"                  │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Envoyer le message    │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Workflow
1. Page détail patient
2. Clic sur icône ✉️
3. Remplir sujet + contenu
4. (Optionnel) Lier à une conversation
5. Envoyer → Confirmation

---

## 🔧 Intégration Technique

### Routes API

**Patient** (authentifié, role: patient)
```
GET    /api/patient/messages              → Liste messages
GET    /api/patient/messages/stats        → Stats (total, non lus)
PATCH  /api/patient/messages/:id/read     → Marquer lu
```

**Praticien** (authentifié, role: pro)
```
POST   /api/pro/patient/:id/message       → Envoyer message
Body: {
  subject: string,      // 3-200 caractères
  content: string,      // 10-5000 caractères
  conversationId?: string
}
```

### Modèle MongoDB
```javascript
{
  patientId: ObjectId,           // Ref User
  practitionerId: ObjectId,      // Ref User
  conversationId?: ObjectId,     // Ref Conversation (optionnel)
  subject: String,               // 3-200 car
  content: String,               // 10-5000 car
  isRead: Boolean,               // default: false
  readAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Composants Frontend
```
app/
├── (patient)/
│   └── messages.tsx                    ← Écran messages patient
└── (pro)/
    └── patient/
        └── [id].tsx                    ← Intégration bouton + modal

components/
└── modals/
    └── SendMessageModal.tsx            ← Modal praticien

services/
├── message.service.ts                  ← API patient
└── pro-message.service.ts              ← API praticien

types/
└── message.types.ts                    ← Types TypeScript
```

---

## ✨ Fonctionnalités Clés

### Design
- ✅ Cards avec gradient (blanc → bleu pour non lus)
- ✅ Animations entrance, press, expand
- ✅ Header gradient avec badge compteur
- ✅ État vide élégant
- ✅ Modal moderne keyboard-aware

### UX
- ✅ Marquage auto comme lu
- ✅ Feedback haptique
- ✅ Pull to refresh
- ✅ Compteurs caractères
- ✅ Validation inline

### Sécurité
- ✅ JWT requis
- ✅ Validation express-validator
- ✅ Vérification relation patient-praticien
- ✅ Limites strictes (longueurs)
- ✅ Trim automatique

---

## 📈 Cas d'usage

### 1. Retour post-séance
```
Sujet: "Retour sur votre séance du 15/01"
Contenu: "Bonjour,

Je tenais à vous féliciter pour les progrès que vous avez réalisés...

À très bientôt,"
```
→ Lié à la conversation de la séance

### 2. Conseils généraux
```
Sujet: "Exercices de respiration"
Contenu: "Voici quelques exercices que je vous recommande..."
```
→ Non lié à une conversation

### 3. Rappel
```
Sujet: "Prochaine séance - 22/01"
Contenu: "Notre prochaine séance aura lieu le 22/01..."
```
→ Non lié à une conversation

---

## 🚀 Pour tester

### Côté Patient
1. Se connecter avec un compte patient
2. Aller dans l'onglet "Messages" (📧)
3. Voir les messages du thérapeute
4. Cliquer pour expand/collapse
5. Messages marqués automatiquement comme lus

### Côté Praticien
1. Se connecter avec un compte praticien
2. Aller dans Dashboard → Cliquer sur un patient
3. Cliquer sur l'icône ✉️ en haut à droite
4. Remplir le formulaire
5. Envoyer
6. Confirmation de succès

---

## 📚 Documentation complète

Pour plus de détails, consulter :
- `docs/MESSAGERIE-THERAPEUTE.md` - Guide complet
- `NOUVELLES-FONCTIONNALITES.md` - Vue d'ensemble

---

**Version** : 1.0.0  
**Statut** : ✅ Opérationnel  
**Date** : Janvier 2026
