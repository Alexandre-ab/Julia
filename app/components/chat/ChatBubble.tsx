import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSender } from '../../types/conversation.types';
import { formatTime } from '../../utils/formatters';
import { GRAVITY_COLORS } from '../../utils/constants';
import COLORS from '../../utils/colors';

interface ChatBubbleProps {
    sender: MessageSender;
    text: string;
    timestamp: string;
    gravityScore?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    sender,
    text,
    timestamp,
    gravityScore,
}) => {
    const isUser = sender === 'user';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const renderBubbleContent = () => (
        <>
            <Text
                style={{
                    fontSize: 16,
                    lineHeight: 22,
                    color: isUser ? COLORS.text.inverse : COLORS.slate[900],
                }}
            >
                {text}
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 6,
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        color: isUser ? COLORS.primary[100] : COLORS.slate[500],
                    }}
                >
                    {formatTime(timestamp)}
                </Text>

                {gravityScore && gravityScore > 1 && (
                    <View
                        style={{
                            marginLeft: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: isUser ? '#FFFFFF22' : GRAVITY_COLORS[gravityScore as 1 | 2 | 3] + '20',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: GRAVITY_COLORS[gravityScore as 1 | 2 | 3],
                        }}
                    >
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: GRAVITY_COLORS[gravityScore as 1 | 2 | 3],
                                marginRight: 4,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '600',
                                color: isUser ? '#FFFFFF' : GRAVITY_COLORS[gravityScore as 1 | 2 | 3],
                            }}
                        >
                            {gravityScore}
                        </Text>
                    </View>
                )}
            </View>
        </>
    );

    return (
        <Animated.View
            style={{
                marginBottom: 16,
                alignItems: isUser ? 'flex-end' : 'flex-start',
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }}
        >
            {/* Avatar for AI */}
            {!isUser && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        maxWidth: '80%',
                    }}
                >
                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: COLORS.primary[100],
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 8,
                            marginBottom: 4,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>🤖</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                borderRadius: 16,
                                borderTopLeftRadius: 4, // Tail
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                backgroundColor: '#FFFFFF',
                                borderWidth: 1,
                                borderColor: COLORS.slate[200],
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            {renderBubbleContent()}
                        </View>
                        <Text
                            style={{
                                fontSize: 11,
                                color: COLORS.slate[500],
                                marginTop: 4,
                                marginLeft: 8,
                            }}
                        >
                            Assistant IA
                        </Text>
                    </View>
                </View>
            )}

            {/* User message with gradient */}
            {isUser && (
                <LinearGradient
                    colors={COLORS.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        maxWidth: '80%',
                        borderRadius: 16,
                        borderBottomRightRadius: 4, // Tail
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        shadowColor: COLORS.primary[600],
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 5,
                    }}
                >
                    {renderBubbleContent()}
                </LinearGradient>
            )}
        </Animated.View>
    );
};

export default ChatBubble;
