import jwt from 'jsonwebtoken';
import JWT_CONFIG from '../config/jwt.js';

/**
 * Génère un JWT token pour un utilisateur
 * @param {Object} user - Document User de Mongoose
 * @returns {string} JWT token
 */
export function generateToken(user) {
    const payload = {
        userId: user._id,
        role: user.role,
        email: user.email,
    };

    // Ajouter linkedProId si c'est un patient
    if (user.role === 'patient' && user.linkedProId) {
        payload.linkedProId = user.linkedProId;
    }

    return jwt.sign(payload, JWT_CONFIG.secret, {
        expiresIn: JWT_CONFIG.expiresIn,
    });
}

/**
 * Vérifie et décode un JWT token
 * @param {string} token - JWT token
 * @returns {Object} Payload décodé
 * @throws {Error} Si le token est invalide
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
        throw new Error('Token invalide ou expiré');
    }
}

/**
 * Extrait le token du header Authorization
 * @param {Object} req - Request Express
 * @returns {string|null} Token ou null
 */
export function extractTokenFromHeader(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.substring(7); // Retirer "Bearer "
}

export default {
    generateToken,
    verifyToken,
    extractTokenFromHeader,
};
