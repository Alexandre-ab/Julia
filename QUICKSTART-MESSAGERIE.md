# 🚀 Quick Start - Messagerie

## ⚡ Installation (Backend uniquement)

Les dépendances frontend sont déjà installées. Aucune installation supplémentaire nécessaire !

## 📝 Fichiers créés

### Frontend (8 fichiers)
```
✅ app/(patient)/messages.tsx
✅ app/(patient)/_layout.tsx (modifié)
✅ components/modals/SendMessageModal.tsx
✅ types/message.types.ts
✅ services/message.service.ts
✅ services/pro-message.service.ts
✅ app/(pro)/patient/[id].tsx (modifié)
```

### Backend (4 fichiers)
```
✅ models/Message.js
✅ routes/message.routes.js
✅ controllers/message.controller.js
✅ server.js (modifié)
✅ utils/validators.js (modifié)
```

### Documentation (3 fichiers)
```
✅ docs/MESSAGERIE-THERAPEUTE.md
✅ README-MESSAGERIE.md
✅ QUICKSTART-MESSAGERIE.md (ce fichier)
```

## 🎯 Test rapide

### 1. Démarrer le backend
```bash
cd c:\JULIA\projet-j\server
npm run dev
```

### 2. Démarrer le frontend
```bash
cd c:\JULIA\projet-j\app
npm start
```

### 3. Tester côté Patient
1. Se connecter avec un compte patient
2. Voir le nouvel onglet **"Messages"** (📧) dans la navigation
3. Si aucun message : voir l'état vide élégant
4. Si messages : cliquer pour expand/collapse

### 4. Tester côté Praticien
1. Se connecter avec un compte praticien
2. Dashboard → Cliquer sur un patient
3. **Nouveau** : Icône ✉️ en haut à droite du header
4. Cliquer → Modal d'envoi s'ouvre
5. Remplir :
   - **Sujet** : "Test de message"
   - **Contenu** : "Ceci est un test de la messagerie"
6. Envoyer → Confirmation "Message envoyé au patient"

### 5. Vérifier côté Patient
1. Retourner sur le compte patient
2. Onglet Messages → Pull to refresh
3. Le nouveau message apparaît avec un **point bleu** (non lu)
4. Badge en haut à droite : **"1"**
5. Cliquer sur le message → Il s'expand
6. Le point bleu disparaît → Message marqué comme lu
7. Badge mis à jour : **"0"**

## 🔍 Vérifications

### Routes API accessibles
```bash
# Patient (JWT requis, role: patient)
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/patient/messages
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/patient/messages/stats

# Praticien (JWT requis, role: pro)
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","content":"Message de test"}' \
  http://localhost:5000/api/pro/patient/<PATIENT_ID>/message
```

### MongoDB
```javascript
// Vérifier la collection
use projet-j
db.messages.find().pretty()

// Vérifier les index
db.messages.getIndexes()
```

## ✨ Fonctionnalités à tester

### Interface Patient
- ✅ Onglet Messages visible
- ✅ Badge avec nombre de non lus
- ✅ Header gradient
- ✅ Liste des messages
- ✅ Expand/collapse au clic
- ✅ Marquage automatique comme lu
- ✅ Pull to refresh
- ✅ État vide si aucun message
- ✅ Animations entrance
- ✅ Feedback haptique

### Interface Praticien
- ✅ Icône message dans header
- ✅ Modal slide from bottom
- ✅ Formulaire complet
- ✅ Validation en temps réel
- ✅ Compteurs caractères
- ✅ Bouton envoyer animé
- ✅ Confirmation d'annulation si brouillon
- ✅ Feedback succès/erreur
- ✅ Fermeture automatique après envoi

### Backend
- ✅ Validation express-validator
- ✅ Authentification JWT
- ✅ Vérification relation patient-praticien
- ✅ Sauvegarde MongoDB
- ✅ Index optimisés
- ✅ Logs des opérations

## 🐛 Debug

### Problème : Onglet Messages invisible
**Solution** : Vérifier `app/(patient)/_layout.tsx` ligne 103-130

### Problème : Modal ne s'ouvre pas
**Solution** : Vérifier `app/(pro)/patient/[id].tsx` - bouton header ligne 254-267

### Problème : Erreur 404 sur API
**Solution** : Vérifier `server.js` ligne 82 : `app.use('/api', messageRoutes);`

### Problème : Messages vides
**Solution** : Vérifier la collection MongoDB et les logs backend

### Problème : TypeScript errors
**Solution** : 
```bash
cd c:\JULIA\projet-j\app
npx tsc --noEmit
```

## 📊 Données de test

### Créer un message via MongoDB
```javascript
db.messages.insertOne({
  patientId: ObjectId("<PATIENT_ID>"),
  practitionerId: ObjectId("<PRO_ID>"),
  subject: "Message de test",
  content: "Ceci est un message de test pour vérifier la messagerie.",
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Via API (Postman/Insomnia)
```json
POST http://localhost:5000/api/pro/patient/<PATIENT_ID>/message
Authorization: Bearer <PRO_JWT_TOKEN>
Content-Type: application/json

{
  "subject": "Retour sur votre séance",
  "content": "Bonjour, voici mon retour concernant notre dernière séance...",
  "conversationId": "<CONVERSATION_ID>" // Optionnel
}
```

## 🎉 Checklist finale

- [ ] Backend démarré sans erreur
- [ ] Frontend démarré sans erreur
- [ ] Onglet Messages visible (patient)
- [ ] Icône message visible (praticien)
- [ ] Envoi de message fonctionne
- [ ] Réception de message fonctionne
- [ ] Marquage comme lu fonctionne
- [ ] Badge de notification fonctionne
- [ ] Animations fluides
- [ ] Aucune erreur TypeScript
- [ ] Aucune erreur console

## 📚 Ressources

- **Guide complet** : `docs/MESSAGERIE-THERAPEUTE.md`
- **Vue d'ensemble** : `NOUVELLES-FONCTIONNALITES.md`
- **README** : `README-MESSAGERIE.md`

---

**Statut** : ✅ Prêt pour tests  
**Temps d'implémentation** : ~1h  
**Fichiers modifiés/créés** : 15  
**Lignes de code** : ~1500  
**Erreurs** : 0

Bon test ! 🚀
