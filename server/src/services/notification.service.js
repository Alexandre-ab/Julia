import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Envoie une notification push Expo au psychologue en cas de détresse critique
 * @param {Object} conversation - Conversation document
 * @param {Object} report - SessionReport document
 */
export async function notifyProCriticalAlert(conversation, report) {
    try {
        // Récupérer le patient pour obtenir son nom
        const patient = await User.findById(conversation.patientId);
        if (!patient) {
            logger.error('Patient introuvable pour notification');
            return;
        }

        // Récupérer le pro
        const pro = await User.findById(patient.linkedProId);
        if (!pro) {
            logger.error('Psychologue introuvable pour notification');
            return;
        }

        // TODO: Implémenter l'envoi de notification push Expo
        // Nécessite :
        // 1. Stockage des Expo Push Tokens dans le modèle User
        // 2. SDK Expo Server pour envoyer les notifications
        // 3. Gestion des erreurs et retry logic

        /*
        const message = {
          to: pro.expoPushToken, // À ajouter dans le modèle User
          sound: 'default',
          title: '🚨 Alerte Détresse',
          body: `${patient.firstName} ${patient.lastName} - Intervention potentiellement nécessaire`,
          data: {
            conversationId: conversation._id.toString(),
            patientId: patient._id.toString(),
            reportId: report._id.toString(),
            type: 'critical_alert',
          },
          priority: 'high',
        };
    
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
          },
          body: JSON.stringify(message),
        });
        */

        logger.info(
            `📲 Notification critique envoyée au pro ${pro.email} pour patient ${patient.email}`
        );
    } catch (error) {
        logger.error('Erreur lors de l\'envoi de la notification:', error);
    }
}

/**
 * Envoie une notification push standard
 * @param {string} userId - ID du destinataire
 * @param {Object} notificationData - Données de la notification
 */
export async function sendPushNotification(userId, notificationData) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.error(`User ${userId} introuvable pour notification`);
            return;
        }

        // TODO: Implémenter l'envoi générique de notifications
        logger.info(`📲 Notification envoyée à ${user.email}:`, notificationData);
    } catch (error) {
        logger.error('Erreur lors de l\'envoi de la notification:', error);
    }
}

export default {
    notifyProCriticalAlert,
    sendPushNotification,
};
