# 📚 Documentation Projet J

Bienvenue dans la documentation complète du Projet J !

---

## 🗂️ Organisation

La documentation est organisée en plusieurs catégories :

### 📖 **Guides** (`/guides/`)
Documentation pour démarrer et utiliser le projet

### ✨ **Features** (`/features/`)
Documentation des fonctionnalités implémentées

### 🧪 **Tests** (`/tests/`)
Rapports de tests et guides de test

### 🏗️ **Documentation Technique**
Architecture, API, Sécurité, Déploiement, Développement

---

## 📖 Guides

### [DEMARRAGE-RAPIDE.md](./guides/DEMARRAGE-RAPIDE.md)
**Guide de démarrage rapide du projet**
- Installation des dépendances
- Configuration des variables d'environnement
- Démarrage du backend et frontend
- Premiers pas dans l'application

### [COMPTES-TEST.md](./guides/COMPTES-TEST.md)
**Liste des comptes de test disponibles**
- Comptes patients
- Comptes professionnels
- Identifiants et mots de passe
- Comment créer de nouveaux comptes

---

## ✨ Fonctionnalités

### [GEMINI-ACTIVATION.md](./features/GEMINI-ACTIVATION.md)
**Activation et configuration de l'IA Gemini**
- Configuration de la clé API
- Différence entre mode mock et mode réel
- Tests de l'IA
- Résolution de problèmes

**Statut** : ✅ Opérationnel avec `models/gemini-2.5-flash`

### [HISTORIQUE-FEATURE.md](./features/HISTORIQUE-FEATURE.md)
**Historique des conversations cliquables**
- Navigation de l'historique vers le détail
- Affichage des messages en bulles de chat
- Scores de gravité
- Design et UX

**Statut** : ✅ Implémenté, en attente de tests utilisateur

---

## 🧪 Tests

### [TESTS-RESULTATS.md](./tests/TESTS-RESULTATS.md)
**Rapport détaillé des tests API**
- Tests d'authentification
- Tests des endpoints chat
- Tests de l'historique
- Résultats complets

**Dernière exécution** : 26 janvier 2026, 21:58  
**Statut** : ✅ Tous les tests passent (100%)

### [TEST-HISTORIQUE.md](./tests/TEST-HISTORIQUE.md)
**Guide de test de la fonctionnalité historique**
- Tests de navigation
- Tests d'affichage
- Tests des états (loading, erreur)
- Checklist de validation

**Type** : Guide de test manuel

### [test-connection.md](./tests/test-connection.md)
**Rapport de test de connexion frontend-backend**
- Tests de connectivité
- Configuration réseau
- Validation des endpoints
- Diagnostic des problèmes

**Statut** : ✅ Connexion validée

### [RESUME-TESTS.txt](./tests/RESUME-TESTS.txt)
**Résumé visuel des tests**
- Format texte ASCII stylisé
- Vue d'ensemble rapide
- Tous les tests en un coup d'œil

---

## 🏗️ Documentation Technique

### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Architecture technique complète du système**
- Vue d'ensemble du stack technologique
- Architecture frontend (React Native + Expo)
- Architecture backend (Node.js + Express + MongoDB)
- Modèles de données (User, Conversation, SessionReport)
- Flux de données détaillés
- Intégration IA (OpenAI/Gemini)
- Sécurité et performance

**Statut** : ✅ Documentation complète

