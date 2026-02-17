import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import COLORS from '../../utils/colors';

interface AnimatedCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    useGradient?: boolean;
    gradientColors?: readonly string[] | string[];
    delay?: number;
    style?: ViewStyle;
    useHaptics?: boolean;
    disabled?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    onPress,
    useGradient = false,
    gradientColors = COLORS.gradients.card,
    delay = 0,
    style = {},
    useHaptics = true,
    disabled = false,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                delay,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        if (useHaptics) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    const baseStyle: ViewStyle = {
        borderRadius: 16,
        padding: 20,
        shadowColor: COLORS.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        ...style,
    };

    const animatedStyle = {
        transform: [{ scale: scaleAnim }, { translateY }],
        opacity: fadeAnim,
    };

    if (useGradient) {
        if (onPress && !disabled) {
            return (
                <Animated.View style={animatedStyle}>
                    <TouchableOpacity
                        onPress={handlePress}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.9}
                        disabled={disabled}
                    >
                        <LinearGradient
                            colors={gradientColors as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={baseStyle}
                        >
                            {children}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        return (
            <Animated.View style={animatedStyle}>
                <LinearGradient
                    colors={gradientColors as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={baseStyle}
                >
                    {children}
                </LinearGradient>
            </Animated.View>
        );
    }

    if (onPress && !disabled) {
        return (
            <Animated.View style={animatedStyle}>
                <TouchableOpacity
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.9}
                    disabled={disabled}
                    style={{
                        ...baseStyle,
                        backgroundColor: COLORS.background.primary,
                    }}
                >
                    {children}
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <Animated.View 
            style={[
                animatedStyle,
                {
                    ...baseStyle,
                    backgroundColor: COLORS.background.primary,
                }
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedCard;
