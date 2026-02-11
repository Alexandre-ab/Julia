# 🔌 Documentation API - Projet J

Documentation complète de l'API REST du backend.

---

## 📋 Table des Matières

- [Informations Générales](#-informations-générales)
- [Authentification](#-authentification)
- [Endpoints Chat](#-endpoints-chat)
- [Endpoints Dashboard](#-endpoints-dashboard)
- [Codes d'Erreur](#-codes-derreur)
- [Exemples](#-exemples)

---

## 🌐 Informations Générales

### Base URL

```
Production: https://votre-domaine.com/api
Development: http://localhost:5000/api
```

### Format des Requêtes/Réponses

- **Content-Type**: `application/json`
- **Encoding**: UTF-8
- **Date Format**: ISO 8601 (`2026-01-26T12:00:00.000Z`)

### Headers Requis

```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  // Pour routes protégées
```

### Rate Limits

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| **Global** | 100 requêtes | 15 minutes |
| `/auth/login` | 5 requêtes | 15 minutes |
| `/auth/register` | 3 requêtes | 1 heure |
| `/chat/send` | 30 requêtes | 1 minute |

---

## 🔐 Authentification

### POST `/auth/register`

Inscription d'un nouveau patient (nécessite un token d'invitation).

#### Requête

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "Password123!",
  "firstName": "Jean",
  "lastName": "Dupont",
  "inviteToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Réponse (201 Created)

```json
{
  "message": "Inscription réussie",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "patient@example.com",
    "role": "patient",
    "firstName": "Jean",
    "lastName": "Dupont",
    "linkedProId": "507f1f77bcf86cd799439012"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Erreurs Possibles

| Code | Message | Description |
|------|---------|-------------|
| 400 | Token d'invitation invalide | Token expiré, déjà utilisé, ou inexistant |
| 400 | Email déjà utilisé | Un compte existe avec cet email |
| 422 | Validation échouée | Données invalides (voir `errors` array) |

---

### POST `/auth/login`

Connexion patient ou professionnel.

#### Requête

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "dr.martin@example.com",
  "password": "Password123"
}
```

#### Réponse (200 OK)

```json
{
  "message": "Connexion réussie",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "dr.martin@example.com",
    "role": "pro",
    "firstName": "Dr. Martin",
    "lastName": "Dubois"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Erreurs Possibles

| Code | Message | Description |
|------|---------|-------------|
| 401 | Email ou mot de passe incorrect | Credentials invalides |
| 422 | Validation échouée | Email ou password manquant |
| 429 | Trop de tentatives | Rate limit atteint (5/15min) |

---

### GET `/auth/me`

Récupère le profil de l'utilisateur connecté.

#### Requête

```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

#### Réponse (200 OK)

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "patient@example.com",
    "role": "patient",
    "firstName": "Jean",
    "lastName": "Dupont",
    "linkedProId": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Dr. Martin",
      "lastName": "Dubois",
      "email": "dr.martin@example.com"
    },
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

**🔒 Authentification requise** : Oui

---

### POST `/auth/generate-invite`

Génère un lien d'invitation pour un nouveau patient (réservé aux professionnels).

#### Requête

```http
POST /api/auth/generate-invite
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "email": "nouveau-patient@example.com"  // Optionnel
}
```

#### Réponse (201 Created)

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "inviteLink": "https://votre-app.com/signup?token=550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-02-04T10:00:00.000Z"
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

### GET `/auth/validate-token/:token`

Valide un token d'invitation avant inscription.

#### Requête

```http
GET /api/auth/validate-token/550e8400-e29b-41d4-a716-446655440000
```

#### Réponse (200 OK)

```json
{
  "valid": true,
  "email": "nouveau-patient@example.com",  // Si pré-rempli
  "proInfo": {
    "firstName": "Dr. Martin",
    "lastName": "Dubois"
  }
}
```

#### Erreurs Possibles

| Code | Message | Description |
|------|---------|-------------|
| 400 | Token invalide ou expiré | Token inexistant, expiré ou déjà utilisé |

---

## 💬 Endpoints Chat

### POST `/chat/start`

Démarre une nouvelle conversation.

#### Requête

```http
POST /api/chat/start
Authorization: Bearer <JWT_TOKEN>
```

Pas de body requis.

#### Réponse (201 Created)

```json
{
  "conversationId": "507f1f77bcf86cd799439020",
  "message": "Conversation démarrée",
  "conversation": {
    "_id": "507f1f77bcf86cd799439020",
    "patientId": "507f1f77bcf86cd799439011",
    "messages": [],
    "status": "active",
    "startedAt": "2026-02-11T14:30:00.000Z",
    "highestGravityScore": 1
  }
}
```

**🔒 Authentification requise** : Oui (rôle `patient` uniquement)

---

### POST `/chat/send`

Envoie un message et reçoit une réponse IA.

#### Requête

```http
POST /api/chat/send
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "conversationId": "507f1f77bcf86cd799439020",
  "text": "Je me sens très anxieux aujourd'hui"
}
```

#### Réponse (200 OK)

```json
{
  "userMessage": {
    "sender": "user",
    "text": "Je me sens très anxieux aujourd'hui",
    "timestamp": "2026-02-11T14:32:00.000Z",
    "gravityScore": 2
  },
  "aiMessage": {
    "sender": "ai",
    "text": "Je comprends que vous vous sentiez anxieux. C'est une émotion difficile à vivre. Voulez-vous me parler de ce qui vous préoccupe en ce moment ?",
    "timestamp": "2026-02-11T14:32:03.000Z"
  },
  "isBeingViewedByPro": false
}
```

#### Réponse avec Alerte Critique (Gravity = 3)

```json
{
  "userMessage": {
    "sender": "user",
    "text": "Je veux en finir",
    "timestamp": "2026-02-11T14:35:00.000Z",
    "gravityScore": 3
  },
  "aiMessage": {
    "sender": "ai",
    "text": "Je comprends votre souffrance...",
    "timestamp": "2026-02-11T14:35:02.000Z"
  },
  "urgencyMessage": {
    "sender": "ai",
    "text": "⚠️ Si vous êtes en détresse, contactez immédiatement:\n📞 3114 (Numéro national de prévention du suicide)\n📞 112 (Urgences)\n\nVotre psychologue a été alerté.",
    "timestamp": "2026-02-11T14:35:03.000Z"
  },
  "isBeingViewedByPro": true,
  "reportGenerated": true
}
```

**🔒 Authentification requise** : Oui (rôle `patient` uniquement)

**⚠️ Comportement spécial (Gravity = 3)** :
- Création automatique SessionReport
- Notification push au thérapeute
- Message d'urgence inséré
- Flag `isBeingViewedByPro` activé

---

### POST `/chat/end/:conversationId`

Termine une conversation et génère un rapport.

#### Requête

```http
POST /api/chat/end/507f1f77bcf86cd799439020
Authorization: Bearer <JWT_TOKEN>
```

#### Réponse (200 OK)

```json
{
  "message": "Conversation terminée",
  "report": {
    "_id": "507f1f77bcf86cd799439030",
    "summary": "Le patient a exprimé des sentiments d'anxiété modérée liés au travail...",
    "overallGravityScore": 2,
    "keyTopics": ["anxiété", "travail", "stress", "sommeil"],
    "createdAt": "2026-02-11T15:00:00.000Z"
  }
}
```

**🔒 Authentification requise** : Oui (rôle `patient` uniquement)

---

### GET `/chat/history`

Récupère l'historique des conversations du patient.

#### Requête

```http
GET /api/chat/history?page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

#### Query Parameters

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | number | 1 | Numéro de page |
| `limit` | number | 20 | Conversations par page |

#### Réponse (200 OK)

```json
{
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "startedAt": "2026-02-11T14:30:00.000Z",
      "endedAt": "2026-02-11T15:00:00.000Z",
      "status": "ended",
      "messageCount": 12,
      "highestGravityScore": 2
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "startedAt": "2026-02-10T10:00:00.000Z",
      "endedAt": "2026-02-10T10:45:00.000Z",
      "status": "ended",
      "messageCount": 8,
      "highestGravityScore": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalConversations": 54,
    "hasNextPage": true
  }
}
```

**🔒 Authentification requise** : Oui (rôle `patient` uniquement)

---

### GET `/chat/conversation/:id`

Récupère le détail d'une conversation (messages complets).

#### Requête

```http
GET /api/chat/conversation/507f1f77bcf86cd799439020
Authorization: Bearer <JWT_TOKEN>
```

#### Réponse (200 OK)

```json
{
  "conversation": {
    "_id": "507f1f77bcf86cd799439020",
    "patientId": "507f1f77bcf86cd799439011",
    "messages": [
      {
        "sender": "ai",
        "text": "Bonjour ! Comment vous sentez-vous aujourd'hui ?",
        "timestamp": "2026-02-11T14:30:00.000Z"
      },
      {
        "sender": "user",
        "text": "Je me sens très anxieux",
        "timestamp": "2026-02-11T14:32:00.000Z",
        "gravityScore": 2
      },
      {
        "sender": "ai",
        "text": "Je comprends votre anxiété...",
        "timestamp": "2026-02-11T14:32:03.000Z"
      }
    ],
    "status": "ended",
    "startedAt": "2026-02-11T14:30:00.000Z",
    "endedAt": "2026-02-11T15:00:00.000Z",
    "highestGravityScore": 2
  }
}
```

**🔒 Authentification requise** : Oui (patient propriétaire ou pro lié)

---

### GET `/chat/conversation/:id/messages`

Polling pour récupérer les nouveaux messages (pour le pro qui observe).

#### Requête

```http
GET /api/chat/conversation/507f1f77bcf86cd799439020/messages?since=2026-02-11T14:30:00.000Z
Authorization: Bearer <JWT_TOKEN>
```

#### Query Parameters

| Paramètre | Type | Description |
|-----------|------|-------------|
| `since` | ISO Date | Récupère messages après cette date |

#### Réponse (200 OK)

```json
{
  "newMessages": [
    {
      "sender": "user",
      "text": "Je me sens mieux maintenant",
      "timestamp": "2026-02-11T14:40:00.000Z",
      "gravityScore": 1
    }
  ],
  "hasNewMessages": true
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

### PATCH `/chat/conversation/:id/view`

Marque une conversation comme "vue par le pro".

#### Requête

```http
PATCH /api/chat/conversation/507f1f77bcf86cd799439020/view
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "isViewing": true
}
```

#### Réponse (200 OK)

```json
{
  "message": "Statut de visualisation mis à jour",
  "isBeingViewedByPro": true
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

## 📊 Endpoints Dashboard

### GET `/dashboard/patients`

Liste tous les patients du professionnel avec statistiques.

#### Requête

```http
GET /api/dashboard/patients
Authorization: Bearer <JWT_TOKEN>
```

#### Réponse (200 OK)

```json
{
  "patients": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "patient@example.com",
      "stats": {
        "totalConversations": 24,
        "activeConversation": {
          "_id": "507f1f77bcf86cd799439020",
          "startedAt": "2026-02-11T14:30:00.000Z",
          "messageCount": 5
        },
        "highestGravityScore": 2,
        "unreadReports": 3,
        "lastActivity": "2026-02-11T14:35:00.000Z"
      }
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "Marie",
      "lastName": "Martin",
      "email": "marie@example.com",
      "stats": {
        "totalConversations": 18,
        "activeConversation": null,
        "highestGravityScore": 1,
        "unreadReports": 0,
        "lastActivity": "2026-02-10T16:00:00.000Z"
      }
    }
  ],
  "summary": {
    "totalPatients": 2,
    "activeConversations": 1,
    "criticalAlerts": 0
  }
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

### GET `/dashboard/patient/:id/conversations`

Historique des conversations d'un patient spécifique.

#### Requête

```http
GET /api/dashboard/patient/507f1f77bcf86cd799439011/conversations
Authorization: Bearer <JWT_TOKEN>
```

#### Réponse (200 OK)

```json
{
  "patient": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "startedAt": "2026-02-11T14:30:00.000Z",
      "endedAt": "2026-02-11T15:00:00.000Z",
      "status": "ended",
      "messageCount": 12,
      "highestGravityScore": 2,
      "reportGenerated": true
    }
  ]
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

### GET `/dashboard/patient/:id/live`

Conversation active d'un patient en temps réel.

#### Requête

```http
GET /api/dashboard/patient/507f1f77bcf86cd799439011/live
Authorization: Bearer <JWT_TOKEN>
```

#### Réponse (200 OK)

```json
{
  "patient": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  "activeConversation": {
    "_id": "507f1f77bcf86cd799439020",
    "messages": [...],
    "status": "active",
    "startedAt": "2026-02-11T14:30:00.000Z",
    "highestGravityScore": 2
  }
}
```

#### Réponse (pas de conversation active)

```json
{
  "patient": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  "activeConversation": null
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

### GET `/dashboard/reports`

Liste des rapports de session avec filtres.

#### Requête

```http
GET /api/dashboard/reports?status=unread&gravityScore=3&page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

#### Query Parameters

| Paramètre | Type | Valeurs | Description |
|-----------|------|---------|-------------|
| `status` | string | `unread`, `read`, `all` | Filtrer par statut |
| `gravityScore` | number | `1`, `2`, `3` | Filtrer par score |
| `page` | number | - | Numéro de page |
| `limit` | number | - | Rapports par page |

#### Réponse (200 OK)

```json
{
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "conversationId": "507f1f77bcf86cd799439020",
      "patient": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Jean",
        "lastName": "Dupont"
      },
      "summary": "Le patient a exprimé des pensées suicidaires...",
      "overallGravityScore": 3,
      "keyTopics": ["suicide", "dépression", "isolement"],
      "triggerReason": "gravity_3",
      "status": "unread",
      "createdAt": "2026-02-11T15:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalReports": 28,
    "hasNextPage": true
  }
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

### PATCH `/dashboard/report/:id/read`

Marque un rapport comme lu.

#### Requête

```http
PATCH /api/dashboard/report/507f1f77bcf86cd799439030/read
Authorization: Bearer <JWT_TOKEN>
```

#### Réponse (200 OK)

```json
{
  "message": "Rapport marqué comme lu",
  "report": {
    "_id": "507f1f77bcf86cd799439030",
    "status": "read",
    "readAt": "2026-02-11T16:00:00.000Z"
  }
}
```

**🔒 Authentification requise** : Oui (rôle `pro` uniquement)

---

## ⚠️ Codes d'Erreur

### Codes HTTP

| Code | Signification | Utilisation |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Données invalides ou manquantes |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Accès refusé (mauvais rôle) |
| 404 | Not Found | Ressource non trouvée |
| 422 | Unprocessable Entity | Validation échouée |
| 429 | Too Many Requests | Rate limit dépassé |
| 500 | Internal Server Error | Erreur serveur |

### Format des Erreurs

```json
{
  "error": "Message d'erreur principal",
  "details": "Informations supplémentaires (optionnel)",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```

### Exemples d'Erreurs

#### 401 Unauthorized

```json
{
  "error": "Token manquant ou invalide",
  "details": "Veuillez vous reconnecter"
}
```

#### 403 Forbidden

```json
{
  "error": "Accès refusé",
  "details": "Cette action est réservée aux professionnels"
}
```

#### 422 Validation Error

```json
{
  "error": "Validation échouée",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    },
    {
      "field": "password",
      "message": "Le mot de passe doit contenir au moins 8 caractères"
    }
  ]
}
```

---

## 💡 Exemples Complets

### Exemple 1: Flux Inscription → Première Conversation

```bash
# 1. Valider le token d'invitation
curl -X GET http://localhost:5000/api/auth/validate-token/550e8400-e29b-41d4-a716-446655440000

# 2. S'inscrire
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "Password123",
    "firstName": "Jean",
    "lastName": "Dupont",
    "inviteToken": "550e8400-e29b-41d4-a716-446655440000"
  }'

# Réponse: { "token": "eyJhbGc..." }

# 3. Démarrer une conversation
curl -X POST http://localhost:5000/api/chat/start \
  -H "Authorization: Bearer eyJhbGc..."

# Réponse: { "conversationId": "507f..." }

# 4. Envoyer un message
curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "507f...",
    "text": "Bonjour, je me sens anxieux"
  }'
```

### Exemple 2: Pro Consulte Dashboard

```bash
# 1. Login pro
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.martin@example.com",
    "password": "Password123"
  }'

# 2. Récupérer liste patients
curl -X GET http://localhost:5000/api/dashboard/patients \
  -H "Authorization: Bearer <token_pro>"

# 3. Consulter conversation live d'un patient
curl -X GET http://localhost:5000/api/dashboard/patient/507f.../live \
  -H "Authorization: Bearer <token_pro>"

# 4. Marquer comme "en cours de visualisation"
curl -X PATCH http://localhost:5000/api/chat/conversation/507f.../view \
  -H "Authorization: Bearer <token_pro>" \
  -H "Content-Type: application/json" \
  -d '{ "isViewing": true }'

# 5. Récupérer rapports non lus
curl -X GET http://localhost:5000/api/dashboard/reports?status=unread \
  -H "Authorization: Bearer <token_pro>"
```

---

## 🔧 Testing avec Postman/Insomnia

### Collection Postman

Importez la collection complète: [Télécharger](./postman/projet-j-collection.json)

### Variables d'Environnement

```json
{
  "base_url": "http://localhost:5000/api",
  "patient_token": "",
  "pro_token": "",
  "conversation_id": ""
}
```

---

## 📚 Ressources Complémentaires

- [Architecture Backend](./ARCHITECTURE.md#-architecture-backend)
- [Sécurité](./SECURITE.md)
- [Guide de Développement](./DEVELOPPEMENT.md)

---

**Dernière mise à jour**: Février 2026
**Version API**: 1.0.0
**Statut**: ✅ Documentation complète
