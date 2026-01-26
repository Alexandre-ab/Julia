# 🚀 Guide de Démarrage Rapide - Projet J

## Prérequis

- ✅ Node.js installé
- ✅ MongoDB Atlas configuré
- ✅ Variables d'environnement configurées (.env)

---

## 🎬 Démarrer le Projet

### 1️⃣ Démarrer le Backend

Ouvrez un terminal PowerShell :

```powershell
cd c:\JULIA\projet-j\server
npm run dev
```

**Vous devriez voir** :
```
✅ MongoDB connecté
🚀 Serveur démarré sur le port 5000
📝 Environnement: development
🌐 URL: http://localhost:5000
```

---

### 2️⃣ Démarrer le Frontend

Ouvrez un **nouveau** terminal PowerShell :

```powershell
cd c:\JULIA\projet-j\app
npm start
```

**Vous devriez voir** :
```
Starting Metro Bundler
› Metro waiting on exp://192.168.1.125:8081
› Web is waiting on http://localhost:8081

› Press a │ open Android
› Press w │ open web
```

---

### 3️⃣ Lancer l'Application

Choisissez votre plateforme :

#### 🌐 Web (navigateur)
Appuyez sur `w` dans le terminal Expo

#### 📱 Android
Appuyez sur `a` dans le terminal Expo

#### 🍎 iOS
Appuyez sur `i` dans le terminal Expo

---

## 🔐 Se Connecter

### Compte Patient (recommandé pour tester le chat)

**Email**: `patient2@example.com`  
**Mot de passe**: `Password123`

### Compte Professionnel (pour tester le dashboard)

**Email**: `dr.martin@example.com`  
**Mot de passe**: `Password123`

---

## 🧪 Tester l'API

Depuis la racine du projet :

```powershell
cd c:\JULIA\projet-j
node test-api.js
```

Ce script teste automatiquement toutes les routes API.

---

## 📝 Créer les Comptes de Test

Si les comptes n'existent pas encore :

```powershell
cd c:\JULIA\projet-j\server
npm run seed
```

---

## 🐛 Résolution de Problèmes

### Le serveur ne démarre pas

**Problème**: Port 5000 déjà utilisé  
**Solution**:
```powershell
# Trouver le processus
netstat -ano | findstr :5000

# Tuer le processus (remplacer PID par le numéro trouvé)
taskkill /PID <PID> /F
```

---

### MongoDB ne se connecte pas

**Vérifier** : Le fichier `server/.env` contient bien :
```env
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/?appName=JULIA
```

**Note** : Remplacez `[USERNAME]`, `[PASSWORD]` et `[CLUSTER]` par vos vraies valeurs MongoDB Atlas.

---

### L'app ne se connecte pas au backend

**Vérifier** : Le fichier `app/.env` contient bien :
```env
EXPO_PUBLIC_API_URL=http://192.168.1.125:5000/api
```

**Note** : Remplacez `192.168.1.125` par l'IP de votre machine si nécessaire.

Pour trouver votre IP :
```powershell
ipconfig
# Cherchez "Adresse IPv4" de votre connexion WiFi/Ethernet
```

---

### Erreur "Email ou mot de passe incorrect"

Le mot de passe est `Password123` avec un **P majuscule** !

---

## 📚 Documentation

- **Tests complets** : Voir `TESTS-RESULTATS.md`
- **Comptes de test** : Voir `COMPTES-TEST.md`
- **Architecture** : Voir `README.md` dans `/server` et `/app`

---

## 🎯 Fonctionnalités Testées

| Fonctionnalité | Comment tester |
|----------------|----------------|
| **Login** | Ouvrir l'app → Écran de connexion |
| **Chat** | Se connecter → Onglet Chat → Envoyer un message |
| **Historique** | Se connecter → Onglet Historique |
| **Dashboard Pro** | Se connecter avec compte pro → Dashboard |

---

## 🔧 Scripts Utiles

```powershell
# Backend
cd c:\JULIA\projet-j\server
npm run dev          # Démarrer avec nodemon
npm run seed         # Créer les comptes de test
npm start            # Démarrer en mode production

# Frontend
cd c:\JULIA\projet-j\app
npm start            # Démarrer Expo
npm run android      # Lancer directement sur Android
npm run ios          # Lancer directement sur iOS
npm run web          # Lancer directement sur Web

# Tests
cd c:\JULIA\projet-j
node test-api.js     # Tester l'API
```

---

## ✅ Checklist de Démarrage

- [ ] Les deux serveurs sont lancés (backend + frontend)
- [ ] Vous voyez "MongoDB connecté" dans le terminal backend
- [ ] Vous voyez "Metro waiting" dans le terminal frontend
- [ ] L'app s'ouvre (web, iOS ou Android)
- [ ] Vous pouvez vous connecter avec les identifiants de test
- [ ] Vous pouvez envoyer un message dans le chat

---

## 🎉 Vous êtes prêt !

Si tous les points de la checklist sont validés, votre environnement est correctement configuré et vous pouvez commencer à développer ! 🚀

---

**Pour plus d'aide** : Consultez les README dans `/server` et `/app`, ou les fichiers de test dans `/projet-j/`.
