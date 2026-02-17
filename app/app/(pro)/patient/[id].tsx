import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getPatientConversations, getPatientLiveConversation } from '../../../services/dashboard.service';
import { sendMessageToPatient } from '../../../services/pro-message.service';
import { ConversationSummary, Conversation } from '../../../types/conversation.types';
import AnimatedCard from '../../../components/ui/AnimatedCard';
import AnimatedButton from '../../../components/ui/AnimatedButton';
import GravityBadge from '../../../components/dashboard/GravityBadge';
import SendMessageModal from '../../../components/modals/SendMessageModal';
import COLORS from '../../../utils/colors';

const { width } = Dimensions.get('window');
const isLargeScreen = width >= 768;

type TabType = 'conversations' | 'live';

export default function PatientDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('conversations');
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [liveConversation, setLiveConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);

    useEffect(() => {
        loadData();
    }, [id, activeTab]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            if (activeTab === 'conversations') {
                const data = await getPatientConversations(id);
                setConversations(data);
            } else if (activeTab === 'live') {
                const data = await getPatientLiveConversation(id);
                setLiveConversation(data);
            }
        } catch (error) {
            console.error('Erreur chargement données patient:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleTabChange = (tab: TabType) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveTab(tab);
    };

    const handleSendMessage = async (subject: string, content: string, conversationId?: string) => {
        try {
            await sendMessageToPatient(id, { subject, content, conversationId });
            Alert.alert('Succès', 'Message envoyé au patient');
        } catch (error) {
            console.error('Erreur envoi message:', error);
            throw error;
        }
    };

    const openMessageModal = (conversationId?: string) => {
        setSelectedConversationId(conversationId);
        setShowMessageModal(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderConversationItem = ({ item, index }: { item: ConversationSummary; index: number }) => (
        <AnimatedCard
            onPress={() => {
                // TODO: Ouvrir la conversation en détail
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            useGradient={true}
            gradientColors={COLORS.gradients.card}
            delay={index * 50}
            style={{ marginBottom: 16 }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 4 }}>
                        {formatDate(item.startedAt)}
                    </Text>
                    <Text style={{ fontSize: 14, color: COLORS.text.secondary }}>
                        {formatTime(item.startedAt)} {item.endedAt && `- ${formatTime(item.endedAt)}`}
                    </Text>
                </View>
                <GravityBadge score={item.highestGravityScore as 1 | 2 | 3} size="sm" showLabel={false} />
            </View>

            <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: COLORS.border.light,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary[50],
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                }}>
                    <Ionicons name="chatbubbles" size={16} color={COLORS.primary[700]} style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 13, color: COLORS.primary[700], fontWeight: '600' }}>
                        {item.messageCount} messages
                    </Text>
                </View>
            </View>
        </AnimatedCard>
    );

    const renderLiveMessage = (message: any, index: number) => {
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
                {!isUser && (
                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: COLORS.primary[100],
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 8,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>🤖</Text>
                    </View>
                )}
                
                <View style={{ maxWidth: '75%' }}>
                    {isUser ? (
                        <LinearGradient
                            colors={COLORS.gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 16,
                                borderBottomRightRadius: 4,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                            }}
                        >
                            <Text style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 22 }}>
                                {message.text}
                            </Text>
                            <Text style={{ fontSize: 11, color: COLORS.primary[100], marginTop: 4 }}>
                                {formatTime(message.timestamp)}
                            </Text>
                        </LinearGradient>
                    ) : (
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 16,
                                borderTopLeftRadius: 4,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                borderWidth: 1,
                                borderColor: COLORS.slate[200],
                            }}
                        >
                            <Text style={{ fontSize: 15, color: COLORS.text.primary, lineHeight: 22 }}>
                                {message.text}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Text style={{ fontSize: 11, color: COLORS.slate[500] }}>
                                    {formatTime(message.timestamp)}
                                </Text>
                                {message.gravityScore && message.gravityScore > 1 && (
                                    <View
                                        style={{
                                            marginLeft: 8,
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: message.gravityScore === 3 ? COLORS.error : COLORS.warning,
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background.secondary }}>
            {/* Header avec gradient */}
            <LinearGradient
                colors={COLORS.gradients.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: 60,
                    paddingBottom: 20,
                    paddingHorizontal: 24,
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
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }}>
                            Patient
                        </Text>
                        <Text style={{ fontSize: 14, color: COLORS.primary[100], marginTop: 2 }}>
                            ID: {id.substring(0, 8)}...
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => openMessageModal()}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="mail" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Tabs Navigation */}
            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                    marginTop: -10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingTop: 16,
                    paddingHorizontal: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                }}
            >
                <TouchableOpacity
                    onPress={() => handleTabChange('conversations')}
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        alignItems: 'center',
                        borderBottomWidth: 3,
                        borderBottomColor: activeTab === 'conversations' ? COLORS.primary[600] : 'transparent',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons 
                            name="chatbubbles" 
                            size={20} 
                            color={activeTab === 'conversations' ? COLORS.primary[600] : COLORS.text.tertiary}
                        />
                        <Text style={{
                            marginLeft: 8,
                            fontSize: 15,
                            fontWeight: activeTab === 'conversations' ? '700' : '500',
                            color: activeTab === 'conversations' ? COLORS.primary[600] : COLORS.text.tertiary,
                        }}>
                            Conversations
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleTabChange('live')}
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        alignItems: 'center',
                        borderBottomWidth: 3,
                        borderBottomColor: activeTab === 'live' ? COLORS.primary[600] : 'transparent',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: liveConversation ? COLORS.emerald[500] : COLORS.slate[400],
                                marginRight: 8,
                            }}
                        />
                        <Text style={{
                            fontSize: 15,
                            fontWeight: activeTab === 'live' ? '700' : '500',
                            color: activeTab === 'live' ? COLORS.primary[600] : COLORS.text.tertiary,
                        }}>
                            Live
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                {isLoading && !isRefreshing ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color={COLORS.primary[600]} />
                        <Text style={{ color: COLORS.text.secondary, marginTop: 12 }}>
                            Chargement...
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Tab: Conversations */}
                        {activeTab === 'conversations' && (
                            <ScrollView
                                style={{ flex: 1 }}
                                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                                refreshControl={
                                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                                }
                            >
                                {conversations.length === 0 ? (
                                    <AnimatedCard
                                        useGradient={false}
                                        style={{ alignItems: 'center', paddingVertical: 60 }}
                                    >
                                        <View
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 40,
                                                backgroundColor: COLORS.primary[50],
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: 24,
                                            }}
                                        >
                                            <Ionicons name="chatbubbles-outline" size={40} color={COLORS.primary[600]} />
                                        </View>
                                        <Text style={{ 
                                            fontSize: 20, 
                                            fontWeight: 'bold', 
                                            color: COLORS.text.primary,
                                            marginBottom: 8,
                                        }}>
                                            Aucune conversation
                                        </Text>
                                        <Text style={{ 
                                            fontSize: 15,
                                            color: COLORS.text.secondary,
                                            textAlign: 'center',
                                            paddingHorizontal: 32,
                                        }}>
                                            Ce patient n'a pas encore de conversations
                                        </Text>
                                    </AnimatedCard>
                                ) : (
                                    <FlatList
                                        data={conversations}
                                        keyExtractor={(item) => item.id}
                                        renderItem={renderConversationItem}
                                        scrollEnabled={false}
                                    />
                                )}
                            </ScrollView>
                        )}

                        {/* Tab: Live */}
                        {activeTab === 'live' && (
                            <ScrollView
                                style={{ flex: 1 }}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                refreshControl={
                                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                                }
                            >
                                {!liveConversation ? (
                                    <AnimatedCard
                                        useGradient={false}
                                        style={{ 
                                            alignItems: 'center', 
                                            paddingVertical: 60,
                                            margin: 16,
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
                                            <Ionicons name="radio-outline" size={40} color={COLORS.slate[500]} />
                                        </View>
                                        <Text style={{ 
                                            fontSize: 20, 
                                            fontWeight: 'bold', 
                                            color: COLORS.text.primary,
                                            marginBottom: 8,
                                        }}>
                                            Aucune conversation active
                                        </Text>
                                        <Text style={{ 
                                            fontSize: 15,
                                            color: COLORS.text.secondary,
                                            textAlign: 'center',
                                            paddingHorizontal: 32,
                                        }}>
                                            Le patient n'a pas de conversation en cours
                                        </Text>
                                    </AnimatedCard>
                                ) : (
                                    <View style={{ flex: 1 }}>
                                        {/* Live header */}
                                        <View
                                            style={{
                                                backgroundColor: COLORS.emerald[50],
                                                paddingHorizontal: 16,
                                                paddingVertical: 16,
                                                borderBottomWidth: 1,
                                                borderBottomColor: COLORS.emerald[200],
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                                <View
                                                    style={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: 6,
                                                        backgroundColor: COLORS.emerald[500],
                                                        marginRight: 8,
                                                    }}
                                                />
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.emerald[900] }}>
                                                    Conversation en cours
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 14, color: COLORS.emerald[700] }}>
                                                    Démarrée à {formatTime(liveConversation.startedAt)}
                                                </Text>
                                                <GravityBadge 
                                                    score={liveConversation.highestGravityScore as 1 | 2 | 3} 
                                                    size="sm" 
                                                    showLabel={true}
                                                    animated={liveConversation.highestGravityScore === 3}
                                                />
                                            </View>
                                        </View>

                                        {/* Messages */}
                                        <ScrollView
                                            style={{ flex: 1, backgroundColor: COLORS.background.secondary }}
                                            contentContainerStyle={{ paddingVertical: 16 }}
                                        >
                                            {liveConversation.messages.length === 0 ? (
                                                <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                                    <Text style={{ fontSize: 40, marginBottom: 16 }}>💬</Text>
                                                    <Text style={{ fontSize: 16, color: COLORS.text.secondary }}>
                                                        Aucun message pour le moment
                                                    </Text>
                                                </View>
                                            ) : (
                                                liveConversation.messages.map((message, index) =>
                                                    renderLiveMessage(message, index)
                                                )
                                            )}
                                        </ScrollView>

                                        {/* Bouton rafraîchir */}
                                        <View style={{ padding: 16, backgroundColor: '#FFFFFF' }}>
                                            <AnimatedButton
                                                title="Actualiser la conversation"
                                                onPress={handleRefresh}
                                                variant="outline"
                                                loading={isRefreshing}
                                            />
                                        </View>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </>
                )}
            </View>

            {/* Modal d'envoi de message */}
            <SendMessageModal
                visible={showMessageModal}
                patientId={id}
                conversationId={selectedConversationId}
                onClose={() => setShowMessageModal(false)}
                onSend={handleSendMessage}
            />
        </View>
    );
}
