import React, { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import COLORS from '../../utils/colors';

interface AnimatedButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    useHaptics?: boolean;
    className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    useHaptics = true,
    className = '',
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress();
    };

    const variantStyles: Record<string, ViewStyle> = {
        primary: { backgroundColor: COLORS.primary[600] },
        secondary: { backgroundColor: COLORS.secondary[600] },
        danger: { backgroundColor: COLORS.error },
        outline: { 
            borderWidth: 2, 
            borderColor: COLORS.primary[600], 
            backgroundColor: 'transparent' 
        },
        gradient: {}, // Handled separately
    };

    const sizeStyles: Record<string, ViewStyle> = {
        sm: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
        md: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
        lg: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
    };

    const textVariantStyles: Record<string, TextStyle> = {
        primary: { color: COLORS.text.inverse },
        secondary: { color: COLORS.text.inverse },
        danger: { color: COLORS.text.inverse },
        outline: { color: COLORS.primary[600] },
        gradient: { color: COLORS.text.inverse },
    };

    const textSizeStyles: Record<string, TextStyle> = {
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
    };

    const buttonContent = (
        <>
            {loading ? (
                <ActivityIndicator 
                    color={variant === 'outline' ? COLORS.primary[600] : COLORS.text.inverse} 
                />
            ) : (
                <Text
                    style={{
                        fontWeight: '600',
                        ...textVariantStyles[variant],
                        ...textSizeStyles[size],
                    }}
                >
                    {title}
                </Text>
            )}
        </>
    );

    if (variant === 'gradient') {
        return (
            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                    opacity: disabled || loading ? 0.5 : 1,
                }}
            >
                <TouchableOpacity
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled || loading}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={COLORS.gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: COLORS.primary[600],
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                            ...sizeStyles[size],
                        }}
                    >
                        {buttonContent}
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
            }}
        >
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    ...variantStyles[variant],
                    ...sizeStyles[size],
                    opacity: disabled || loading ? 0.5 : 1,
                }}
            >
                {buttonContent}
            </TouchableOpacity>
        </Animated.View>
    );
};

export default AnimatedButton;
