import logger from '../utils/logger.js';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Middleware pour vérifier que l'utilisateur a le rôle 'patient'
 */
export const requirePatient = (req, res, next) => {
    if (req.user.role !== USER_ROLES.PATIENT) {
        logger.warn(`Accès refusé (patient requis) pour user ${req.user.id} (rôle: ${req.user.role})`);
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux patients',
        });
    }
    next();
};

/**
 * Middleware pour vérifier que l'utilisateur a le rôle 'pro'
 */
export const requirePro = (req, res, next) => {
    if (req.user.role !== USER_ROLES.PRO) {
        logger.warn(`Accès refusé (pro requis) pour user ${req.user.id} (rôle: ${req.user.role})`);
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux professionnels',
        });
    }
    next();
};

/**
 * Middleware pour vérifier que l'utilisateur a accès à une ressource patient
 * Vérifie que le patient est lié au pro connecté
 */
export const requirePatientAccess = async (req, res, next) => {
    const { role, id: userId, linkedProId } = req.user;
    const targetPatientId = req.params.id || req.body.patientId;

    try {
        // Si c'est un patient, il ne peut accéder qu'à ses propres données
        if (role === USER_ROLES.PATIENT) {
            if (targetPatientId && targetPatientId !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès refusé',
                });
            }
            return next();
        }

        // Si c'est un pro, vérifier que le patient est lié à lui
        if (role === USER_ROLES.PRO) {
            const User = (await import('../models/User.js')).default;
            const patient = await User.findById(targetPatientId);

            if (!patient || patient.linkedProId.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès refusé à ce patient',
                });
            }
            return next();
        }

        // Rôle inconnu
        return res.status(403).json({
            success: false,
            message: 'Accès refusé',
        });
    } catch (error) {
        logger.error('Erreur lors de la vérification d\'accès patient:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur',
        });
    }
};

export default {
    requirePatient,
    requirePro,
    requirePatientAccess,
};
