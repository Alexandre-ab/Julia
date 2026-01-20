import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import COLORS from '../../utils/colors';

interface Conversation {
    _id: string;
    status: 'active' | 'ended';
    createdAt: string;
    updatedAt: string;
    messagesCount: number;
    highestGravityScore: number;
}

export default function HistoryScreen() {
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

    const getGravityColor = (score: number) => {
        if (score === 3) return COLORS.gravity.critical;
        if (score === 2) return COLORS.gravity.vigilance;
        return COLORS.gravity.stable;
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

    const renderConversation = ({ item }: { item: Conversation }) => (
        <View
            style={{
                backgroundColor: COLORS.background.primary,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: COLORS.border.light,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text.primary }}>
                    {formatDate(item.createdAt)}
                </Text>
                <View
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: getGravityColor(item.highestGravityScore),
                    }}
                />
            </View>
            
            <Text style={{ fontSize: 14, color: COLORS.text.secondary, marginBottom: 4 }}>
                {formatTime(item.createdAt)} - {formatTime(item.updatedAt)}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 13, color: COLORS.text.tertiary }}>
                    💬 {item.messagesCount || 0} messages
                </Text>
                <Text style={{ fontSize: 13, color: COLORS.text.tertiary, marginLeft: 16 }}>
                    {item.status === 'active' ? '🟢 Active' : '⚪ Terminée'}
                </Text>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary[600]} />
                <Text style={{ color: COLORS.text.secondary, marginTop: 12 }}>Chargement...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    padding: 24,
                }}
            >
                <Text style={{ fontSize: 18, color: COLORS.error, marginBottom: 8 }}>❌ Erreur</Text>
                <Text style={{ color: COLORS.text.secondary, textAlign: 'center' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background.secondary }}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item._id}
                renderItem={renderConversation}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 48,
                        }}
                    >
                        <Text style={{ fontSize: 48, marginBottom: 16 }}>📝</Text>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 }}>
                            Aucune conversation
                        </Text>
                        <Text style={{ color: COLORS.text.secondary, textAlign: 'center', paddingHorizontal: 32 }}>
                            Commencez une conversation dans l'onglet Chat
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
