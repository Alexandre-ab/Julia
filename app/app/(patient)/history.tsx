import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import api from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import COLORS from '../../utils/colors';
import AnimatedCard from '../../components/ui/AnimatedCard';
import GravityBadge from '../../components/dashboard/GravityBadge';
import EmptyState from '../../components/ui/EmptyState';
import {LinearGradient} from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Conversation {
    id: string;
    status: 'active' | 'ended';
    createdAt: string;
    updatedAt: string;
    messagesCount: number;
    highestGravityScore: number;
}

export default function HistoryScreen() {
    const { colors: t, isDark } = useTheme();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/chat/history');
            setConversations(response.data.conversations || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur de chargement');
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

    const handleOpenConversation = (conversationId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/(patient)/${conversationId}`);
    };

    const renderConversation = ({ item, index }: { item: Conversation; index: number }) => (
        <AnimatedCard
            onPress={() => handleOpenConversation(item.id)}
            useGradient={!isDark}
            gradientColors={COLORS.gradients.card}
            delay={index * 50}
            style={{
                marginBottom: 16,
                borderWidth: 1,
                borderColor: t.border,
                backgroundColor: isDark ? t.bgCard : undefined,
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: t.text, marginBottom: 4, fontFamily: 'Jakarta-Bold' }}>
                        {formatDate(item.createdAt)}
                    </Text>
                    <Text style={{ fontSize: 14, color: t.textSecondary, fontFamily: 'Jakarta' }}>
                        {formatTime(item.createdAt)} - {formatTime(item.updatedAt)}
                    </Text>
                </View>
                <GravityBadge score={item.highestGravityScore as 1 | 2 | 3} size="sm" showLabel={false} />
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: t.border,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDark ? COLORS.primary[900] + '40' : COLORS.primary[50],
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                }}>
                    <Ionicons name="chatbubble" size={14} color={COLORS.primary[isDark ? 300 : 700]} style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 13, color: COLORS.primary[isDark ? 300 : 700], fontWeight: '600', fontFamily: 'Jakarta-SemiBold' }}>
                        {item.messagesCount || 0} messages
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 12,
                    backgroundColor: item.status === 'active'
                        ? (isDark ? COLORS.emerald[900] + '40' : COLORS.emerald[50])
                        : (isDark ? COLORS.slate[700] : COLORS.slate[100]),
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                }}>
                    <Ionicons
                        name={item.status === 'active' ? 'radio-button-on' : 'checkmark-circle'}
                        size={12}
                        color={item.status === 'active' ? COLORS.emerald[isDark ? 300 : 600] : t.textSecondary}
                        style={{ marginRight: 4 }}
                    />
                    <Text style={{
                        fontSize: 13,
                        color: item.status === 'active' ? COLORS.emerald[isDark ? 300 : 700] : t.textSecondary,
                        fontWeight: '600',
                        fontFamily: 'Jakarta-SemiBold',
                    }}>
                        {item.status === 'active' ? 'Active' : 'Terminee'}
                    </Text>
                </View>
            </View>
        </AnimatedCard>
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.bg }}>
                <ActivityIndicator size="large" color={COLORS.primary[600]} />
                <Text style={{ color: t.textSecondary, marginTop: 12, fontFamily: 'Jakarta' }}>Chargement...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, backgroundColor: t.bg }}>
                <EmptyState
                    icon="alert-circle-outline"
                    title="Erreur"
                    description={error}
                />
            </View>
        );
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bgSecondary }} edges={['top']}>
            <LinearGradient
                colors={COLORS.gradients.header as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingHorizontal: 24,
                    paddingTop: 20,
                    paddingBottom: 24,
                }}
            >
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                    Historique
                </Text>
                <Text style={{ fontSize: 15, color: COLORS.primary[100] }}>
                    Vos conversations passées
                </Text>
            </LinearGradient>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={renderConversation}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                ListEmptyComponent={
                    <EmptyState
                        icon="document-text-outline"
                        title="Aucune conversation"
                        description="Commencez une conversation dans l'onglet Chat pour voir votre historique ici"
                    />
                }
            />
        </SafeAreaView>
    );
}
