import express from 'express';
import {
    getPatientMessages,
    markMessageAsRead,
    getMessageStats,
    sendMessageToPatient,
} from '../controllers/message.controller.js';
import authenticateJWT from '../middleware/authJWT.js';
import { requirePro, requirePatient } from '../middleware/roleCheck.js';
import {
    sendMessageToPatientValidator,
    markMessageAsReadValidatorMsg,
} from '../utils/validators.js';

const router = express.Router();

// Routes pour les patients
router.get('/patient/messages', authenticateJWT, requirePatient, getPatientMessages);
router.get('/patient/messages/stats', authenticateJWT, requirePatient, getMessageStats);
router.patch('/patient/messages/:id/read', authenticateJWT, requirePatient, markMessageAsReadValidatorMsg, markMessageAsRead);

// Routes pour les praticiens
router.post('/pro/patient/:patientId/message', authenticateJWT, requirePro, sendMessageToPatientValidator, sendMessageToPatient);

export default router;
