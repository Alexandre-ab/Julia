import 'dotenv/config';
import connectDatabase from '../src/config/database.js';
import User from '../src/models/User.js';
import logger from '../src/utils/logger.js';

/**
 * Script pour créer des comptes de test
 * Usage: npm run seed
 */

const seedData = async () => {
    try {
        await connectDatabase();

        logger.info('🌱 Démarrage du seeding...');

        // Vérifier si des utilisateurs existent déjà
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0) {
            logger.warn(`⚠️  ${existingUsers} utilisateurs déjà existants. Voulez-vous continuer ?`);
            // En production, ajouter une confirmation ici
        }

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

        // 2. Créer des comptes patients de test
        // Note: Normalement ils s'inscrivent via invite token, mais pour le seed on force
        // Utiliser create() au lieu de insertMany() pour déclencher le hook de hashage
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

        const patients = [patient1, patient2];

        logger.info(`✅ ${patients.length} comptes patients créés`);

        logger.info('\n📋 COMPTES DE TEST CRÉÉS:\n');
        logger.info('PRO:');
        logger.info(`  Email: ${pro.email}`);
        logger.info(`  Mot de passe: Password123\n`);

        patients.forEach((p, i) => {
            logger.info(`PATIENT ${i + 1}:`);
            logger.info(`  Email: ${p.email}`);
            logger.info(`  Mot de passe: Password123\n`);
        });

        logger.info('✅ Seeding terminé !');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Erreur lors du seeding:', error);
        process.exit(1);
    }
};

seedData();
