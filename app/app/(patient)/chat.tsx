import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useChat } from '../../hooks/useChat';
import { useTheme } from '../../contexts/ThemeContext';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import EmptyState from '../../components/ui/EmptyState';
import COLORS from '../../utils/colors';
import { router } from 'expo-router';
import { Keyboard,Easing} from 'react-native';

export default function ChatScreen() {
    const { colors: t, isDark } = useTheme();
    const { conversation, isLoading, isSending, startConversation, sendMessage, endConversation } =
        useChat();
    const [showTyping, setShowTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const keyboardHeight = useRef(new Animated.Value(70)).current;

    // SOS button pulse animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.08,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        let mounted = true;
        
        const initConversation = async () => {
            if (!conversation && mounted) {
                await startConversation();
            }
        };
        
        initConversation();
        
        return () => {
            mounted = false;
        };
    }, []);
    useEffect(() => {
        const showListener = Keyboard.addListener('keyboardDidShow', (e) => {
            Animated.timing(keyboardHeight, {
                toValue: e.endCoordinates.height + 70, // Hauteur de la navigation tabs + keyboard height
                duration: e.duration || 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        });
        const hideListener = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(keyboardHeight, {
                toValue: 70, // Hauteur de la navigation tabs
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
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

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        Alert.alert(
            'Terminer la conversation',
            'Êtes-vous sûr de vouloir terminer cette conversation ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Terminer',
                    style: 'destructive',
                    onPress: async () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        await endConversation(conversation.id);
                    }
                },
            ]
        );
    };

    const handleSOS = () => {
        // Strong haptic feedback for urgency
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        
        Alert.alert(
            '🆘 Aide d\'urgence',
            'Besoin d\'aide immédiate ?\n\nNuméro d\'urgence : 3114\n(Numéro national de prévention du suicide)',
            [
                { text: 'Fermer', style: 'cancel' },
            ]
        );
    };

    if (isLoading && !conversation) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: t.bg,
                }}
            >
                <Text
                    style={{
                        color: t.textSecondary,
                        fontSize: 16,
                        fontFamily: 'Jakarta',
                    }}
                >
                    Preparation...
                </Text>
            </View>
        );
    }

    const EmptyListComponent = () => (
        <EmptyState
            icon="chatbubble-ellipses-outline"
            title="Bienvenue"
            description="Je suis la pour vous ecouter. Comment vous sentez-vous aujourd'hui ?"
            action={
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.primary[900] + '40' : COLORS.primary[50],
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: isDark ? COLORS.primary[700] : COLORS.primary[200],
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons name="bulb-outline" size={16} color={COLORS.primary[isDark ? 300 : 700]} style={{ marginRight: 8 }} />
                    <Text
                        style={{
                            color: COLORS.primary[isDark ? 300 : 700],
                            fontSize: 14,
                            fontWeight: '600',
                            fontFamily: 'Jakarta-SemiBold',
                        }}
                    >
                        Ecrivez votre premier message ci-dessous
                    </Text>
                </View>
            }
            style={{ paddingVertical: 80 }}
        />
    );

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: t.bgSecondary,
            }}
        >
            {/* Header with SOS and Close buttons */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: t.bgSecondary,
                }}
            >
                {/* SOS Button - Left with pulse animation */}
                <Animated.View
                    style={{
                        transform: [{ scale: pulseAnim }],
                    }}
                >
                    <TouchableOpacity
                        onPress={handleSOS}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={COLORS.gradients.rose as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 999,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                shadowColor: COLORS.rose[600],
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.4,
                                shadowRadius: 8,
                                elevation: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                    letterSpacing: 0.5,
                                }}
                            >
                                🆘 SOS
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* End Conversation Button - Right */}
                {conversation?.status === 'active' && (
                    <TouchableOpacity
                        onPress={handleEnd}
                        activeOpacity={0.75}
                        style={{
                            borderRadius: 999,
                            paddingHorizontal: 18,
                            paddingVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: isDark ? COLORS.slate[700] : COLORS.slate[200],
                            borderWidth: 1,
                            borderColor: isDark ? COLORS.slate[600] : COLORS.slate[300],
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <Ionicons
                            name="stop-circle-outline"
                            size={16}
                            color={isDark ? COLORS.slate[300] : COLORS.slate[600]}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={{
                                color: isDark ? COLORS.slate[200] : COLORS.slate[700],
                                fontWeight: '600',
                                fontSize: 14,
                                letterSpacing: 0.3,
                                fontFamily: 'Jakarta-SemiBold',
                            }}
                        >
                            Fin
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {conversation?.isBeingViewedByPro && (
                <View
                    style={{
                        backgroundColor: isDark ? COLORS.primary[900] + '40' : COLORS.primary[50],
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons name="eye" size={14} color={COLORS.primary[isDark ? 300 : 700]} style={{ marginRight: 8 }} />
                    <Text
                        style={{
                            color: COLORS.primary[isDark ? 300 : 700],
                            fontSize: 14,
                            fontFamily: 'Jakarta',
                        }}
                    >
                        Votre therapeute consulte cette conversation
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
                style={{
                    flex: 1,
                    marginBottom: 160, // Espace pour l'input (environ 80px) + tabs (70px) + marge
                }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 20,
                    flexGrow: 1,
                }}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListFooterComponent={showTyping ? <TypingIndicator /> : null}
                ListEmptyComponent={EmptyListComponent}
            />

            {conversation?.status === 'active' && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: keyboardHeight, // Hauteur de la navigation tabs + keyboard height
                        left: 0,
                        right: 0,
                        backgroundColor: t.bg,
                        borderTopWidth: 1,
                        borderTopColor: t.border,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 10,
                        zIndex: 100,
                    }}
                >
                    <ChatInput onSend={handleSend} disabled={isSending} />
                </Animated.View>
            )}
        </SafeAreaView>
    );
}
