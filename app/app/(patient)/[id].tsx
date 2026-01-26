import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import api from '../../services/api';
import COLORS from '../../utils/colors';

interface Message {
    _id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    gravityScore?: number;
}

interface ConversationDetail {
    id: string;
    messages: Message[];
    status: string;
    startedAt: string;
    endedAt: string;
    highestGravityScore: number;
}

export default function ConversationDetailScreen() {
    const { id } = useLocalSearchParams();
    const [conversation, setConversation] = useState<ConversationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadConversation();
    }, [id]);

    const loadConversation = async () => {
        try {
            console.log('Loading conversation with ID:', id);
            setIsLoading(true);
            setError('');
            const response = await api.get(`/chat/conversation/${id}`);
            setConversation(response.data.conversation);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur de chargement');
            console.error('Error loading conversation:', err);
            console.error('ID used:', id);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const getGravityColor = (score: number) => {
        if (score === 3) return COLORS.gravity.critical;
        if (score === 2) return COLORS.gravity.vigilance;
        return COLORS.gravity.stable;
    };

    const getGravityLabel = (score: number) => {
        if (score === 3) return 'Critique';
        if (score === 2) return 'Vigilance';
        return 'Stable';
    };

    const renderMessage = (message: Message, index: number) => {
        const isUser = message.sender === 'user';

        return (
            <View
                key={message._id || index}
                style={{
                    flexDirection: 'row',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    marginBottom: 16,
                    paddingHorizontal: 16,
                }}
            >
                <View
                    style={{
                        maxWidth: '80%',
                        backgroundColor: isUser ? COLORS.primary[600] : COLORS.background.primary,
                        borderRadius: 16,
                        padding: 12,
                        borderWidth: isUser ? 0 : 1,
                        borderColor: COLORS.border.light,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            lineHeight: 22,
                            color: isUser ? '#FFFFFF' : COLORS.text.primary,
                        }}
                    >
                        {message.text}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 6,
                            gap: 8,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                color: isUser ? '#FFFFFF99' : COLORS.text.tertiary,
                            }}
                        >
                            {formatTime(message.timestamp)}
                        </Text>
                        {message.gravityScore && message.gravityScore > 1 && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: isUser ? '#FFFFFF22' : COLORS.background.secondary,
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderRadius: 8,
                                }}
                            >
                                <View
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: getGravityColor(message.gravityScore),
                                        marginRight: 4,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontWeight: '600',
                                        color: isUser ? '#FFFFFF' : COLORS.text.secondary,
                                    }}
                                >
                                    {message.gravityScore}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <StatusBar barStyle="dark-content" />
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.border.light,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: 8, marginLeft: -8 }}
                    >
                        <Text style={{ fontSize: 24 }}>←</Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: COLORS.text.primary,
                            marginLeft: 8,
                        }}
                    >
                        Conversation
                    </Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ActivityIndicator size="large" color={COLORS.primary[600]} />
                    <Text style={{ color: COLORS.text.secondary, marginTop: 12 }}>
                        Chargement...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !conversation) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <StatusBar barStyle="dark-content" />
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.border.light,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: 8, marginLeft: -8 }}
                    >
                        <Text style={{ fontSize: 24 }}>←</Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: COLORS.text.primary,
                            marginLeft: 8,
                        }}
                    >
                        Conversation
                    </Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 24,
                    }}
                >
                    <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: COLORS.error,
                            marginBottom: 8,
                        }}
                    >
                        Erreur
                    </Text>
                    <Text
                        style={{
                            color: COLORS.text.secondary,
                            textAlign: 'center',
                        }}
                    >
                        {error || 'Conversation introuvable'}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            marginTop: 24,
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            backgroundColor: COLORS.primary[600],
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Retour</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header avec bouton retour */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border.light,
                    backgroundColor: '#FFFFFF',
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ padding: 8, marginLeft: -8 }}
                >
                    <Text style={{ fontSize: 24 }}>←</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: COLORS.text.primary,
                        }}
                    >
                        {formatDate(conversation.startedAt)}
                    </Text>
                    <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
                        {formatTime(conversation.startedAt)} - {formatTime(conversation.endedAt)}
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: getGravityColor(conversation.highestGravityScore),
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                    }}
                >
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#FFFFFF' }}>
                        {getGravityLabel(conversation.highestGravityScore)}
                    </Text>
                </View>
            </View>

            {/* Informations de la conversation */}
            <View
                style={{
                    backgroundColor: COLORS.background.secondary,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border.light,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: COLORS.text.tertiary }}>
                            💬 {conversation.messages.length} messages
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: COLORS.text.tertiary }}>
                            {conversation.status === 'active' ? '🟢 Active' : '⚪ Terminée'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Liste des messages */}
            <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1, backgroundColor: COLORS.background.secondary }}
                contentContainerStyle={{ paddingVertical: 16 }}
                onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: false })
                }
            >
                {conversation.messages.length === 0 ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 48,
                        }}
                    >
                        <Text style={{ fontSize: 48, marginBottom: 16 }}>💬</Text>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: COLORS.text.primary,
                            }}
                        >
                            Aucun message
                        </Text>
                    </View>
                ) : (
                    conversation.messages.map((message, index) => renderMessage(message, index))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
