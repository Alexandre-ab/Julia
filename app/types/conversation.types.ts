export type MessageSender = 'user' | 'ai';
export type ConversationStatus = 'active' | 'ended';

export interface Message {
    _id?: string; // MongoDB ID
    id?: string;  // Alternative ID
    sender: MessageSender;
    text: string;
    timestamp: string;
    gravityScore?: number;
}

export interface Conversation {
    id: string;
    patientId: string;
    messages: Message[];
    status: ConversationStatus;
    startedAt: string;
    endedAt?: string;
    highestGravityScore: number;
    reportGenerated: boolean;
    isBeingViewedByPro: boolean;
    messageCount?: number;
}

export interface SendMessageRequest {
    conversationId: string;
    message: string;
}

export interface SendMessageResponse {
    success: boolean;
    userMessage: Message;
    aiMessage: Message;
    highestGravityScore: number;
    reportTriggered: boolean;
    reportId?: string;
}

export interface ConversationSummary {
    id: string;
    startedAt: string;
    endedAt?: string;
    messageCount: number;
    highestGravityScore: number;
}
