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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, router } from 'expo-router';
import api from '../../services/api';
import COLORS from '../../utils/colors';
import GravityBadge from '../../components/dashboard/GravityBadge';
import AnimatedButton from '../../components/ui/AnimatedButton';

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
                    <View style={{ marginTop: 24 }}>
                        <AnimatedButton
                            title="Retour"
                            onPress={() => router.back()}
                            variant="gradient"
                            size="lg"
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar barStyle="light-content" />
            
            {/* Header avec gradient et bouton retour */}
            <LinearGradient
                colors={COLORS.gradients.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: 60,
                    paddingBottom: 20,
                    paddingHorizontal: 16,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.back();
                        }}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                            }}
                        >
                            Conversation
                        </Text>
                        <Text style={{ fontSize: 14, color: COLORS.primary[100], marginTop: 2 }}>
                            {formatDate(conversation.startedAt)}
                        </Text>
                    </View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 12,
                        }}
                    >
                        <Ionicons name="time-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '600' }}>
                            {formatTime(conversation.startedAt)} - {formatTime(conversation.endedAt)}
                        </Text>
                    </View>
                    
                    <View style={{ transform: [{ scale: 1.1 }] }}>
                        <GravityBadge 
                            score={conversation.highestGravityScore as 1 | 2 | 3} 
                            size="md" 
                            showLabel={true}
                            animated={conversation.highestGravityScore === 3}
                        />
                    </View>
                </View>
            </LinearGradient>

            {/* Informations de la conversation */}
            <View
                style={{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border.light,
                    marginTop: -10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: COLORS.primary[50],
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <Ionicons name="chatbubbles" size={24} color={COLORS.primary[600]} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text.primary }}>
                            {conversation.messages.length}
                        </Text>
                        <Text style={{ fontSize: 12, color: COLORS.text.tertiary }}>
                            Messages
                        </Text>
                    </View>
                    
                    <View style={{ width: 1, height: 50, backgroundColor: COLORS.border.light }} />
                    
                    <View style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: conversation.status === 'active' ? COLORS.emerald[50] : COLORS.slate[100],
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <Ionicons 
                                name={conversation.status === 'active' ? 'radio-button-on' : 'checkmark-circle'} 
                                size={24} 
                                color={conversation.status === 'active' ? COLORS.emerald[600] : COLORS.slate[500]} 
                            />
                        </View>
                        <Text style={{ 
                            fontSize: 14, 
                            fontWeight: '600',
                            color: conversation.status === 'active' ? COLORS.emerald[700] : COLORS.text.secondary,
                        }}>
                            {conversation.status === 'active' ? 'Active' : 'Terminée'}
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
                            paddingVertical: 80,
                            paddingHorizontal: 32,
                        }}
                    >
                        <View
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: COLORS.slate[100],
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 24,
                            }}
                        >
                            <Text style={{ fontSize: 40 }}>💬</Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: COLORS.text.primary,
                                marginBottom: 8,
                            }}
                        >
                            Aucun message
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: COLORS.text.secondary,
                                textAlign: 'center',
                            }}
                        >
                            Cette conversation ne contient pas encore de messages
                        </Text>
                    </View>
                ) : (
                    conversation.messages.map((message, index) => renderMessage(message, index))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