### [API.md](./API.md)
**Documentation complète de l'API REST**
- Endpoints d'authentification (/auth/*)
- Endpoints de chat (/chat/*)
- Endpoints dashboard professionnel (/dashboard/*)
- Codes d'erreur et formats de réponse
- Exemples de requêtes curl/Postman
- Rate limiting et headers requis

**Statut** : ✅ Documentation complète

### [SECURITE.md](./SECURITE.md)
**Guide de sécurité et bonnes pratiques**
- Authentification JWT
- Hachage bcrypt des mots de passe
- Contrôle d'accès par rôle (RBAC)
- Rate limiting et protection API
- CORS et headers de sécurité (Helmet)
- Conformité RGPD
- Audit de sécurité

**Statut** : ✅ Documentation complète

### [DEPLOIEMENT.md](./DEPLOIEMENT.md)
**Guide de déploiement en production**
- Déploiement backend (Render, Railway, VPS)
- Configuration MongoDB Atlas
- Build et publication app mobile (EAS)
- Variables d'environnement production
- Monitoring (Sentry, UptimeRobot)
- CI/CD avec GitHub Actions
- Maintenance et rollback

**Statut** : ✅ Documentation complète

### [DEVELOPPEMENT.md](./DEVELOPPEMENT.md)
**Guide pour les développeurs**
- Configuration environnement de développement
- Standards de code (JavaScript, TypeScript)
- Architecture du code (MVC, composants)
- Workflow Git et conventions commits
- Tests (Jest, React Native Testing Library)
- Debugging (VS Code, React DevTools)
- Process de contribution

**Statut** : ✅ Documentation complète

---

## 🚀 Démarrage Rapide

**Pour commencer rapidement** :
1. Lire [DEMARRAGE-RAPIDE.md](./guides/DEMARRAGE-RAPIDE.md)
2. Consulter [COMPTES-TEST.md](./guides/COMPTES-TEST.md) pour les identifiants
3. Tester avec [TEST-HISTORIQUE.md](./tests/TEST-HISTORIQUE.md)

**Pour comprendre les fonctionnalités** :
1. [GEMINI-ACTIVATION.md](./features/GEMINI-ACTIVATION.md) - IA conversationnelle
2. [HISTORIQUE-FEATURE.md](./features/HISTORIQUE-FEATURE.md) - Navigation historique

**Pour valider le projet** :
1. [TESTS-RESULTATS.md](./tests/TESTS-RESULTATS.md) - Tests automatisés
2. [test-connection.md](./tests/test-connection.md) - Tests de connectivité

---

## 📁 Structure Complète

```
docs/
├── INDEX.md                     # Ce fichier
│
├── guides/                      # 📖 Guides d'utilisation
│   ├── DEMARRAGE-RAPIDE.md     # Guide de démarrage
│   └── COMPTES-TEST.md         # Comptes de test
│
├── features/                    # ✨ Documentation des fonctionnalités
│   ├── GEMINI-ACTIVATION.md    # IA Gemini
│   └── HISTORIQUE-FEATURE.md   # Historique cliquable
│
├── tests/                       # 🧪 Tests et validation
│   ├── TESTS-RESULTATS.md      # Rapport de tests API
│   ├── TEST-HISTORIQUE.md      # Guide de test historique
│   ├── test-connection.md      # Test de connexion
│   └── RESUME-TESTS.txt        # Résumé visuel
│
└── [Racine docs/]              # 🏗️ Documentation technique
    ├── ARCHITECTURE.md         # Architecture complète du système
    ├── API.md                  # Documentation API REST
    ├── SECURITE.md             # Guide de sécurité
    ├── DEPLOIEMENT.md          # Guide de déploiement
    └── DEVELOPPEMENT.md        # Guide pour développeurs
```

---

## 🔗 Documentation Technique

**Documentation technique du code** :
- **Backend** : `../server/README.md`
- **Frontend** : `../app/README.md`
- **README principal** : `../README.md`

---

## 📊 État du Projet

| Composant | Documentation | Tests | Statut |
|-----------|---------------|-------|--------|
| Backend API | ✅ | ✅ 100% | Opérationnel |
| Frontend Mobile | ✅ | ✅ | Opérationnel |
| IA Gemini | ✅ | ✅ | Opérationnel |
| Historique | ✅ | 🔄 En cours | Implémenté |
| Dashboard Pro | ⚠️ Partiel | ❌ | En développement |
| Notifications | ⚠️ Partiel | ❌ | En développement |

**Légende** :
- ✅ Complet et validé
- 🔄 En cours de validation
- ⚠️ Documentation partielle
- ❌ Non testé/documenté

---

## 🆕 Nouveautés

### Version 1.0.0 - 26 janvier 2026

**Fonctionnalités** :
- ✅ Connexion frontend-backend validée
- ✅ IA Gemini activée (modèle 2.5-flash)
- ✅ Bug chat corrigé (multiples appels à `/start`)
- ✅ Historique cliquable implémenté

**Documentation** :
- ✅ Organisation en dossiers thématiques
- ✅ Index de navigation créé
- ✅ Guides de test complets
- ✅ Documentation technique à jour

---

## 💡 Contribution

**Pour ajouter de la documentation** :
1. Créer le fichier dans le dossier approprié (`guides/`, `features/`, `tests/`)
2. Ajouter une entrée dans cet INDEX.md
3. Suivre le format markdown existant
4. Inclure des exemples et des captures d'écran si possible

**Conventions de nommage** :
- **Guides** : `NOM-DU-GUIDE.md` (ex: `INSTALLATION-WINDOWS.md`)
- **Features** : `NOM-FEATURE.md` (ex: `NOTIFICATIONS-PUSH.md`)
- **Tests** : `TEST-NOM.md` ou `TESTS-RESULTATS-*.md`

---

## 🔍 Recherche Rapide

**Par sujet** :
- **Démarrage** → [DEMARRAGE-RAPIDE.md](./guides/DEMARRAGE-RAPIDE.md)
- **Comptes** → [COMPTES-TEST.md](./guides/COMPTES-TEST.md)
- **IA** → [GEMINI-ACTIVATION.md](./features/GEMINI-ACTIVATION.md)
- **Historique** → [HISTORIQUE-FEATURE.md](./features/HISTORIQUE-FEATURE.md)
- **Tests** → [TESTS-RESULTATS.md](./tests/TESTS-RESULTATS.md)
- **Architecture** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API** → [API.md](./API.md)
- **Sécurité** → [SECURITE.md](./SECURITE.md)
- **Déploiement** → [DEPLOIEMENT.md](./DEPLOIEMENT.md)
- **Développement** → [DEVELOPPEMENT.md](./DEVELOPPEMENT.md)

**Par type** :
- **Guides utilisateur** → `/guides/`
- **Fonctionnalités** → `/features/`
- **Rapports de tests** → `/tests/`
- **Documentation technique** → `ARCHITECTURE.md`, `API.md`, etc.

---

## 📞 Support

**Besoin d'aide ?**
1. Consulter l'INDEX (ce fichier) pour trouver la bonne documentation
2. Lire le guide approprié
3. Vérifier les tests et rapports d'erreur
4. Consulter les logs (backend/frontend)

**Problèmes fréquents** :
- **Connexion frontend-backend** → [test-connection.md](./tests/test-connection.md)
- **IA ne répond pas** → [GEMINI-ACTIVATION.md](./features/GEMINI-ACTIVATION.md)
- **Erreurs API** → [TESTS-RESULTATS.md](./tests/TESTS-RESULTATS.md)

---

## 🎯 Feuille de Route

**Documentation récemment ajoutée** :
- [x] Architecture Technique Complète ✅
- [x] Documentation API REST ✅
- [x] Guide de Sécurité ✅
- [x] Guide de Déploiement ✅
- [x] Guide de Développement ✅

**Prochaines documentations à créer** :
- [ ] Guide du Dashboard Professionnel (détaillé)
- [ ] Documentation des Notifications Push
- [ ] Schéma OpenAPI/Swagger (API)
- [ ] Guide d'Accessibilité (A11y)
- [ ] Documentation Internationalisation (i18n)

---

**Dernière mise à jour** : 26 janvier 2026, 23:10  
**Version de la documentation** : 1.0.0  
**Statut** : ✅ Documentation organisée et complète
