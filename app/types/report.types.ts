export type TriggerReason = 'conversation_ended' | 'high_gravity' | 'message_threshold';
export type ReportStatus = 'unread' | 'read';

export interface SessionReport {
    id: string;
    conversationId: string;
    patientId: string;
    patientName?: string;
    aiSummary: string;
    gravityScore: number;
    keyTopics: string[];
    triggerReason: TriggerReason;
    status: ReportStatus;
    createdAt: string;
    readAt?: string;
}

export interface PatientStats {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastConversationAt?: string;
    highestGravityScore: number;
    unreadReportsCount: number;
    activeConversation: boolean;
}
