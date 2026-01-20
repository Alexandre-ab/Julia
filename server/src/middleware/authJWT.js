import { verifyToken, extractTokenFromHeader } from '../services/token.service.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Middleware pour vérifier le JWT et ajouter l'utilisateur à req.user
 */
export const authenticateJWT = async (req, res, next) => {
    try {
        // Extraire le token
        const token = extractTokenFromHeader(req);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification manquant',
            });
        }

        // Vérifier et décoder le token
        const decoded = verifyToken(token);

        // Récupérer l'utilisateur depuis la DB
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur introuvable ou inactif',
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = {
            id: user._id,
            role: user.role,
            email: user.email,
            linkedProId: user.linkedProId,
        };

        next();
    } catch (error) {
        logger.error('Erreur d\'authentification JWT:', error);
        return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré',
        });
    }
};

export default authenticateJWT;
