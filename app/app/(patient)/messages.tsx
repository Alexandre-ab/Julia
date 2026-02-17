import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getPatientMessages, markMessageAsRead } from '../../services/message.service';
import { PractitionerMessage } from '../../types/message.types';
import { useTheme } from '../../contexts/ThemeContext';
import AnimatedCard from '../../components/ui/AnimatedCard';
import EmptyState from '../../components/ui/EmptyState';
import COLORS from '../../utils/colors';

export default function MessagesScreen() {
    const { colors: t, isDark } = useTheme();
    const [messages, setMessages] = useState<PractitionerMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            setIsLoading(true);
            const data = await getPatientMessages();
            setMessages(data);
        } catch (error) {
            console.error('Erreur chargement messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadMessages();
        setIsRefreshing(false);
    };

    const handleMessagePress = async (message: PractitionerMessage) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        const isExpanding = expandedMessageId !== message.id;
        setExpandedMessageId(isExpanding ? message.id : null);

        // Marquer comme lu si non lu
        if (!message.isRead && isExpanding) {
            try {
                await markMessageAsRead(message.id);
                setMessages(prev => 
                    prev.map(m => m.id === message.id ? { ...m, isRead: true, readAt: new Date().toISOString() } : m)
                );
            } catch (error) {
                console.error('Erreur marquage message:', error);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (diffInHours < 48) {
            return 'Hier';
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
            });
        }
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bgSecondary }} edges={['top']}>
            {/* Header avec gradient */}
            <LinearGradient
                colors={isDark ? ['#3F282D', '#261B1E'] : COLORS.gradients.header as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingHorizontal: 24,
                    paddingTop: 20,
                    paddingBottom: 24,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                            Messages
                        </Text>
                        <Text style={{ fontSize: 15, color: COLORS.primary[100] }}>
                            Retours de votre thérapeute
                        </Text>
                    </View>
                    {unreadCount > 0 && (
                        <View
                            style={{
                                minWidth: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: COLORS.rose[500],
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 10,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>
                                {unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ 
                    padding: 16,
                    paddingBottom: 100,
                }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            >
                {isLoading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
                        <ActivityIndicator size="large" color={COLORS.primary[600]} />
                        <Text style={{ color: COLORS.text.secondary, marginTop: 12 }}>
                            Chargement...
                        </Text>
                    </View>
                ) : messages.length === 0 ? (
                    <EmptyState
                        icon="mail-outline"
                        title="Aucun message"
                        description="Vous n'avez pas encore recu de messages de votre therapeute"
                    />
                ) : (
                    messages.map((message, index) => {
                        const isExpanded = expandedMessageId === message.id;
                        return (
                            <AnimatedCard
                                key={message.id}
                                onPress={() => handleMessagePress(message)}
                                useGradient={true}
                                gradientColors={message.isRead ? COLORS.gradients.card : ['#FFFFFF', '#F0F4FF']}
                                delay={index * 50}
                                style={{ marginBottom: 12 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    {/* Avatar du thérapeute */}
                                    <View
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 24,
                                            backgroundColor: COLORS.primary[100],
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 12,
                                        }}
                                    >
                                        <Ionicons name="person" size={24} color={COLORS.primary[700]} />
                                    </View>

                                    {/* Contenu */}
                                    <View style={{ flex: 1 }}>
                                        {/* Header */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ 
                                                fontSize: 16, 
                                                fontWeight: 'bold', 
                                                color: COLORS.text.primary,
                                                flex: 1,
                                            }}>
                                                {message.subject}
                                            </Text>
                                            {!message.isRead && (
                                                <View
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: COLORS.primary[600],
                                                        marginLeft: 8,
                                                    }}
                                                />
                                            )}
                                        </View>

                                        {/* Preview ou contenu complet */}
                                        <Text
                                            style={{ 
                                                fontSize: 14, 
                                                color: COLORS.text.secondary,
                                                lineHeight: 20,
                                                marginBottom: 8,
                                            }}
                                            numberOfLines={isExpanded ? undefined : 2}
                                        >
                                            {message.content}
                                        </Text>

                                        {/* Footer */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons 
                                                    name="time-outline" 
                                                    size={14} 
                                                    color={COLORS.text.tertiary} 
                                                    style={{ marginRight: 4 }} 
                                                />
                                                <Text style={{ fontSize: 12, color: COLORS.text.tertiary }}>
                                                    {formatDate(message.createdAt)}
                                                </Text>
                                            </View>

                                            {message.conversationId && (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        backgroundColor: COLORS.primary[50],
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 4,
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    <Ionicons 
                                                        name="chatbubble" 
                                                        size={12} 
                                                        color={COLORS.primary[700]} 
                                                        style={{ marginRight: 4 }} 
                                                    />
                                                    <Text style={{ fontSize: 11, color: COLORS.primary[700], fontWeight: '600' }}>
                                                        Séance
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Indicateur expand/collapse */}
                                        {message.content.length > 100 && (
                                            <View style={{ alignItems: 'center', marginTop: 12 }}>
                                                <Ionicons 
                                                    name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                                                    size={20} 
                                                    color={COLORS.primary[600]} 
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </AnimatedCard>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
