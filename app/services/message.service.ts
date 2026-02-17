import api from './api';
import { PractitionerMessage, MessageStats } from '../types/message.types';

/**
 * Récupère tous les messages du praticien pour le patient
 */
export const getPatientMessages = async (): Promise<PractitionerMessage[]> => {
    const response = await api.get<PractitionerMessage[]>('/patient/messages');
    return response.data;
};

/**
 * Marque un message comme lu
 */
export const markMessageAsRead = async (messageId: string): Promise<void> => {
    await api.patch(`/patient/messages/${messageId}/read`);
};

/**
 * Récupère les statistiques des messages
 */
export const getMessageStats = async (): Promise<MessageStats> => {
    const response = await api.get<MessageStats>('/patient/messages/stats');
    return response.data;
};
