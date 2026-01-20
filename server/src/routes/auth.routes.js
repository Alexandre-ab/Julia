import express from 'express';
import {
    register,
    login,
    generateInvite,
    validateToken,
    getCurrentUser,
} from '../controllers/auth.controller.js';
import authenticateJWT from '../middleware/authJWT.js';
import { requirePro } from '../middleware/roleCheck.js';
import { loginLimiter, registerLimiter, generateInviteLimiter } from '../middleware/rateLimiter.js';
import {
    registerValidator,
    loginValidator,
    validateTokenValidator,
} from '../utils/validators.js';

const router = express.Router();

// Routes publiques
router.post('/register', registerLimiter, registerValidator, register);
router.post('/login', loginLimiter, loginValidator, login);
router.get('/validate-token/:token', validateTokenValidator, validateToken);

// Routes protégées
router.post('/generate-invite', authenticateJWT, requirePro, generateInviteLimiter, generateInvite);
router.get('/me', authenticateJWT, getCurrentUser);

export default router;
