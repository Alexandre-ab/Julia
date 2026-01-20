import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDatabase = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
        }

        const conn = await mongoose.connect(mongoURI, {
            // Options recommandées pour Mongoose 8.x
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info(`✅ MongoDB connecté: ${conn.connection.host}`);

        // Gestion des événements de connexion
        mongoose.connection.on('error', (err) => {
            logger.error('❌ Erreur MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('⚠️  MongoDB déconnecté');
        });

        // Gestion propre de la fermeture
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('🔌 Connexion MongoDB fermée (SIGINT)');
            process.exit(0);
        });

    } catch (error) {
        logger.error('❌ Erreur de connexion MongoDB:', error);
        process.exit(1);
    }
};

export default connectDatabase;
