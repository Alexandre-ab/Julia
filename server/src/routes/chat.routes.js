import express from 'express';
import {
    startConversation,
    sendMessage,
    endConversation,
    getHistory,
    getConversation,
    getNewMessages,
    markAsViewedByPro,
} from '../controllers/chat.controller.js';
import authenticateJWT from '../middleware/authJWT.js';
import { requirePatient, requirePro } from '../middleware/roleCheck.js';
import { sendMessageLimiter } from '../middleware/rateLimiter.js';
import {
    sendMessageValidator,
    endConversationValidator,
    getConversationValidator,
    getMessagesPollingValidator,
} from '../utils/validators.js';

const router = express.Router();

// Routes patient
router.post('/start', authenticateJWT, requirePatient, startConversation);
router.post('/send', authenticateJWT, requirePatient, sendMessageLimiter, sendMessageValidator, sendMessage);
router.post('/end/:conversationId', authenticateJWT, requirePatient, endConversationValidator, endConversation);
router.get('/history', authenticateJWT, requirePatient, getHistory);

// Routes accessible patient + pro
router.get('/conversation/:id', authenticateJWT, getConversationValidator, getConversation);
router.get('/conversation/:id/messages', authenticateJWT, getMessagesPollingValidator, getNewMessages);

// Routes pro
router.patch('/conversation/:id/view', authenticateJWT, requirePro, getConversationValidator, markAsViewedByPro);

export default router;
