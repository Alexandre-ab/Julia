import express from 'express';
import {
    getPatients,
    getPatientConversations,
    getPatientLiveConversation,
    getReports,
    markReportAsRead,
} from '../controllers/dashboard.controller.js';
import authenticateJWT from '../middleware/authJWT.js';
import { requirePro } from '../middleware/roleCheck.js';
import {
    getPatientConversationsValidator,
    getReportsValidator,
    markReportAsReadValidator,
} from '../utils/validators.js';

const router = express.Router();

// Toutes les routes dashboard sont réservées aux pros
router.use(authenticateJWT, requirePro);

router.get('/patients', getPatients);
router.get('/patient/:id/conversations', getPatientConversationsValidator, getPatientConversations);
router.get('/patient/:id/live', getPatientConversationsValidator, getPatientLiveConversation);
router.get('/reports', getReportsValidator, getReports);
router.patch('/report/:id/read', markReportAsReadValidator, markReportAsRead);

export default router;
