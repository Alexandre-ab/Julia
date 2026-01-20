import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware pour gérer les erreurs de validation
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

// ===== AUTH VALIDATORS =====

export const registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail()
        .toLowerCase()
        .trim(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit faire minimum 8 caractères')
        .matches(/[A-Z]/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule')
        .matches(/[0-9]/)
        .withMessage('Le mot de passe doit contenir au moins un chiffre'),
    body('firstName')
        .notEmpty()
        .withMessage('Le prénom est requis')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Le prénom doit faire minimum 2 caractères'),
    body('lastName')
        .notEmpty()
        .withMessage('Le nom est requis')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Le nom doit faire minimum 2 caractères'),
    body('inviteToken')
        .notEmpty()
        .withMessage('Le token d\'invitation est requis')
        .isUUID(4)
        .withMessage('Token d\'invitation invalide'),
    handleValidationErrors,
];

export const loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail()
        .toLowerCase()
        .trim(),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
    handleValidationErrors,
];

export const validateTokenValidator = [
    param('token').isUUID(4).withMessage('Token invalide'),
    handleValidationErrors,
];

// ===== CHAT VALIDATORS =====

export const sendMessageValidator = [
    body('conversationId')
        .notEmpty()
        .withMessage('L\'ID de conversation est requis')
        .isMongoId()
        .withMessage('ID de conversation invalide'),
    body('message')
        .notEmpty()
        .withMessage('Le message ne peut pas être vide')
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Le message ne peut pas dépasser 2000 caractères'),
    handleValidationErrors,
];

export const endConversationValidator = [
    param('conversationId').isMongoId().withMessage('ID de conversation invalide'),
    handleValidationErrors,
];

export const getConversationValidator = [
    param('id').isMongoId().withMessage('ID de conversation invalide'),
    handleValidationErrors,
];

export const getMessagesPollingValidator = [
    param('id').isMongoId().withMessage('ID de conversation invalide'),
    query('since').optional().isISO8601().withMessage('Format de date invalide'),
    handleValidationErrors,
];

// ===== DASHBOARD VALIDATORS =====

export const getPatientConversationsValidator = [
    param('id').isMongoId().withMessage('ID patient invalide'),
    handleValidationErrors,
];

export const getReportsValidator = [
    query('status')
        .optional()
        .isIn(['unread', 'read'])
        .withMessage('Status invalide (unread ou read)'),
    query('patientId')
        .optional()
        .isMongoId()
        .withMessage('ID patient invalide'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limite invalide (1-100)'),
    handleValidationErrors,
];

export const markReportAsReadValidator = [
    param('id').isMongoId().withMessage('ID de rapport invalide'),
    handleValidationErrors,
];

export default {
    registerValidator,
    loginValidator,
    validateTokenValidator,
    sendMessageValidator,
    endConversationValidator,
    getConversationValidator,
    getMessagesPollingValidator,
    getPatientConversationsValidator,
    getReportsValidator,
    markReportAsReadValidator,
};
