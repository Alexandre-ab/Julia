import api from './api';
import { PractitionerMessage } from '../types/message.types';

export interface SendMessageRequest {
    subject: string;
    content: string;
    conversationId?: string;
}

/**
 * Envoie un message à un patient (praticien)
 */
export const sendMessageToPatient = async (
    patientId: string,
    data: SendMessageRequest
): Promise<PractitionerMessage> => {
    const response = await api.post<{ success: boolean; message: string; data: PractitionerMessage }>(
        `/pro/patient/${patientId}/message`,
        data
    );
    return response.data.data;
};
