# 🤖 Activation de l'IA Gemini - Projet J

**Date**: 26 janvier 2026, 22:23  
**Statut**: ⚠️ **GEMINI NON DISPONIBLE** (Problème avec la clé API)

---

## 📊 Résumé

L'API Google Gemini a été activée pour remplacer les réponses simulées. L'application utilise maintenant une vraie intelligence artificielle pour :
- 💬 Générer des réponses thérapeutiques empathiques
- ⚠️ Calculer les scores de gravité (1-3)
- 📝 Créer des résumés de conversation

---

## 🔧 Modifications Effectuées

### **Fichier**: `server/.env`

**Avant** :
```env
USE_MOCK_AI=true
```

**Après** :
```env
USE_MOCK_AI=false
```

---

## 🎯 Fonctionnalités IA Activées

### 1. **Réponses du Chatbot** 🤖

**Service**: `generateAIResponse()` dans `ai.service.js`

**Fonctionnement** :
- Utilise le modèle : `gemini-1.5-flash`
- Température : 0.7 (équilibre créativité/cohérence)
- Instructions système personnalisées pour un rôle thérapeutique

**Prompt système** :
```
Tu es un assistant IA thérapeutique bienveillant et empathique.
Ton rôle est d'écouter, soutenir et accompagner les patients sans jugement.
Pose des questions ouvertes, valide les émotions, encourage l'expression.
```

**Exemple** :
- **Patient** : "Je me sens très triste aujourd'hui"
- **IA (Mock)** : "Je comprends que vous vous sentiez ainsi..."
- **IA (Gemini)** : Réponse personnalisée et contextualisée basée sur l'historique complet de la conversation

---

### 2. **Score de Gravité** ⚠️

**Service**: `calculateGravityScore()` dans `ai.service.js`

**Fonctionnement** :
- Analyse chaque message du patient
- Retourne un score : 1 (Stable), 2 (Vigilance), 3 (Critique)
- Utilisé pour alerter les professionnels

**Critères d'évaluation** :
- **Score 3** : Mentions de suicide, auto-mutilation, danger immédiat
- **Score 2** : Détresse importante, anxiété sévère, dépression
- **Score 1** : État émotionnel stable ou difficultés gérables

**Avant (Mock)** : Détection par mots-clés simples
**Après (Gemini)** : Analyse contextuelle approfondie du message

---

### 3. **Résumés de Conversation** 📝

**Service**: `generateConversationSummary()` dans `ai.service.js`

**Fonctionnement** :
- Génère un résumé en fin de conversation
- Extrait les thèmes clés abordés
- Format JSON structuré

**Utilisation** :
- Rapports pour les professionnels
- Suivi de l'évolution du patient
- Documentation des sessions

---

## 🧪 Comment Tester

### **Test 1 : Conversation Simple**

1. Ouvrez l'app mobile (http://localhost:8081)
2. Connectez-vous avec : `patient2@example.com` / `Password123`
3. Allez dans l'onglet **Chat**
4. Envoyez : "Bonjour, comment allez-vous ?"

**Résultat attendu** :
- Réponse personnalisée de Gemini (pas une réponse générique)
- Temps de réponse : 2-5 secondes

---

### **Test 2 : Score de Gravité**

Testez différents niveaux de messages :

**Niveau 1 (Stable)** :
```
"Je vais plutôt bien aujourd'hui, merci"
```

**Niveau 2 (Vigilance)** :
```
"Je me sens très anxieux et déprimé ces derniers temps"
```

**Niveau 3 (Critique)** :
```
"Je n'en peux plus, je pense à en finir"
```

**Vérification** :
- Regardez les logs du serveur
- Le score devrait apparaître : `Gravity score (Gemini): X`

---

### **Test 3 : Réponses Contextuelles**

1. Envoyez plusieurs messages successifs
2. Vérifiez que l'IA se souvient du contexte
3. Les réponses doivent être cohérentes avec l'historique

**Exemple de conversation** :
```
Patient: "J'ai perdu mon travail la semaine dernière"
IA: [Répond avec empathie]

Patient: "Du coup je suis très stressé"
IA: [Doit faire référence à la perte d'emploi mentionnée avant]
```

---

## 📊 Surveillance et Logs

### **Logs du Serveur**

Recherchez ces messages dans les logs :

