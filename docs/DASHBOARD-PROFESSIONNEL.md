# 👨‍⚕️ Dashboard Professionnel - Guide Complet

## Vue d'ensemble

Le dashboard professionnel offre aux thérapeutes une interface moderne et complète pour gérer leurs patients et suivre les conversations en temps réel.

## 📊 Fonctionnalités principales

### 1. Dashboard Principal

#### Statistiques en temps réel
- **Total patients** : Nombre total de patients suivis
- **Conversations actives** : Patients actuellement en conversation
- **Vigilance** : Patients avec score de gravité 2
- **Critique** : Patients avec score de gravité 3 (alerte rouge)

#### Actions rapides
- **Inviter un patient** : Accès direct à la génération de lien
- Design moderne avec gradient et icônes

#### Liste des patients
- **Cards animées** : Animations d'apparition en cascade
- **Avatar avec initiales** : Identification visuelle rapide
- **Badges de statut** :
  - 🟢 En conversation (vert)
  - 🔔 Alertes non lues (rouge)
  - ⏰ Dernière activité (gris)
- **Layout responsive** : 2 colonnes sur PC, 1 sur mobile

### 2. Détail Patient

Lorsque le médecin clique sur un patient, il accède à une vue complète avec 2 onglets :

#### Onglet "Conversations"
- **Historique complet** : Toutes les conversations du patient
- **Informations par conversation** :
  - Date et heure
  - Nombre de messages
  - Score de gravité maximum
  - Badge visuel de gravité
- **Click pour voir** : Accès aux messages complets (à venir)

#### Onglet "Live"
- **Vue en temps réel** : Conversation active du patient
- **Indicateur live** : Point vert pulsant
- **Messages en direct** : Bulles de chat comme le patient les voit
- **Scores de gravité** : Visibles sur chaque message IA
- **Actualisation** : Bouton pour rafraîchir manuellement
- **Auto-polling** : Mise à jour automatique possible (à implémenter)

## 🎨 Design moderne

### Couleurs et Thème
- **Gradient header** : Indigo professionnel
- **Cards avec gradients** : Blanc → Gris très clair
- **Shadows colorées** : Indigo subtil au lieu de noir
- **Badges visuels** : Bordures et backgrounds cohérents

### Animations
- **Entrance animations** : Cards apparaissent en cascade
- **Press feedback** : Scale down + haptic
- **Transitions fluides** : Entre les onglets
- **Pulse animation** : Sur les scores critiques

### Responsive Design
- **PC (>768px)** :
  - Layout 2 colonnes pour les patients
  - Stats en ligne
  - Padding augmenté
  - Meilleure utilisation de l'espace

- **Mobile (<768px)** :
  - Layout 1 colonne
  - Stats scrollables horizontalement
  - Touch-friendly
  - Optimisé pour les petits écrans

## 🔧 API Endpoints utilisés

### Dashboard
```
GET /api/dashboard/patients
→ Liste des patients avec leurs stats
```

### Détail Patient
```
GET /api/dashboard/patient/:id/conversations
→ Historique des conversations

GET /api/dashboard/patient/:id/live
→ Conversation active en temps réel
```

### Invitation
```
POST /api/auth/generate-invite
→ Génère un lien d'invitation unique
```

## 📱 Navigation

```
Dashboard (/)
├── Liste des patients
│   └── Click sur patient → Détail Patient (/patient/:id)
│       ├── Tab: Conversations
│       └── Tab: Live
└── Bouton Inviter → Page Invitation (/invite)
```

## 🎯 Cas d'usage

### Scénario 1 : Suivi normal
1. Le thérapeute ouvre le dashboard
2. Voit la liste de tous ses patients
3. Voit les badges (conversation active, alertes)
4. Clique sur un patient
5. Consulte l'historique des conversations
6. Peut basculer sur le Live si conversation active

### Scénario 2 : Alerte critique
1. Un patient a un score de gravité 3
2. Le badge "Critique" apparaît sur le dashboard
3. Le card du patient pulse (animation)
4. Le thérapeute clique sur le patient
5. Voit immédiatement le score critique
6. Peut consulter la conversation en Live
7. Peut voir les messages problématiques

### Scénario 3 : Nouveau patient
1. Le thérapeute clique sur "Inviter un patient"
2. Génère un lien d'invitation
3. Copie ou partage le lien
4. Le patient s'inscrit via le lien
5. Apparaît automatiquement dans le dashboard

## 🚀 Fonctionnalités à venir

### Court terme
- ✅ Vue détaillée d'une conversation spécifique
- ✅ Auto-refresh du Live (polling toutes les 5-10s)
- ✅ Notifications push pour alertes critiques
- ✅ Filtres et recherche de patients

### Moyen terme
- ⏳ Export des conversations en PDF
- ⏳ Statistiques avancées (graphiques)
- ⏳ Notes privées sur les patients
- ⏳ Calendrier de rendez-vous

## 💡 Astuces d'utilisation

### Pour le thérapeute
- **Pull to refresh** : Tirez vers le bas pour actualiser
- **Badges colorés** : Identifiez rapidement les priorités
- **Tab Live** : Surveillez les conversations en cours
- **Scores de gravité** : 1 (vert) = stable, 2 (orange) = vigilance, 3 (rouge) = critique

### Optimisation PC
- Utilisez un grand écran pour voir 2 patients en parallèle
- Les statistiques sont toutes visibles d'un coup d'œil
- Navigation rapide avec les onglets

## 🔒 Sécurité

- Seuls les thérapeutes peuvent accéder au dashboard
- Chaque thérapeute voit uniquement ses propres patients
- Les conversations sont chiffrées
- Les liens d'invitation expirent après 7 jours

---

**Dernière mise à jour** : Janvier 2026
**Version** : 2.0.0
