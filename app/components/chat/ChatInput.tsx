import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MESSAGE_CONSTRAINTS } from '../../utils/constants';
import COLORS from '../../utils/colors';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    disabled = false,
    placeholder = 'Écrivez votre message...',
}) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const borderColorAnim = useRef(new Animated.Value(0)).current;

    const isValid = message.trim().length > 0 && message.length <= MESSAGE_CONSTRAINTS.MAX_LENGTH;

    useEffect(() => {
        // Animate border color on focus
        Animated.timing(borderColorAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    useEffect(() => {
        // Animate button when message is valid
        if (isValid) {
            Animated.spring(scaleAnim, {
                toValue: 1.05,
                friction: 3,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }).start();
        }
    }, [isValid]);

    const handleSend = () => {
        if (message.trim().length === 0) return;
        if (message.length > MESSAGE_CONSTRAINTS.MAX_LENGTH) return;

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Rotation animation
        Animated.sequence([
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }),
        ]).start();

        onSend(message.trim());
        setMessage('');
    };

    const borderColor = borderColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.slate[300], COLORS.primary[500]],
    });

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View
                className="bg-white p-4"
                style={{
                    backgroundColor: COLORS.background.primary,
                    padding: 16,
                    paddingBottom: 24,
                }}
            >
                <View
                    className="flex-row items-end"
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            marginRight: 8,
                        }}
                    >
                        <Animated.View
                            style={{
                                borderWidth: 2,
                                borderColor: borderColor,
                                borderRadius: 999,
                                backgroundColor: '#FFFFFF',
                                shadowColor: isFocused ? COLORS.primary[600] : '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isFocused ? 0.15 : 0.08,
                                shadowRadius: isFocused ? 6 : 4,
                                elevation: isFocused ? 5 : 3,
                            }}
                        >
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                onFocus={() => {
                                    setIsFocused(true);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholder}
                                placeholderTextColor={COLORS.slate[400]}
                                multiline
                                maxLength={MESSAGE_CONSTRAINTS.MAX_LENGTH}
                                editable={!disabled}
                                style={{
                                    minHeight: 44,
                                    paddingHorizontal: 20,
                                    paddingVertical: 12,
                                    maxHeight: 100,
                                    fontSize: 16,
                                    color: COLORS.slate[900],
                                }}
                            />
                        </Animated.View>
                        {message.length > MESSAGE_CONSTRAINTS.MAX_LENGTH * 0.9 && (
                            <Animated.Text
                                style={{
                                    fontSize: 12,
                                    color: message.length >= MESSAGE_CONSTRAINTS.MAX_LENGTH ? COLORS.error : COLORS.slate[500],
                                    marginTop: 4,
                                    fontWeight: message.length >= MESSAGE_CONSTRAINTS.MAX_LENGTH ? '600' : '400',
                                }}
                            >
                                {message.length} / {MESSAGE_CONSTRAINTS.MAX_LENGTH}
                            </Animated.Text>
                        )}
                    </View>

                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }, { rotate: rotation }],
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!isValid || disabled}
                            activeOpacity={0.8}
                        >
                            {isValid && !disabled ? (
                                <LinearGradient
                                    colors={COLORS.gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: COLORS.primary[600],
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 6,
                                        elevation: 6,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.text.inverse,
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        ↑
                                    </Text>
                                </LinearGradient>
                            ) : (
                                <View
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: COLORS.slate[300],
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.text.inverse,
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        ↑
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatInput;
