import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import COLORS from '../../utils/colors';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
}) => {
    const variantStyles: Record<string, ViewStyle> = {
        primary: { backgroundColor: COLORS.primary[600] },
        secondary: { backgroundColor: COLORS.secondary[600] },
        danger: { backgroundColor: COLORS.error },
        outline: { borderWidth: 2, borderColor: COLORS.primary[600], backgroundColor: 'transparent' },
    };

    const sizeStyles: Record<string, ViewStyle> = {
        sm: { paddingHorizontal: 16, paddingVertical: 8 },
        md: { paddingHorizontal: 24, paddingVertical: 12 },
        lg: { paddingHorizontal: 32, paddingVertical: 16 },
    };

    const textVariantStyles: Record<string, TextStyle> = {
        primary: { color: COLORS.text.inverse },
        secondary: { color: COLORS.text.inverse },
        danger: { color: COLORS.text.inverse },
        outline: { color: COLORS.primary[600] },
    };

    const textSizeStyles: Record<string, TextStyle> = {
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={{
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                ...variantStyles[variant],
                ...sizeStyles[size],
                opacity: disabled || loading ? 0.5 : 1,
            }}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? COLORS.primary[600] : COLORS.text.inverse} />
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
        </TouchableOpacity>
    );
};

export default Button;
