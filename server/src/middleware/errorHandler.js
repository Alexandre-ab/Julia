import logger from '../utils/logger.js';

/**
 * Middleware global de gestion des erreurs
 */
export const errorHandler = (err, req, res, next) => {
    // Logger l'erreur
    logger.error('Erreur détectée:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        user: req.user?.id || 'non authentifié',
    });

    // Erreurs de validation Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors,
        });
    }

    // Erreurs de cast Mongoose (ID invalide)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID invalide',
        });
    }

    // Erreurs de duplication (email déjà utilisé)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            message: `Ce ${field} est déjà utilisé`,
        });
    }

    // Erreur JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expiré',
        });
    }

    // Erreur par défaut
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erreur serveur interne';

    return res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route non trouvée: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

export default {
    errorHandler,
    notFoundHandler,
};
