# 🔐 Comptes de Test - Projet J

## Identifiants de connexion

### 👨‍⚕️ Compte Professionnel (Thérapeute)

**Email**: `dr.martin@example.com`  
**Mot de passe**: `Password123`  
**Nom**: Sophie Martin  
**Téléphone**: +33612345678  
**Accès**: Dashboard professionnel, gestion des patients, invitations

---

### 👤 Comptes Patients

#### Patient 1
**Email**: `patient1@example.com`  
**Mot de passe**: `Password123`  
**Nom**: Jean Dupont  
**Thérapeute associé**: Dr. Sophie Martin

#### Patient 2
**Email**: `patient2@example.com`  
**Mot de passe**: `Password123`  
**Nom**: Marie Dubois  
**Thérapeute associé**: Dr. Sophie Martin

---

## 🚀 Comment créer ces comptes

Si vous devez recréer les comptes de test dans la base de données :

```bash
cd c:\JULIA\projet-j\server
npm run seed
```

Ce script va créer les 3 comptes ci-dessus dans votre base MongoDB.

---

## 📝 Notes importantes

1. **Mot de passe**: Tous les comptes utilisent `Password123` (avec P majuscule)
2. **Environnement**: Ces comptes sont uniquement pour le développement/test
3. **Base de données**: MongoDB Atlas (`JULIA` database)
4. **Sécurité**: Ne JAMAIS utiliser ces identifiants en production

---

## 🧪 Test rapide

Pour tester la connexion rapidement :

```bash
cd c:\JULIA\projet-j
node test-api.js
```

Ce script teste automatiquement :
- ✅ Health check du serveur
- ✅ Login avec patient2@example.com
- ✅ Récupération du profil utilisateur
- ✅ Démarrage d'une conversation
- ✅ Envoi d'un message
- ✅ Consultation de l'historique

---

**Dernière mise à jour**: 26 janvier 2026
