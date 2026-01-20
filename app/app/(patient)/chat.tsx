import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useChat } from '../../hooks/useChat';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import Button from '../../components/ui/Button';

export default function ChatScreen() {
    const { conversation, isLoading, isSending, startConversation, sendMessage, endConversation } =
        useChat();
    const [showTyping, setShowTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Auto-démarrage au montage
        if (!conversation) {
            startConversation();
        }
    }, []);

    const handleSend = async (message: string) => {
        if (!conversation) return;

        setShowTyping(true);
        try {
            await sendMessage(conversation.id, message);
        } finally {
            setShowTyping(false);
        }
    };

    const handleEnd = async () => {
        if (!conversation) return;
        // TODO: Ajouter confirmation dialog
        await endConversation(conversation.id);
    };

    if (isLoading && !conversation) {
        return (
            <View 
                className="flex-1 items-center justify-center bg-white"
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                }}
            >
                <Text 
                    className="text-secondary-600"
                    style={{
                        color: '#4B5563',
                        fontSize: 16,
                    }}
                >
                    Préparation...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView 
            className="flex-1 bg-white"
            style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
            }}
        >
            {conversation?.isBeingViewedByPro && (
                <View 
                    className="bg-blue-50 px-4 py-2"
                    style={{
                        backgroundColor: '#EFF6FF',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                    }}
                >
                    <Text 
                        className="text-blue-700 text-sm"
                        style={{
                            color: '#1D4ED8',
                            fontSize: 14,
                        }}
                    >
                        🔵 Votre thérapeute consulte cette conversation
                    </Text>
                </View>
            )}

            <FlatList
                ref={flatListRef}
                data={conversation?.messages || []}
                keyExtractor={(item, index) => item._id || item.id || `message-${index}`}
                renderItem={({ item }) => (
                    <ChatBubble
                        sender={item.sender}
                        text={item.text}
                        timestamp={item.timestamp}
                        gravityScore={item.gravityScore}
                    />
                )}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListFooterComponent={showTyping ? <TypingIndicator /> : null}
            />

            {conversation?.status === 'active' && (
                <>
                    <ChatInput onSend={handleSend} disabled={isSending} />

                    <View 
                        className="px-4 pb-2"
                        style={{
                            paddingHorizontal: 16,
                            paddingBottom: 16, // More space from bottom
                        }}
                    >
                        <Button
                            title="Terminer la conversation"
                            onPress={handleEnd}
                            variant="danger"
                            size="sm"
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
