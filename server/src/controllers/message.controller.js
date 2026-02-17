import Message from '../models/Message.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';

/**
 * Récupère tous les messages pour le patient connecté
 */
export const getPatientMessages = async (req, res) => {
    try {
        const patientId = req.user.userId;

        const messages = await Message.find({ patientId })
            .sort({ createdAt: -1 })
            .lean();

        res.json(messages);
    } catch (error) {
        logger.error('Erreur récupération messages patient:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des messages'
        });
    }
};

/**
 * Marque un message comme lu
 */
export const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.userId;

        const message = await Message.findOne({ _id: id, patientId });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé'
            });
        }

        if (message.isRead) {
            return res.json({
                success: true,
                message: 'Message déjà lu'
            });
        }

        message.isRead = true;
        message.readAt = new Date();
        await message.save();

        res.json({
            success: true,
            message: 'Message marqué comme lu'
        });
    } catch (error) {
        logger.error('Erreur marquage message:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du marquage du message'
        });
    }
};

/**
 * Récupère les statistiques des messages
 */
export const getMessageStats = async (req, res) => {
    try {
        const patientId = req.user.userId;

        const totalMessages = await Message.countDocuments({ patientId });
        const unreadMessages = await Message.countDocuments({ patientId, isRead: false });

        const lastMessage = await Message.findOne({ patientId })
            .sort({ createdAt: -1 })
            .select('createdAt')
            .lean();

        res.json({
            totalMessages,
            unreadMessages,
            lastMessageAt: lastMessage?.createdAt,
        });
    } catch (error) {
        logger.error('Erreur récupération stats messages:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
};

/**
 * Envoie un message à un patient (praticien)
 */
export const sendMessageToPatient = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { patientId } = req.params;
        const practitionerId = req.user.userId;
        const { subject, content, conversationId } = req.body;

        // Vérifier que le patient existe et est lié au praticien
        const patient = await User.findOne({
            _id: patientId,
            role: 'patient',
            practitionerId
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient non trouvé ou non lié à ce praticien'
            });
        }

        const message = new Message({
            patientId,
            practitionerId,
            conversationId,
            subject,
            content,
            isRead: false,
        });

        await message.save();

        logger.info(`Message envoyé au patient ${patientId} par le praticien ${practitionerId}`);

        res.status(201).json({
            success: true,
            message: 'Message envoyé avec succès',
            data: message
        });
    } catch (error) {
        logger.error('Erreur envoi message:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi du message'
        });
    }
};
