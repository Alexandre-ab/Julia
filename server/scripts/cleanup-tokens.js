import 'dotenv/config';
import connectDatabase from '../src/config/database.js';
import InviteToken from '../src/models/InviteToken.js';
import logger from '../src/utils/logger.js';

/**
 * Script de nettoyage des tokens expirés
 * À exécuter via cron job quotidien
 * Usage: npm run cleanup-tokens
 */

const cleanupExpiredTokens = async () => {
    try {
        await connectDatabase();

        logger.info('🧹 Nettoyage des tokens expirés...');

        // Supprimer les tokens expirés depuis plus de 30 jours
        const deletedCount = await InviteToken.cleanupExpired(30);

        logger.info(`✅ ${deletedCount} tokens expirés supprimés`);

        process.exit(0);
    } catch (error) {
        logger.error('❌ Erreur lors du nettoyage:', error);
        process.exit(1);
    }
};

cleanupExpiredTokens();
