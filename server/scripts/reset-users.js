import 'dotenv/config';
import connectDatabase from '../src/config/database.js';
import User from '../src/models/User.js';
import logger from '../src/utils/logger.js';

/**
 * Script pour supprimer tous les utilisateurs et re-seed
 * Usage: node scripts/reset-users.js
 */

const resetUsers = async () => {
    try {
        await connectDatabase();

        logger.info('🗑️  Suppression de tous les utilisateurs...');
        
        const deletedCount = await User.deleteMany({});
        logger.info(`✅ ${deletedCount.deletedCount} utilisateurs supprimés`);

        logger.info('🌱 Création des nouveaux comptes...');

        // 1. Créer un compte pro
        const pro = await User.create({
            role: 'pro',
            email: 'dr.martin@example.com',
            passwordHash: 'Password123', // Sera haché automatiquement
            firstName: 'Sophie',
            lastName: 'Martin',
            phone: '+33612345678',
        });

        logger.info(`✅ Compte pro créé: ${pro.email}`);

        // 2. Créer des comptes patients (avec create() pour trigger le hook)
        const patient1 = await User.create({
            role: 'patient',
            email: 'patient1@example.com',
            passwordHash: 'Password123',
            firstName: 'Jean',
            lastName: 'Dupont',
            linkedProId: pro._id,
        });

        const patient2 = await User.create({
            role: 'patient',
            email: 'patient2@example.com',
            passwordHash: 'Password123',
            firstName: 'Marie',
            lastName: 'Dubois',
            linkedProId: pro._id,
        });

        logger.info(`✅ Patient 1 créé: ${patient1.email}`);
        logger.info(`✅ Patient 2 créé: ${patient2.email}`);

        logger.info('\n📋 COMPTES CRÉÉS:\n');
        logger.info('PRO:');
        logger.info(`  Email: ${pro.email}`);
        logger.info(`  Mot de passe: Password123\n`);
        logger.info('PATIENT 1:');
        logger.info(`  Email: ${patient1.email}`);
        logger.info(`  Mot de passe: Password123\n`);
        logger.info('PATIENT 2:');
        logger.info(`  Email: ${patient2.email}`);
        logger.info(`  Mot de passe: Password123\n`);

        logger.info('✅ Reset terminé !');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Erreur lors du reset:', error);
        process.exit(1);
    }
};

resetUsers();