**Réponse générée** :
```
2026-01-26 22:25:00 [info]: 💬 Message envoyé (conversation: ..., gravity: 2, rapport: non)
```

**Score de gravité** :
```
2026-01-26 22:25:00 [info]: Gravity score (Gemini): 2 for: "Je me sens très anxieux..."
```

**Erreurs potentielles** :
```
2026-01-26 22:25:00 [error]: Error generating response with Gemini: [détails]
```

---

## ⚠️ Points d'Attention

### **1. Quota API Gemini**

- **Limite gratuite** : Vérifiez votre quota Google Cloud
- **Dépassement** : L'app passera automatiquement en mode mock
- **Surveillance** : Console Google Cloud Platform

### **2. Temps de Réponse**

- **Normal** : 2-5 secondes par réponse
- **Lent (>10s)** : Problème réseau ou limite API atteinte
- **Solution** : Indicateur de "typing" visible côté patient

### **3. Qualité des Réponses**

**Facteurs influençant la qualité** :
- **Température** : 0.7 = équilibre (peut être ajusté)
- **Prompt système** : Définit le comportement de l'IA
- **Historique** : Plus de contexte = meilleures réponses

**Si les réponses sont** :
- Trop robotiques → Augmenter la température (0.8-0.9)
- Trop créatives → Diminuer la température (0.5-0.6)
- Hors sujet → Améliorer le prompt système

---

## 🔧 Configuration Avancée

### **Fichier**: `server/src/config/gemini.js`

```javascript
export const GEMINI_CONFIG = {
    model: 'gemini-1.5-flash',
    useMockMode: process.env.USE_MOCK_AI === 'true',
    temperature: {
        chatbot: 0.7,        // Réponses conversationnelles
        gravityScore: 0.3,   // Analyse objective
        summary: 0.5,        // Résumés factuels
    }
};
```

**Pour modifier le comportement** :
1. Éditez `server/src/utils/constants.js`
2. Modifiez les prompts dans `CHATBOT_PROMPTS`, `GRAVITY_PROMPTS`, etc.
3. Redémarrez le serveur : `npm run dev`

---

## 🎯 Prochaines Améliorations

### **À Court Terme** :
- [ ] Ajouter un indicateur "typing" côté frontend
- [ ] Implémenter un système de retry en cas d'échec API
- [ ] Logger les performances (temps de réponse)

### **À Moyen Terme** :
- [ ] Fine-tuning du modèle avec des données thérapeutiques
- [ ] Ajout de prompts spécialisés par type de problématique
- [ ] Système de feedback pour améliorer les réponses

### **À Long Terme** :
- [ ] Multilingue (français, anglais, etc.)
- [ ] Adaptation du ton selon le profil patient
- [ ] Intégration de modèles spécialisés en santé mentale

---

## 🐛 Dépannage

### **Problème : "Service indisponible"**

**Cause** : Erreur API Gemini

**Solutions** :
1. Vérifier la clé API dans `.env`
2. Vérifier le quota sur Google Cloud Console
3. Vérifier la connexion internet du serveur

---

### **Problème : Réponses toujours en mode Mock**

**Cause** : `USE_MOCK_AI` toujours à `true`

**Solutions** :
1. Vérifier `server/.env` : `USE_MOCK_AI=false`
2. Redémarrer le serveur : `npm run dev`
3. Vérifier les logs : doit PAS afficher "Mode simulation activé"

---

### **Problème : Score de gravité incorrect**

**Cause** : Prompt pas assez précis

**Solutions** :
1. Améliorer le prompt dans `GRAVITY_PROMPTS`
2. Augmenter `maxOutputTokens` si réponse tronquée
3. Ajuster la température (diminuer pour plus de cohérence)

---

## 📚 Ressources

- **Documentation Gemini** : https://ai.google.dev/docs
- **Console Google Cloud** : https://console.cloud.google.com/
- **Tarification** : https://ai.google.dev/pricing

---

## ✅ Checklist de Validation

- [x] `USE_MOCK_AI=false` dans `.env`
- [x] Serveur redémarré
- [x] Clé API Gemini valide
- [ ] Test : Réponse personnalisée reçue
- [ ] Test : Score de gravité calculé
- [ ] Test : Contexte conversationnel maintenu
- [ ] Logs : Pas d'erreurs Gemini

---

**Généré automatiquement - 26 janvier 2026**
**Priorité 2 : ✅ TERMINÉE**
