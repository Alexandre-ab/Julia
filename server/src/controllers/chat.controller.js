import Conversation from '../models/Conversation.js';
import { generateAIResponse, calculateGravityScore } from '../services/ai.service.js';
import {
    checkReportTriggers,
    generateEndConversationReport,
} from '../services/report.service.js';
import logger from '../utils/logger.js';

/**
 * POST /api/chat/start
 * Démarrer une nouvelle conversation
 */
export const startConversation = async (req, res, next) => {
    try {
        const patientId = req.user.id;

        // Vérifier s'il y a déjà une conversation active
        const existingConversation = await Conversation.findActiveByPatient(patientId);

        if (existingConversation) {
            return res.status(200).json({
                success: true,
                message: 'Conversation active déjà existante',
                conversationId: existingConversation._id,
                startedAt: existingConversation.startedAt,
            });
        }

        // Créer une nouvelle conversation
        const conversation = await Conversation.create({
            patientId,
            messages: [],
            status: 'active',
        });

        logger.info(`✅ Nouvelle conversation créée: ${conversation._id} (patient: ${patientId})`);

        return res.status(201).json({
            success: true,
            conversationId: conversation._id,
            startedAt: conversation.startedAt,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/chat/send
 * Envoyer un message et recevoir la réponse IA
 */
export const sendMessage = async (req, res, next) => {
    try {
        const { conversationId, message } = req.body;
        const patientId = req.user.id;

        // Récupérer la conversation
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation introuvable',
            });
        }

        // Vérifier que la conversation appartient au patient
        if (conversation.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé',
            });
        }

        // Vérifier que la conversation est active
        if (conversation.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Cette conversation est terminée',
            });
        }

        // 1. Calculer le gravity score du message
        const gravityScore = await calculateGravityScore(message);

        // 2. Ajouter le message du patient
        await conversation.addMessage('user', message, gravityScore);

        // 3. Générer la réponse IA
        const aiResponse = await generateAIResponse(conversation.messages);

        // 4. Ajouter la réponse de l'IA
        await conversation.addMessage('ai', aiResponse);

        // 5. Vérifier les triggers de rapport (gravity élevé ou seuil de messages)
        const report = await checkReportTriggers(conversation);

        logger.info(
            `💬 Message envoyé (conversation: ${conversationId}, gravity: ${gravityScore}, rapport: ${report ? 'créé' : 'non'
            })`
        );

        // Récupérer les messages mis à jour
        const userMessage = conversation.messages[conversation.messages.length - 2];
        const aiMessage = conversation.messages[conversation.messages.length - 1];

        return res.status(200).json({
            success: true,
            userMessage: {
                id: userMessage._id,
                sender: userMessage.sender,
                text: userMessage.text,
                timestamp: userMessage.timestamp,
                gravityScore: userMessage.gravityScore,
            },
            aiMessage: {
                id: aiMessage._id,
                sender: aiMessage.sender,
                text: aiMessage.text,
                timestamp: aiMessage.timestamp,
            },
            highestGravityScore: conversation.highestGravityScore,
            reportTriggered: !!report,
            reportId: report?._id || null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/chat/end/:conversationId
 * Terminer une conversation
 */
export const endConversation = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const patientId = req.user.id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation introuvable',
            });
        }

        // Vérifier l'accès
        if (conversation.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé',
            });
        }

        // Vérifier qu'elle n'est pas déjà terminée
        if (conversation.status === 'ended') {
            return res.status(400).json({
                success: false,
                message: 'Cette conversation est déjà terminée',
            });
        }

        // Terminer la conversation
        await conversation.end();

        // Générer le rapport final
        const report = await generateEndConversationReport(conversation);

        logger.info(`🔚 Conversation terminée: ${conversationId} (rapport: ${report._id})`);

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            endedAt: conversation.endedAt,
            reportId: report._id,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/chat/history
 * Récupérer l'historique des conversations
 */
export const getHistory = async (req, res, next) => {
    try {
        const patientId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;
        const skip = parseInt(req.query.skip) || 0;

        const conversations = await Conversation.find({
            patientId,
            status: 'ended',
        })
            .sort({ endedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('startedAt endedAt highestGravityScore messages');

        const total = await Conversation.countDocuments({
            patientId,
            status: 'ended',
        });

        const formattedConversations = conversations.map((conv) => ({
            id: conv._id,
            startedAt: conv.startedAt,
            endedAt: conv.endedAt,
            messageCount: conv.messages.length,
            highestGravityScore: conv.highestGravityScore,
        }));

        return res.status(200).json({
            success: true,
            conversations: formattedConversations,
            total,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/chat/conversation/:id
 * Récupérer une conversation complète
 */
export const getConversation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation introuvable',
            });
        }

        // Vérifier l'accès
        if (conversation.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé',
            });
        }

        return res.status(200).json({
            success: true,
            conversation: {
                id: conversation._id,
                messages: conversation.messages,
                status: conversation.status,
                startedAt: conversation.startedAt,
                endedAt: conversation.endedAt,
                highestGravityScore: conversation.highestGravityScore,
                isBeingViewedByPro: conversation.isBeingViewedByPro,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/chat/conversation/:id/messages
 * Polling pour nouveaux messages (temps réel)
 */
export const getNewMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { since } = req.query;
        const patientId = req.user.id;

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation introuvable',
            });
        }

        // Vérifier l'accès
        if (conversation.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé',
            });
        }

        // Filtrer les messages depuis 'since'
        let messages = conversation.messages;
        if (since) {
            const sinceDate = new Date(since);
            messages = messages.filter((m) => m.timestamp > sinceDate);
        }

        return res.status(200).json({
            success: true,
            messages,
            conversationStatus: conversation.status,
            isBeingViewedByPro: conversation.isBeingViewedByPro,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/chat/conversation/:id/view
 * Marquer comme vue par le pro
 */
export const markAsViewedByPro = async (req, res, next) => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation introuvable',
            });
        }

        await conversation.markAsViewedByPro();

        logger.info(`👁️ Conversation ${id} marquée comme vue par pro ${req.user.id}`);

        return res.status(200).json({
            success: true,
            isBeingViewedByPro: true,
            lastProViewAt: conversation.lastProViewAt,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    startConversation,
    sendMessage,
    endConversation,
    getHistory,
    getConversation,
    getNewMessages,
    markAsViewedByPro,
};
