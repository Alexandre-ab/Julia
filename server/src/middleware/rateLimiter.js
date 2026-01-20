import rateLimit from 'express-rate-limit';

// Rate limiter pour les tentatives de login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' ? 100 : 5, // 100 en dev, 5 en prod
    message: {
        success: false,
        message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'development', // Désactiver en dev
});

// Rate limiter pour les inscriptions
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // 3 inscriptions max
    message: {
        success: false,
        message: 'Trop d\'inscriptions depuis cette IP. Réessayez dans 1 heure.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter pour la génération d'invitations (par userId)
export const generateInviteLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 heures
    max: 20, // 20 invitations par jour
    message: {
        success: false,
        message: 'Limite d\'invitations quotidienne atteinte. Réessayez demain.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip, // Par userId si authentifié
});

// Rate limiter pour l'envoi de messages (anti-spam)
export const sendMessageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 messages par minute
    message: {
        success: false,
        message: 'Trop de messages envoyés. Ralentissez un peu.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip,
});

// Rate limiter général pour l'API
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max
    message: {
        success: false,
        message: 'Trop de requêtes. Réessayez plus tard.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default {
    loginLimiter,
    registerLimiter,
    generateInviteLimiter,
    sendMessageLimiter,
    generalLimiter,
};
