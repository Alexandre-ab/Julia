# 🚀 Guide de Déploiement - Projet J

Guide complet pour déployer l'application en production.

---

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Déploiement Backend](#-déploiement-backend)
- [Déploiement Base de Données](#-déploiement-base-de-données)
- [Déploiement Application Mobile](#-déploiement-application-mobile)
- [Configuration Production](#-configuration-production)
- [Monitoring](#-monitoring)
- [Maintenance](#-maintenance)

---

## 🌐 Vue d'ensemble

### Architecture de Déploiement

```
┌─────────────────────────────────────────────────────┐
│                    UTILISATEURS                      │
│              (iOS + Android + Web)                   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│              CDN / Load Balancer                     │
│                 (Cloudflare)                         │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Mobile App     │         │   Backend API   │
│  (Expo/EAS)     │         │   (Render/     │
│                 │         │    Railway)     │
└─────────────────┘         └────────┬────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                  │
                    ▼                                  ▼
           ┌─────────────────┐             ┌─────────────────┐
           │   MongoDB Atlas │             │ OpenAI/Gemini   │
           │   (Database)    │             │     (IA)        │
           └─────────────────┘             └─────────────────┘
```

### Services Recommandés

| Composant | Service | Coût | Raison |
|-----------|---------|------|--------|
| **Backend** | Render / Railway | Gratuit → $7/mois | Node.js natif, CI/CD |
| **Database** | MongoDB Atlas | Gratuit → $9/mois | Cluster géré, backup auto |
| **Mobile** | Expo Application Services (EAS) | Gratuit → $29/mois | Build natif, OTA updates |
| **CDN/SSL** | Cloudflare | Gratuit | Performance, DDoS protection |
| **Monitoring** | Sentry | Gratuit → $26/mois | Error tracking |
| **Logs** | Papertrail | Gratuit → $7/mois | Logs centralisés |

---

## ⚙️ Déploiement Backend

### Option 1: Render (Recommandé)

#### Étape 1: Préparer le Projet

```bash
# 1. Créer Procfile à la racine de /server
echo "web: node src/server.js" > Procfile

# 2. Vérifier package.json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node src/server.js",
    "build": "echo 'No build step'"
  }
}
```

#### Étape 2: Créer un Web Service sur Render

1. Aller sur [render.com](https://render.com)
2. **New** → **Web Service**
3. Connecter votre repo GitHub
4. **Configuration:**

```yaml
Name: projet-j-api
Environment: Node
Region: Frankfurt (Europe) / Oregon (US)
Branch: main
Root Directory: server
Build Command: npm install
Start Command: npm start
```

#### Étape 3: Variables d'Environnement

Dans Render Dashboard → Environment:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/projet-j
JWT_SECRET=<secret-64-caracteres>
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
FRONTEND_URL=https://votre-app.com
```

#### Étape 4: Déployer

```bash
# Render détecte automatiquement les push sur main
git add .
git commit -m "Deploy to production"
git push origin main

# Render va:
# 1. Cloner le repo
# 2. Installer dépendances (npm install)
# 3. Démarrer le serveur (npm start)
```

**URL finale:** `https://projet-j-api.onrender.com`

---

### Option 2: Railway

#### Étape 1: Installation

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login
```

#### Étape 2: Créer Projet

```bash
cd server

# Initialiser projet Railway
railway init

# Lier au repo Git
railway link
```

#### Étape 3: Configuration

```bash
# Ajouter variables d'environnement
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="..."
railway variables set OPENAI_API_KEY="sk-..."

# Déployer
railway up
```

**URL finale:** `https://projet-j-api.up.railway.app`

---

### Option 3: VPS (Serveur Dédié)

#### Prérequis

- VPS Ubuntu 22.04 (DigitalOcean, Linode, OVH)
- Nom de domaine (ex: api.votre-app.com)

#### Étape 1: Configuration Serveur

```bash
# SSH dans le VPS
ssh root@votre-ip

# Mettre à jour
apt update && apt upgrade -y

# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Installer PM2 (process manager)
npm install -g pm2

# Installer Nginx
apt install -y nginx

# Installer Certbot (SSL gratuit)
apt install -y certbot python3-certbot-nginx
```

#### Étape 2: Déployer Application

```bash
# Cloner repo
cd /var/www
git clone https://github.com/votre-user/projet-j.git
cd projet-j/server

# Installer dépendances
npm install --production

# Créer .env
nano .env
# (Coller variables production)

# Démarrer avec PM2
pm2 start src/server.js --name projet-j-api
pm2 save
pm2 startup  # Auto-start au reboot
```

#### Étape 3: Configuration Nginx

```nginx
# /etc/nginx/sites-available/projet-j

server {
    listen 80;
    server_name api.votre-app.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer site
ln -s /etc/nginx/sites-available/projet-j /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Obtenir certificat SSL
certbot --nginx -d api.votre-app.com
```

**URL finale:** `https://api.votre-app.com`

---

## 🗄️ Déploiement Base de Données

### MongoDB Atlas (Recommandé)

#### Étape 1: Créer Cluster

1. Aller sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create** → **Shared Cluster** (Gratuit)
3. **Provider:** AWS / Region: eu-west-1 (Irlande)
4. **Cluster Name:** projet-j-cluster

#### Étape 2: Configuration Sécurité

**Database Access:**
```
Username: projet-j-user
Password: <générer mot de passe fort>
Role: Read and write to any database
```

**Network Access:**
```
# Option 1: Autoriser IP de Render/Railway
IP: 3.123.45.67 (IP de votre service)

# Option 2: Autoriser toutes IPs (moins sécurisé)
IP: 0.0.0.0/0
```

#### Étape 3: Obtenir URI de Connexion

```
mongodb+srv://projet-j-user:<password>@projet-j-cluster.abc123.mongodb.net/projet-j?retryWrites=true&w=majority
```

**⚠️ Remplacer `<password>` par le vrai mot de passe**

#### Étape 4: Backup Automatique

- **Atlas M0 (Gratuit):** Snapshots manuels uniquement
- **Atlas M10+ ($9/mois):** Backups automatiques quotidiens

```bash
# Backup manuel (local)
mongodump --uri="mongodb+srv://..." --out=./backup-$(date +%Y%m%d)

# Restauration
mongorestore --uri="mongodb+srv://..." ./backup-20260211
```

---

## 📱 Déploiement Application Mobile

### Expo Application Services (EAS)

#### Étape 1: Installation

```bash
cd app

# Installer EAS CLI
npm install -g eas-cli

# Login
eas login

# Initialiser projet
eas build:configure
```

#### Étape 2: Configuration (`eas.json`)

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://projet-j-api.onrender.com/api"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Étape 3: Build Production

```bash
# Android
eas build --platform android --profile production

# iOS (nécessite compte Apple Developer $99/an)
eas build --platform ios --profile production

# Les deux
eas build --platform all --profile production
```

**⏱️ Durée:** 10-20 minutes par plateforme

#### Étape 4: Télécharger Build

```bash
# Lister builds
eas build:list

# Télécharger .apk (Android) ou .ipa (iOS)
# Via dashboard: https://expo.dev/accounts/[username]/projects/projet-j-app/builds
```

#### Étape 5: Publier sur Stores

**Google Play Store:**
```bash
eas submit --platform android --latest
```

**Apple App Store:**
```bash
eas submit --platform ios --latest
```

### Over-The-Air (OTA) Updates

```bash
# Publier une mise à jour sans rebuild
eas update --branch production --message "Fix bug chat"

# L'app se mettra à jour automatiquement au prochain lancement
```

---

## 🔧 Configuration Production

### Variables d'Environnement

#### Backend (.env)

```env
# Général
NODE_ENV=production
PORT=10000

# Base de données
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/projet-j?retryWrites=true&w=majority

# Authentification
JWT_SECRET=VOTRE_SECRET_JWT_ICI_64_CARACTERES_MINIMUM_GENERE_AVEC_NODE_CRYPTO

# IA
OPENAI_API_KEY=sk-proj-abc123...
GEMINI_API_KEY=AIzaSy...
USE_MOCK_AI=false

# Frontend
FRONTEND_URL=https://votre-app.com

# Logs
LOG_LEVEL=info

# Sentry (optionnel)
SENTRY_DSN=https://...@sentry.io/123456
```

#### Frontend (.env)

```env
# URL Backend
EXPO_PUBLIC_API_URL=https://projet-j-api.onrender.com/api

# Sentry (optionnel)
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/123457
```

### Checklist Sécurité Production

- [ ] ✅ HTTPS activé (certificat SSL/TLS)
- [ ] ✅ Variables sensibles dans `.env` (pas en dur)
- [ ] ✅ Rate limiting activé
- [ ] ✅ CORS restrictif (whitelist frontend)
- [ ] ✅ Helmet headers configurés
- [ ] ✅ MongoDB IP whitelist configurée
- [ ] ✅ Logs sans données sensibles
- [ ] ✅ JWT secret fort (64 caractères min)
- [ ] ✅ Backup base de données automatisé

---

## 📊 Monitoring

### Sentry (Error Tracking)

#### Installation Backend

```bash
cd server
npm install @sentry/node
```

```javascript
// server.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1  // 10% des transactions
});

// Middleware (avant routes)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes...

// Middleware erreur (après routes)
app.use(Sentry.Handlers.errorHandler());
```

#### Installation Frontend

```bash
cd app
npm install @sentry/react-native
npx @sentry/wizard -i reactNative -p ios android
```

```typescript
// App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: 'production'
});
```

### Uptime Monitoring

#### UptimeRobot (Gratuit)

1. Aller sur [uptimerobot.com](https://uptimerobot.com)
2. **Add Monitor:**
   - Type: HTTP(s)
   - URL: `https://projet-j-api.onrender.com/health`
   - Interval: 5 minutes
   - Alert Contacts: votre email

```javascript
// Endpoint health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logs Centralisés

#### Papertrail

```bash
# Configurer Winston pour envoyer à Papertrail
npm install winston-syslog

// logger.js
import { Syslog } from 'winston-syslog';

logger.add(new Syslog({
  host: 'logs.papertrailapp.com',
  port: 12345,
  protocol: 'tls4',
  format: combine(timestamp(), json())
}));
```

---

## 🔄 Maintenance

### CI/CD avec GitHub Actions

```yaml
# .github/workflows/deploy.yml

name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd server && npm install
      - run: cd server && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        run: curl https://api.render.com/deploy/srv-xxx?key=yyy

  deploy-mobile:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: cd app && eas update --branch production --non-interactive
```

### Mises à Jour

```bash
# 1. Mettre à jour dépendances
npm outdated
npm update

# 2. Audit sécurité
npm audit
npm audit fix

# 3. Tester localement
npm test

# 4. Commit et push
git add .
git commit -m "Update dependencies"
git push origin main

# Auto-déployé via CI/CD
```

### Rollback

```bash
# Render: Revenir au déploiement précédent
# Via Dashboard → Deployments → Rollback

# Railway:
railway rollback

# VPS (PM2):
pm2 reload projet-j-api
git revert HEAD
pm2 restart projet-j-api
```

---

## 📞 Support Production

### Checklist Incident

1. ✅ Vérifier status services (Render, MongoDB Atlas, Sentry)
2. ✅ Consulter logs (Papertrail, Sentry)
3. ✅ Tester endpoint health: `curl https://api.../health`
4. ✅ Vérifier variables d'environnement
5. ✅ Rollback si nécessaire

### Contacts Urgence

- **Backend:** Render Support / Railway Discord
- **Database:** MongoDB Atlas Support (M10+)
- **Mobile:** Expo Discord
- **Erreurs:** Sentry Dashboard

---

**Dernière mise à jour**: Février 2026
**Version**: 1.0.0
**Statut**: ✅ Production-ready
