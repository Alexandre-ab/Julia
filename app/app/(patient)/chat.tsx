import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useChat } from '../../hooks/useChat';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import COLORS from '../../utils/colors';
import { router } from 'expo-router';

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

        Alert.alert(
            'Terminer la conversation',
            'Êtes-vous sûr de vouloir terminer cette conversation ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Terminer',
                    style: 'destructive',
                    onPress: async () => {
                        await endConversation(conversation.id);
                    }
                },
            ]
        );
    };

    const handleSOS = () => {
        Alert.alert(
            'Aide d\'urgence',
            'Besoin d\'aide immédiate ?\n\nNuméro d\'urgence : 3114\n(Numéro national de prévention du suicide)',
            [
                { text: 'Fermer', style: 'cancel' },
            ]
        );
    };

    if (isLoading && !conversation) {
        return (
            <View
                className="flex-1 items-center justify-center bg-slate-50"
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.slate[50],
                }}
            >
                <Text
                    className="text-slate-600"
                    style={{
                        color: COLORS.slate[600],
                        fontSize: 16,
                    }}
                >
                    Préparation...
                </Text>
            </View>
        );
    }

    const EmptyListComponent = () => (
        <View
            className="flex-1 items-center justify-center py-20"
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 80,
            }}
        >
            <Text
                className="text-slate-400 text-center text-lg px-8"
                style={{
                    color: COLORS.slate[400],
                    textAlign: 'center',
                    fontSize: 18,
                    lineHeight: 26,
                    paddingHorizontal: 32,
                }}
            >
                Bonjour, je suis là pour vous écouter.{'\n'}Comment vous sentez-vous ?
            </Text>
        </View>
    );

    return (
        <SafeAreaView
            className="flex-1 bg-slate-50"
            style={{
                flex: 1,
                backgroundColor: COLORS.slate[50],
            }}
        >
            {/* Header with SOS and Close buttons */}
            <View
                className="flex-row items-center justify-between px-4 py-3 bg-slate-50"
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: COLORS.slate[50],
                }}
            >
                {/* SOS Button - Left */}
                <TouchableOpacity
                    onPress={handleSOS}
                    className="bg-rose-100 rounded-full px-4 py-2 shadow-sm"
                    style={{
                        backgroundColor: COLORS.rose[100],
                        borderRadius: 999,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                >
                    <Text
                        className="text-rose-600 font-semibold text-sm"
                        style={{
                            color: COLORS.rose[600],
                            fontWeight: '600',
                            fontSize: 14,
                        }}
                    >
                        🆘 SOS
                    </Text>
                </TouchableOpacity>

                {/* Close Button - Right */}
                {conversation?.status === 'active' && (
                    <TouchableOpacity
                        onPress={handleEnd}
                        className="p-2"
                        style={{
                            padding: 8,
                        }}
                    >
                        <Text
                            className="text-slate-500 text-2xl"
                            style={{
                                color: COLORS.slate[500],
                                fontSize: 24,
                            }}
                        >
                            ✕
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {conversation?.isBeingViewedByPro && (
                <View
                    className="bg-indigo-50 px-4 py-2"
                    style={{
                        backgroundColor: COLORS.indigo[50],
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                    }}
                >
                    <Text
                        className="text-indigo-700 text-sm"
                        style={{
                            color: COLORS.indigo[700],
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
                    flexGrow: 1,
                }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListFooterComponent={showTyping ? <TypingIndicator /> : null}
                ListEmptyComponent={EmptyListComponent}
            />

            {conversation?.status === 'active' && (
                <View
                    className="bg-white border-t border-gray-100"
                    style={{
                        backgroundColor: COLORS.background.primary,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.slate[100],
                    }}
                >
                    <ChatInput onSend={handleSend} disabled={isSending} />
                </View>
            )}
        </SafeAreaView>
    );
}
