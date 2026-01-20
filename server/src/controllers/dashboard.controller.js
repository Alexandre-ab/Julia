import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import SessionReport from '../models/SessionReport.js';
import logger from '../utils/logger.js';

/**
 * GET /api/dashboard/patients
 * Récupérer tous les patients d'un pro avec leurs statistiques
 */
export const getPatients = async (req, res, next) => {
    try {
        const proId = req.user.id;

        // Récupérer tous les patients liés à ce pro
        const patients = await User.find({
            linkedProId: proId,
            role: 'patient',
            isActive: true,
        }).select('firstName lastName email createdAt');

        // Pour chaque patient, récupérer les stats
        const patientsWithStats = await Promise.all(
            patients.map(async (patient) => {
                // Dernière conversation
                const lastConversation = await Conversation.findOne({
                    patientId: patient._id,
                })
                    .sort({ createdAt: -1 })
                    .select('createdAt highestGravityScore status');

                // Score de gravité maximum (toutes conversations)
                const allConversations = await Conversation.find({
                    patientId: patient._id,
                }).select('highestGravityScore');

                const highestGravityScore = allConversations.reduce(
                    (max, conv) => Math.max(max, conv.highestGravityScore),
                    1
                );

                // Nombre de rapports non lus
                const unreadReportsCount = await SessionReport.countUnreadByPatient(patient._id);

                // Conversation active ?
                const activeConversation = await Conversation.findOne({
                    patientId: patient._id,
                    status: 'active',
                });

                return {
                    id: patient._id,
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    email: patient.email,
                    lastConversationAt: lastConversation?.createdAt || null,
                    highestGravityScore,
                    unreadReportsCount,
                    activeConversation: !!activeConversation,
                };
            })
        );

        // Trier par gravity score descending
        patientsWithStats.sort((a, b) => b.highestGravityScore - a.highestGravityScore);

        logger.info(`📊 Dashboard: ${patientsWithStats.length} patients pour pro ${proId}`);

        return res.status(200).json({
            success: true,
            patients: patientsWithStats,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/dashboard/patient/:id/conversations
 * Historique des conversations d'un patient (pour le pro)
 */
export const getPatientConversations = async (req, res, next) => {
    try {
        const { id: patientId } = req.params;
        const proId = req.user.id;

        // Vérifier que le patient est lié au pro
        const patient = await User.findById(patientId);

        if (!patient || patient.linkedProId.toString() !== proId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé à ce patient',
            });
        }

        // Récupérer les conversations
        const conversations = await Conversation.find({
            patientId,
        })
            .sort({ startedAt: -1 })
            .select('startedAt endedAt status highestGravityScore messages reportGenerated');

        // Récupérer les reportIds associés
        const conversationIds = conversations.map((c) => c._id);
        const reports = await SessionReport.find({
            conversationId: { $in: conversationIds },
        }).select('conversationId _id');

        // Mapper reports par conversationId
        const reportMap = {};
        reports.forEach((r) => {
            reportMap[r.conversationId.toString()] = r._id;
        });

        const formattedConversations = conversations.map((conv) => ({
            id: conv._id,
            startedAt: conv.startedAt,
            endedAt: conv.endedAt,
            status: conv.status,
            messageCount: conv.messages.length,
            highestGravityScore: conv.highestGravityScore,
            reportId: reportMap[conv._id.toString()] || null,
        }));

        return res.status(200).json({
            success: true,
            conversations: formattedConversations,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/dashboard/patient/:id/live
 * Conversation en cours (temps réel) pour un patient
 */
export const getPatientLiveConversation = async (req, res, next) => {
    try {
        const { id: patientId } = req.params;
        const proId = req.user.id;

        // Vérifier l'accès
        const patient = await User.findById(patientId);

        if (!patient || patient.linkedProId.toString() !== proId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé',
            });
        }

        // Récupérer la conversation active
        const conversation = await Conversation.findOne({
            patientId,
            status: 'active',
        });

        if (!conversation) {
            return res.status(200).json({
                success: true,
                conversation: null,
            });
        }

        // Marquer comme vue par le pro
        if (!conversation.isBeingViewedByPro) {
            await conversation.markAsViewedByPro();
        }

        return res.status(200).json({
            success: true,
            conversation: {
                id: conversation._id,
                messages: conversation.messages,
                status: conversation.status,
                lastMessageAt:
                    conversation.messages.length > 0
                        ? conversation.messages[conversation.messages.length - 1].timestamp
                        : conversation.startedAt,
                highestGravityScore: conversation.highestGravityScore,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/dashboard/reports
 * Récupérer les rapports (filtrables)
 */
export const getReports = async (req, res, next) => {
    try {
        const proId = req.user.id;
        const { status, patientId, limit } = req.query;

        const filters = {
            status: status || undefined,
            patientId: patientId || undefined,
            limit: parseInt(limit) || 50,
        };

        const reports = await SessionReport.findByPro(proId, filters);

        // Formater pour le frontend
        const formattedReports = reports.map((report) => ({
            id: report._id,
            patientName: `${report.patientId.firstName} ${report.patientId.lastName}`,
            patientId: report.patientId._id,
            gravityScore: report.gravityScore,
            aiSummary: report.aiSummary,
            keyTopics: report.keyTopics,
            triggerReason: report.triggerReason,
            createdAt: report.createdAt,
            status: report.status,
            readAt: report.readAt,
        }));

        logger.info(`📋 ${formattedReports.length} rapports récupérés pour pro ${proId}`);

        return res.status(200).json({
            success: true,
            reports: formattedReports,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/dashboard/report/:id/read
 * Marquer un rapport comme lu
 */
export const markReportAsRead = async (req, res, next) => {
    try {
        const { id: reportId } = req.params;
        const proId = req.user.id;

        const report = await SessionReport.findById(reportId).populate('patientId', 'linkedProId');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Rapport introuvable',
            });
        }

        // Vérifier que le patient est lié au pro
        if (report.patientId.linkedProId.toString() !== proId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé',
            });
        }

        // Marquer comme lu
        await report.markAsRead(proId);

        logger.info(`✅ Rapport ${reportId} marqué comme lu par pro ${proId}`);

        return res.status(200).json({
            success: true,
            reportId: report._id,
            readAt: report.readAt,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getPatients,
    getPatientConversations,
    getPatientLiveConversation,
    getReports,
    markReportAsRead,
};
