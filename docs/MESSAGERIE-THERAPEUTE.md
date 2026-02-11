# 📧 Messagerie Thérapeute-Patient - Guide Complet

## Vue d'ensemble

Le système de messagerie permet aux thérapeutes d'envoyer des retours personnalisés à leurs patients concernant leurs séances passées. Les patients peuvent consulter ces messages dans un onglet dédié de leur application.

## 🎯 Fonctionnalités

### Pour le Patient

#### Onglet "Messages"
- **Accès direct** : Nouvel onglet dans la navigation principale (📧)
- **Badge de notification** : Affiche le nombre de messages non lus
- **Interface moderne** : Header avec gradient et compteur de messages non lus

#### Liste des messages
- **Cards animées** : Apparition en cascade
- **Indicateur non lu** : Point bleu pour les nouveaux messages
- **Gradient subtil** : Fond blanc → bleu clair pour les messages non lus
- **Aperçu** : Les 2 premières lignes du message
- **Expand/collapse** : Clic pour voir le message complet
- **Badge "Séance"** : Si le message est lié à une conversation spécifique
- **Horodatage** : Affichage intelligent (heure, "Hier", ou date)

#### Actions
- **Marquer comme lu** : Automatique lors de l'expansion du message
- **Pull to refresh** : Actualiser la liste
- **État vide** : Message explicatif si aucun message

### Pour le Praticien

#### Bouton d'envoi de message
- **Emplacement** : Header de la page détail patient (icône ✉️)
- **Modal moderne** : Interface d'envoi avec design soigné

#### Formulaire de message
- **Sujet** : Court titre (3-200 caractères)
- **Contenu** : Message détaillé (10-5000 caractères)
- **Lien conversation** : Optionnel, pour lier à une séance spécifique
- **Compteur de caractères** : Affichage en temps réel
- **Validation** : Vérification des champs avant envoi

#### Workflow
1. Cliquer sur l'icône message dans le header
2. Remplir le sujet et le contenu
3. Le message peut être lié à une conversation (optionnel)
4. Envoyer avec feedback haptique
5. Confirmation de succès

## 🎨 Design

### Couleurs et Style
- **Header gradient** : Indigo professionnel
- **Cards non lues** : Gradient blanc → bleu très clair (#F0F4FF)
- **Cards lues** : Gradient blanc → gris très clair
- **Point bleu** : Indicateur de message non lu
- **Badge séance** : Fond indigo clair avec icône

### Animations
- **Entrance** : Cards apparaissent avec fade + slide
- **Press** : Scale down + haptic feedback
- **Expand/collapse** : Chevron animé
- **Modal** : Slide from bottom

### États
- **Chargement** : Spinner centré
- **Vide** : Card avec icône et message explicatif
- **Messages** : Liste scrollable avec refresh

## 🔧 API Endpoints

### Patient
```
GET /api/patient/messages
→ Liste tous les messages du patient

GET /api/patient/messages/stats
→ Statistiques (total, non lus, dernier message)

PATCH /api/patient/messages/:id/read
→ Marque un message comme lu
```

### Praticien
```
POST /api/pro/patient/:patientId/message
Body: { subject, content, conversationId? }
→ Envoie un message à un patient
```

## 📊 Modèle de données

```typescript
interface PractitionerMessage {
    id: string;
    patientId: string;
    practitionerId: string;
    conversationId?: string; // Optionnel: lien vers une conversation
    subject: string; // 3-200 caractères
    content: string; // 10-5000 caractères
    isRead: boolean;
    createdAt: string;
    readAt?: string;
}
```

## 🎯 Cas d'usage

### Scénario 1 : Retour après séance
1. Le thérapeute consulte la conversation d'un patient
2. Clique sur l'icône message dans le header
3. Écrit un retour personnalisé :
   - Sujet : "Retour sur votre séance du 15/01"
   - Contenu : Points positifs, axes d'amélioration, encouragements
4. Le message est lié à la conversation de la séance
5. Le patient reçoit le message dans son onglet "Messages"
6. Notification non lue visible immédiatement

### Scénario 2 : Message général
1. Le thérapeute veut envoyer un message non lié à une séance
2. Exemple : conseils généraux, rappel de rendez-vous, ressources
3. Le message n'est pas lié à une conversation spécifique
4. Le patient le reçoit comme un message général

### Scénario 3 : Consultation patient
1. Le patient ouvre l'onglet "Messages"
2. Voit le badge avec 3 messages non lus
3. Parcourt la liste des messages
4. Clique sur un message pour le voir en entier
5. Le message est automatiquement marqué comme lu
6. Le badge se met à jour (2 messages non lus)

## 🔒 Sécurité

### Validation
- **Longueur minimale** : Sujet 3 car, contenu 10 car
- **Longueur maximale** : Sujet 200 car, contenu 5000 car
- **Trim automatique** : Suppression des espaces superflus
- **Validation backend** : Express-validator

### Authentification
- **Patient** : Peut uniquement voir ses propres messages
- **Praticien** : Peut uniquement envoyer à ses propres patients
- **JWT requis** : Toutes les routes protégées
- **Vérification relation** : Le backend vérifie que le patient est lié au praticien

## 💡 Bonnes pratiques

### Pour le thérapeute
- **Sujet clair** : Résume le contenu en quelques mots
- **Contenu structuré** : Paragraphes clairs, pas de pavé
- **Ton professionnel** : Bienveillant mais maintenir la distance thérapeutique
- **Lien conversation** : Utiliser quand c'est pertinent pour le contexte
- **Longueur adaptée** : Entre 50 et 500 mots idéalement

### Messages types
1. **Retour post-séance** : Résumé, axes de travail
2. **Encouragement** : Félicitations sur les progrès
3. **Ressources** : Articles, exercices à faire
4. **Rappel** : Prochaine séance, exercices à préparer
5. **Suivi** : Questions sur l'évolution entre deux séances

## 🚀 Améliorations futures

### Court terme
- ✅ Réponses du patient (bidirectionnel)
- ✅ Pièces jointes (PDF, images)
- ✅ Templates de messages
- ✅ Brouillons

### Moyen terme
- ⏳ Notifications push
- ⏳ Messages programmés (envoyer plus tard)
- ⏳ Catégories de messages
- ⏳ Recherche dans les messages
- ⏳ Export en PDF

## 📱 Navigation

```
Patient:
└── Messages (onglet)
    ├── Liste des messages
    │   └── Click → Expand/Collapse
    └── Pull to refresh

Praticien:
└── Dashboard
    └── Patient detail
        ├── Header → Icône message
        └── Modal → Formulaire d'envoi
```

## 🎨 Composants créés

### Frontend
- `app/(patient)/messages.tsx` - Écran messages patient
- `components/modals/SendMessageModal.tsx` - Modal d'envoi praticien
- `types/message.types.ts` - Types TypeScript
- `services/message.service.ts` - Service API patient
- `services/pro-message.service.ts` - Service API praticien

### Backend
- `models/Message.js` - Modèle MongoDB
- `routes/message.routes.js` - Routes API
- `controllers/message.controller.js` - Logique métier
- `utils/validators.js` - Validateurs (mis à jour)

---

**Dernière mise à jour** : Janvier 2026  
**Version** : 1.0.0  
**Statut** : ✅ Opérationnel
