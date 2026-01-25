import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/database.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ===== CONNEXION BASE DE DONNÉES =====
await connectDatabase();

// ===== MIDDLEWARES GLOBAUX =====

// CORS - Allow multiple origins
const allowedOrigins = [
    'http://localhost:19006',
    'http://localhost:8081',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or Postman)
            if (!origin) return callback(null, true);

            // In development, allow any localhost/127.0.0.1 origin
            if (process.env.NODE_ENV === 'development') {
                if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                    return callback(null, true);
                }
            }

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.error('Blocked by CORS:', origin); // Log the blocked origin
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
app.use(generalLimiter);

// Logger des requêtes (en dev)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        logger.debug(`${req.method} ${req.path}`);
        next();
    });
}

// ===== ROUTES =====

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Projet J API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ===== GESTION DES ERREURS =====

// 404 - Route non trouvée
app.use(notFoundHandler);

// Gestionnaire d'erreurs global
app.use(errorHandler);

// ===== DÉMARRAGE DU SERVEUR =====

app.listen(PORT, () => {
    logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
    logger.info(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 URL: http://localhost:${PORT}`);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
    logger.info('SIGTERM reçu, arrêt du serveur...');
    process.exit(0);
});

export default app;
