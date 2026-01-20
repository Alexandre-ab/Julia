import Conversation from '../models/Conversation.js';
import SessionReport from '../models/SessionReport.js';
import { generateConversationSummary } from './ai.service.js';
import { notifyProCriticalAlert } from './notification.service.js';
import logger from '../utils/logger.js';
import {
    TRIGGER_REASONS,
    GRAVITY_LEVELS,
    REPORT_SETTINGS,
    CRISIS_AUTO_MESSAGE,
} from '../utils/constants.js';

/**
 * Vérifie si un rapport doit être généré et le crée si nécessaire
 * @param {Object} conversation - Document Conversation de Mongoose
 * @param {string} triggerReason - Raison du déclenchement
 * @returns {Promise<Object|null>} SessionReport créé ou null
 */
export async function checkAndGenerateReport(conversation, triggerReason) {
    try {
        // Vérifier si un rapport existe déjà pour cette conversation
        if (conversation.reportGenerated) {
            logger.info(`Rapport déjà généré pour conversation ${conversation._id}`);
            return null;
        }

        // Générer le résumé AI
        const { summary, keyTopics } = await generateConversationSummary(conversation.messages);

        // Créer le SessionReport
        const report = await SessionReport.create({
            conversationId: conversation._id,
            patientId: conversation.patientId,
            aiSummary: summary,
            gravityScore: conversation.highestGravityScore,
            keyTopics,
            triggerReason,
            status: 'unread',
        });

        // Marquer la conversation comme ayant un rapport
        conversation.reportGenerated = true;
        await conversation.save();

        logger.info(
            `✅ SessionReport créé (ID: ${report._id}) - Trigger: ${triggerReason}, Gravity: ${conversation.highestGravityScore}`
        );

        // Si détresse critique (gravity = 3), envoyer notification au pro
        if (conversation.highestGravityScore === GRAVITY_LEVELS.CRITICAL) {
            await handleCriticalDistress(conversation, report);
        }

        return report;
    } catch (error) {
        logger.error('Erreur lors de la génération du rapport:', error);
        throw error;
    }
}

/**
 * Gestion de la détresse critique (gravity score = 3)
 * @param {Object} conversation - Conversation Mongoose document
 * @param {Object} report - SessionReport Mongoose document
 */
async function handleCriticalDistress(conversation, report) {
    try {
        logger.warn(`🚨 DÉTRESSE CRITIQUE détectée - Conversation ${conversation._id}`);

        // 1. Envoyer notification push au pro
        await notifyProCriticalAlert(conversation, report);

        // 2. Ajouter un message système dans la conversation
        await conversation.addMessage('ai', CRISIS_AUTO_MESSAGE);

        // 3. Marquer la conversation comme vue par le pro (flag pour polling)
        conversation.isBeingViewedByPro = true;
        await conversation.save();

        logger.info(`✅ Alerte détresse envoyée pour conversation ${conversation._id}`);
    } catch (error) {
        logger.error('Erreur lors de la gestion de la détresse critique:', error);
    }
}

/**
 * Vérifie les conditions de déclenchement d'un rapport
 * @param {Object} conversation - Conversation Mongoose document
 * @returns {Promise<Object|null>} Rapport créé ou null
 */
export async function checkReportTriggers(conversation) {
    // Ne pas recréer si déjà généré
    if (conversation.reportGenerated) {
        return null;
    }

    // TRIGGER 1: Gravity score élevé (≥ 2)
    if (conversation.highestGravityScore >= REPORT_SETTINGS.HIGH_GRAVITY_THRESHOLD) {
        logger.info(`Déclenchement rapport: HIGH_GRAVITY (score: ${conversation.highestGravityScore})`);
        return await checkAndGenerateReport(conversation, TRIGGER_REASONS.HIGH_GRAVITY);
    }

    // TRIGGER 2: Seuil de messages atteint (ex: 10 messages)
    const patientMessageCount = conversation.messages.filter((m) => m.sender === 'user').length;
    if (patientMessageCount >= REPORT_SETTINGS.MESSAGE_THRESHOLD) {
        logger.info(`Déclenchement rapport: MESSAGE_THRESHOLD (${patientMessageCount} messages)`);
        return await checkAndGenerateReport(conversation, TRIGGER_REASONS.MESSAGE_THRESHOLD);
    }

    return null;
}

/**
 * Génère un rapport lorsque la conversation est terminée
 * @param {Object} conversation - Conversation Mongoose document
 * @returns {Promise<Object>} SessionReport créé
 */
export async function generateEndConversationReport(conversation) {
    return await checkAndGenerateReport(conversation, TRIGGER_REASONS.CONVERSATION_ENDED);
}

export default {
    checkAndGenerateReport,
    checkReportTriggers,
    generateEndConversationReport,
    handleCriticalDistress,
};
