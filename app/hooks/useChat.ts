import { useState, useCallback } from 'react';
import * as chatService from '../services/chat.service';
import { Conversation, SendMessageRequest } from '../types/conversation.types';

/**
 * Hook pour gérer une conversation de chat
 */
export const useChat = () => {
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Démarrer une nouvelle conversation
     */
    const startConversation = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const { conversationId, startedAt } = await chatService.startConversation();

            // Créer une conversation vide
            setConversation({
                id: conversationId,
                patientId: '', // Sera défini côté backend
                messages: [],
                status: 'active',
                startedAt,
                highestGravityScore: 1,
                reportGenerated: false,
                isBeingViewedByPro: false,
            });

            return conversationId;
        } catch (err: any) {
            setError(err.message || 'Erreur lors du démarrage de la conversation');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Envoyer un message
     */
    const sendMessage = useCallback(
        async (conversationId: string, message: string) => {
            try {
                setIsSending(true);
                setError(null);

                const data: SendMessageRequest = { conversationId, message };
                const response = await chatService.sendMessage(data);

                // Mettre à jour la conversation avec les nouveaux messages
                setConversation((prev) => {
                    if (!prev) return null;

                    return {
                        ...prev,
                        messages: [...prev.messages, response.userMessage, response.aiMessage],
                        highestGravityScore: response.highestGravityScore,
                    };
                });

                return response;
            } catch (err: any) {
                setError(err.message || 'Erreur lors de l\'envoi du message');
                throw err;
            } finally {
                setIsSending(false);
            }
        },
        []
    );

    /**
     * Terminer la conversation
     */
    const endConversation = useCallback(async (conversationId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await chatService.endConversation(conversationId);

            // Mettre à jour le statut
            setConversation((prev) => {
                if (!prev) return null;

                return {
                    ...prev,
                    status: 'ended',
                    endedAt: result.endedAt,
                };
            });

            return result;
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la fin de la conversation');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Charger une conversation existante
     */
    const loadConversation = useCallback(async (conversationId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const conv = await chatService.getConversation(conversationId);
            setConversation(conv);

            return conv;
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement de la conversation');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Réinitialiser le hook
     */
    const reset = useCallback(() => {
        setConversation(null);
        setError(null);
        setIsLoading(false);
        setIsSending(false);
    }, []);

    return {
        conversation,
        isLoading,
        isSending,
        error,
        startConversation,
        sendMessage,
        endConversation,
        loadConversation,
        reset,
    };
};

export default useChat;
