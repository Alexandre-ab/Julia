import api from './api';
import {
    Conversation,
    ConversationSummary,
    SendMessageRequest,
    SendMessageResponse,
} from '../types/conversation.types';

/**
 * Démarrer une nouvelle conversation
 */
export const startConversation = async (): Promise<{ conversationId: string; startedAt: string }> => {
    const response = await api.post<{
        success: boolean;
        conversationId: string;
        startedAt: string;
    }>('/chat/start');

    return {
        conversationId: response.data.conversationId,
        startedAt: response.data.startedAt,
    };
};

/**
 * Envoyer un message et recevoir la réponse IA
 */
export const sendMessage = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>('/chat/send', data);
    return response.data;
};

/**
 * Terminer une conversation
 */
export const endConversation = async (conversationId: string): Promise<{
    conversationId: string;
    endedAt: string;
    reportId: string;
}> => {
    const response = await api.post<{
        success: boolean;
        conversationId: string;
        endedAt: string;
        reportId: string;
    }>(`/chat/end/${conversationId}`);

    return {
        conversationId: response.data.conversationId,
        endedAt: response.data.endedAt,
        reportId: response.data.reportId,
    };
};

/**
 * Récupérer l'historique des conversations
 */
export const getConversationHistory = async (
    limit: number = 20,
    skip: number = 0
): Promise<{ conversations: ConversationSummary[]; total: number }> => {
    const response = await api.get<{
        success: boolean;
        conversations: ConversationSummary[];
        total: number;
    }>('/chat/history', { params: { limit, skip } });

    return {
        conversations: response.data.conversations,
        total: response.data.total,
    };
};

/**
 * Récupérer une conversation complète
 */
export const getConversation = async (conversationId: string): Promise<Conversation> => {
    const response = await api.get<{
        success: boolean;
        conversation: Conversation;
    }>(`/chat/conversation/${conversationId}`);

    return response.data.conversation;
};

/**
 * Polling: récupérer les nouveaux messages depuis une date
 */
export const getNewMessages = async (
    conversationId: string,
    since?: string
): Promise<{
    messages: Conversation['messages'];
    conversationStatus: Conversation['status'];
    isBeingViewedByPro: boolean;
}> => {
    const params = since ? { since } : {};
    const response = await api.get<{
        success: boolean;
        messages: Conversation['messages'];
        conversationStatus: Conversation['status'];
        isBeingViewedByPro: boolean;
    }>(`/chat/conversation/${conversationId}/messages`, { params });

    return {
        messages: response.data.messages,
        conversationStatus: response.data.conversationStatus,
        isBeingViewedByPro: response.data.isBeingViewedByPro,
    };
};

export default {
    startConversation,
    sendMessage,
    endConversation,
    getConversationHistory,
    getConversation,
    getNewMessages,
};
