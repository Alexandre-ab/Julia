# 🧪 Guide de Test : Historique des Conversations Cliquables

## 🎯 Fonctionnalité à Tester

**Navigation de l'historique vers le détail d'une conversation**

---

## ✅ Pré-requis

1. ✅ Backend démarré (`cd server && npm run dev`)
2. ✅ Frontend démarré (`cd app && npm start`)
3. ✅ Connecté en tant que patient (`patient2@example.com` / `Password123`)
4. ✅ Au moins 1 conversation terminée dans l'historique

---

## 📱 Tests à Effectuer

### Test 1 : Afficher l'Historique ✅

**Étapes** :
1. Ouvrir l'application
2. Se connecter avec le compte patient
3. Aller dans l'onglet **Historique** (icône 📋)

**Résultat attendu** :
- ✅ Liste des conversations terminées affichée
- ✅ Chaque carte montre :
  - Date (ex: `20/01/2026`)
  - Horaires (ex: `13:47 - 14:42`)
  - Nombre de messages (ex: `💬 52 messages`)
  - Statut (ex: `⚪ Terminée`)
  - Indicateur de gravité (🟢/🟠/🔴)

---

### Test 2 : Cliquer sur une Conversation ✅

**Étapes** :
1. Dans l'historique, cliquer sur une conversation

**Résultat attendu** :
- ✅ Transition vers un nouvel écran
- ✅ Header avec :
  - Bouton retour `←`
  - Date de la conversation
  - Horaires
  - Badge de gravité (Stable/Vigilance/Critique)
- ✅ Barre d'informations :
  - Nombre de messages
  - Statut (Active/Terminée)

---

### Test 3 : Affichage des Messages ✅

**Étapes** :
1. Ouvrir une conversation
2. Observer l'affichage des messages

**Résultat attendu** :
- ✅ Messages utilisateur :
  - Alignés à **droite**
  - Fond **bleu** (`COLORS.primary[600]`)
  - Texte **blanc**
- ✅ Messages IA :
  - Alignés à **gauche**
  - Fond **blanc**
  - Texte **noir**
  - Bordure grise légère
- ✅ Chaque message affiche :
  - Le texte complet
  - L'heure (ex: `13:47`)
  - Score de gravité si > 1 (ex: `🚨 2`)
- ✅ Messages affichés chronologiquement (du plus ancien au plus récent)
- ✅ Auto-scroll vers le bas au chargement

---

### Test 4 : Bouton Retour ✅

**Étapes** :
1. Dans l'écran de détail, cliquer sur le bouton `←` en haut à gauche

**Résultat attendu** :
- ✅ Retour vers l'écran d'historique
- ✅ Liste des conversations toujours chargée (pas de rechargement)

---

### Test 5 : Indicateurs de Gravité ✅

**Étapes** :
1. Ouvrir plusieurs conversations avec différents scores

**Résultat attendu** :
- ✅ **Score 1 (Stable)** :
  - Badge vert 🟢 dans le header
  - Pas de badge sur les messages individuels
- ✅ **Score 2 (Vigilance)** :
  - Badge orange 🟠 dans le header
  - Badge `🚨 2` sur les messages concernés
- ✅ **Score 3 (Critique)** :
  - Badge rouge 🔴 dans le header
  - Badge `🚨 3` sur les messages concernés

---

### Test 6 : États de Chargement ✅

**Étapes** :
1. Cliquer rapidement sur une conversation

**Résultat attendu** :
- ✅ Affichage temporaire de :
  - Spinner de chargement
  - Texte "Chargement..."
  - Header avec bouton retour visible
- ✅ Puis affichage des messages

---

### Test 7 : Gestion d'Erreur (Optionnel) ⚠️

**Étapes** :
1. Arrêter le backend
2. Essayer d'ouvrir une conversation

**Résultat attendu** :
- ✅ Écran d'erreur avec :
  - Icône ❌
  - Titre "Erreur"
  - Message d'erreur
  - Bouton "Retour" pour revenir à l'historique

---

