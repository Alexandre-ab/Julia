import api from './api';
import { PatientStats, SessionReport } from '../types/report.types';
import { ConversationSummary, Conversation } from '../types/conversation.types';

/**
 * Récupérer tous les patients d'un pro avec leurs stats
 */
export const getPatients = async (): Promise<PatientStats[]> => {
    const response = await api.get<{
        success: boolean;
        patients: PatientStats[];
    }>('/dashboard/patients');

    return response.data.patients;
};

/**
 * Récupérer l'historique des conversations d'un patient
 */
export const getPatientConversations = async (patientId: string): Promise<ConversationSummary[]> => {
    const response = await api.get<{
        success: boolean;
        conversations: ConversationSummary[];
    }>(`/dashboard/patient/${patientId}/conversations`);

    return response.data.conversations;
};

/**
 * Récupérer la conversation active d'un patient (polling pour live view)
 */
export const getPatientLiveConversation = async (
    patientId: string
): Promise<Conversation | null> => {
    const response = await api.get<{
        success: boolean;
        conversation: Conversation | null;
    }>(`/dashboard/patient/${patientId}/live`);

    return response.data.conversation;
};

/**
 * Récupérer les rapports (filtrables)
 */
export const getReports = async (filters?: {
    status?: 'unread' | 'read';
    patientId?: string;
    limit?: number;
}): Promise<SessionReport[]> => {
    const response = await api.get<{
        success: boolean;
        reports: SessionReport[];
    }>('/dashboard/reports', { params: filters });

    return response.data.reports;
};

/**
 * Marquer un rapport comme lu
 */
export const markReportAsRead = async (reportId: string): Promise<{ readAt: string }> => {
    const response = await api.patch<{
        success: boolean;
        reportId: string;
        readAt: string;
    }>(`/dashboard/report/${reportId}/read`);

    return { readAt: response.data.readAt };
};

export default {
    getPatients,
    getPatientConversations,
    getPatientLiveConversation,
    getReports,
    markReportAsRead,
};
