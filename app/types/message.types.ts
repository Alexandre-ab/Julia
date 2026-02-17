export interface PractitionerMessage {
    id: string;
    patientId: string;
    practitionerId: string;
    conversationId?: string;
    subject: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    readAt?: string;
}

export interface MessageStats {
    totalMessages: number;
    unreadMessages: number;
    lastMessageAt?: string;
}