## 📊 Checklist de Validation

### Visuel
- [ ] Les cartes de l'historique sont cliquables (réagissent au toucher)
- [ ] Transition fluide vers l'écran de détail
- [ ] Messages utilisateur à droite (fond bleu)
- [ ] Messages IA à gauche (fond blanc)
- [ ] Design cohérent avec le reste de l'app

### Fonctionnel
- [ ] Toutes les conversations s'ouvrent correctement
- [ ] Tous les messages sont affichés
- [ ] Scores de gravité corrects
- [ ] Horodatage correct
- [ ] Bouton retour fonctionne

### Performance
- [ ] Chargement rapide (< 1 seconde)
- [ ] Pas de freeze/lag
- [ ] Scroll fluide
- [ ] Pas d'erreurs dans la console

---

## 🐛 Problèmes Connus / À Surveiller

### Possible
1. **Conversations très longues (> 100 messages)** :
   - Peut causer un léger ralentissement
   - Solution future : pagination ou virtualisation

2. **Dates/heures** :
   - Vérifier que le fuseau horaire est correct
   - Devrait afficher l'heure locale

3. **Caractères spéciaux** :
   - Tester avec des emojis, accents, etc.
   - Devrait tous s'afficher correctement

---

## 🔧 Commandes Utiles

### Si l'application ne répond pas
```bash
# Redémarrer le frontend
cd app
npm start
# Puis presser 'r' dans le terminal pour reload
```

### Si les données ne s'affichent pas
```bash
# Vérifier les logs backend
cd server
# Observer la console

# Tester l'API manuellement
node test-api.js
```

### Effacer le cache Expo (si problèmes)
```bash
cd app
npx expo start -c
```

---

## 📸 Screenshots à Vérifier

### Écran Historique
```
┌──────────────────────────────────┐
│        Historique                │
├──────────────────────────────────┤
│  20/01/2026              🟢      │
│  13:50 - 14:42                   │
│  💬 52 messages  ⚪ Terminée     │
├──────────────────────────────────┤
│  20/01/2026              🟢      │
│  13:47 - 13:50                   │
│  💬 10 messages  ⚪ Terminée     │
└──────────────────────────────────┘
```

### Écran Détail
```
┌──────────────────────────────────┐
│ ← 20/01/2026        [Stable]     │
│   13:47 - 13:50                  │
├──────────────────────────────────┤
│ 💬 10 messages  ⚪ Terminée      │
├──────────────────────────────────┤
│                                  │
│        ┌──────────────────┐     │
│        │ Bonjour, je me   │     │
│        │ sens anxieux     │     │
│        │ 13:47            │     │
│        └──────────────────┘     │
│                                  │
│  ┌──────────────────┐           │
│  │ Je comprends,    │           │
│  │ je suis là...    │           │
│  │ 13:47            │           │
│  └──────────────────┘           │
│                                  │
└──────────────────────────────────┘
```

---

## ✅ Validation Finale

**Une fois tous les tests passés** :
- ✅ L'historique est entièrement fonctionnel
- ✅ La navigation fonctionne parfaitement
- ✅ L'affichage des messages est correct
- ✅ Le design est cohérent et professionnel

**Prochaine étape suggérée** :
- Tester sur un appareil physique (Android/iOS)
- Recueillir des retours utilisateurs
- Implémenter les améliorations futures si besoin

---

## 🆘 Besoin d'Aide ?

### Si ça ne marche pas
1. Vérifier que le backend est démarré
2. Vérifier les logs de la console (frontend et backend)
3. Essayer de restart l'app (`r` dans le terminal Expo)
4. Vérifier qu'il y a bien des conversations terminées

### Logs à surveiller

**Frontend (Expo)** :
- Chercher des erreurs rouges
- Vérifier les warnings jaunes

**Backend (Terminal server)** :
- Chercher `GET /api/chat/conversation/:id`
- Vérifier que le statut est `200 OK`

---

**Date de création** : 26 janvier 2026, 22:50  
**Statut** : Prêt pour tests utilisateur 🚀
