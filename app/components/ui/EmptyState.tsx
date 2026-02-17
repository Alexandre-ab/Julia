import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../utils/colors';
import { useTheme } from '../../contexts/ThemeContext';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    action?: React.ReactNode;
    style?: ViewStyle;
}

export default function EmptyState({ icon, title, description, action, style }: EmptyStateProps) {
    const { colors: t } = useTheme();
    const floatAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const ringAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -8,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Ring pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(ringAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(ringAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const ringScale = ringAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.8],
    });
    const ringOpacity = ringAnim.interpolate({
        inputRange: [0, 0.6, 1],
        outputRange: [0.4, 0.1, 0],
    });

    return (
        <Animated.View
            style={[
                {
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 60,
                    paddingHorizontal: 32,
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
                style,
            ]}
        >
            {/* Floating icon with ring pulse */}
            <Animated.View
                style={{
                    transform: [{ translateY: floatAnim }],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 32,
                }}
            >
                {/* Pulse ring */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: COLORS.primary[300],
                        transform: [{ scale: ringScale }],
                        opacity: ringOpacity,
                    }}
                />
                <LinearGradient
                    colors={[COLORS.primary[50], COLORS.primary[100]]}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: COLORS.primary[600],
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.15,
                        shadowRadius: 16,
                        elevation: 8,
                    }}
                >
                    <Ionicons name={icon} size={44} color={COLORS.primary[500]} />
                </LinearGradient>
            </Animated.View>

            <Text
                style={{
                    color: t.text,
                    textAlign: 'center',
                    fontSize: 22,
                    lineHeight: 28,
                    fontWeight: '700',
                    marginBottom: 12,
                    letterSpacing: -0.3,
                }}
            >
                {title}
            </Text>

            <Text
                style={{
                    color: t.textSecondary,
                    textAlign: 'center',
                    fontSize: 15,
                    lineHeight: 24,
                    maxWidth: 280,
                }}
            >
                {description}
            </Text>

            {action && (
                <View style={{ marginTop: 28 }}>
                    {action}
                </View>
            )}
        </Animated.View>
    );
}
