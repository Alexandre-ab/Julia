import User from '../models/User.js';
import InviteToken from '../models/InviteToken.js';
import { generateToken } from '../services/token.service.js';
import logger from '../utils/logger.js';

/**
 * POST /api/auth/register
 * Inscription d'un patient avec token d'invitation
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, inviteToken } = req.body;

        // 1. Vérifier le token d'invitation
        const token = await InviteToken.findOne({ token: inviteToken }).populate('proId');

        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token d\'invitation invalide',
            });
        }

        if (!token.isValid()) {
            return res.status(400).json({
                success: false,
                message: token.usedBy ? 'Ce token a déjà été utilisé' : 'Ce token a expiré',
            });
        }

        // 2. Vérifier que l'email n'est pas déjà utilisé
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Cet email est déjà utilisé',
            });
        }

        // 3. Créer le compte patient
        const user = await User.create({
            role: 'patient',
            email,
            passwordHash: password, // Le pre-save hook va hasher automatiquement
            linkedProId: token.proId,
            firstName,
            lastName,
        });

        // 4. Marquer le token comme utilisé
        await token.markAsUsed(user._id);

        // 5. Générer le JWT
        const jwtToken = generateToken(user);

        logger.info(`✅ Nouveau patient inscrit: ${user.email} (lié à pro ${token.proId._id})`);

        return res.status(201).json({
            success: true,
            token: jwtToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                linkedProId: user.linkedProId,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/login
 * Connexion (patient ou pro)
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Récupérer l'utilisateur avec le mot de passe (normalement exclu)
        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect',
            });
        }

        // 2. Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect',
            });
        }

        // 3. Vérifier que le compte est actif
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Compte désactivé',
            });
        }

        // 4. Mettre à jour la date de dernière connexion
        user.lastLoginAt = new Date();
        await user.save();

        // 5. Générer le JWT
        const token = generateToken(user);

        logger.info(`✅ Connexion réussie: ${user.email} (${user.role})`);

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                linkedProId: user.linkedProId,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/generate-invite
 * Génération d'un lien d'invitation (réservé aux pros)
 */
export const generateInvite = async (req, res, next) => {
    try {
        // req.user est défini par le middleware authenticateJWT
        const proId = req.user.id;

        // Créer le token
        const inviteToken = await InviteToken.create({ proId });

        // Générer le lien complet
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:19006';
        const inviteLink = `${frontendUrl}/signup?token=${inviteToken.token}`;

        logger.info(`✅ Token d'invitation généré par pro ${proId}: ${inviteToken.token}`);

        return res.status(201).json({
            success: true,
            token: inviteToken.token,
            inviteLink,
            expiresAt: inviteToken.expiresAt,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/auth/validate-token/:token
 * Validation d'un token d'invitation
 */
export const validateToken = async (req, res, next) => {
    try {
        const { token } = req.params;

        const inviteToken = await InviteToken.findOne({ token }).populate('proId', 'firstName lastName');

        if (!inviteToken) {
            return res.status(404).json({
                success: false,
                valid: false,
                message: 'Token invalide',
            });
        }

        if (!inviteToken.isValid()) {
            return res.status(400).json({
                success: false,
                valid: false,
                message: inviteToken.usedBy ? 'Ce token a déjà été utilisé' : 'Ce token a expiré',
            });
        }

        return res.status(200).json({
            success: true,
            valid: true,
            proName: `Dr. ${inviteToken.proId.firstName} ${inviteToken.proId.lastName}`,
            expiresAt: inviteToken.expiresAt,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/auth/me
 * Récupération du profil utilisateur courant
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        // req.user est défini par le middleware authenticateJWT
        const user = await User.findById(req.user.id).populate('linkedProId', 'firstName lastName email');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur introuvable',
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                linkedPro: user.linkedProId
                    ? {
                        id: user.linkedProId._id,
                        firstName: user.linkedProId.firstName,
                        lastName: user.linkedProId.lastName,
                        email: user.linkedProId.email,
                    }
                    : null,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    register,
    login,
    generateInvite,
    validateToken,
    getCurrentUser,
};
