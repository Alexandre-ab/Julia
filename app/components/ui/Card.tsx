import React, { ReactNode } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';

interface CardProps {
    children: ReactNode;
    onPress?: () => void;
    className?: string;
    variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
    children,
    onPress,
    className = '',
    variant = 'default',
}) => {
    const variantClasses = {
        default: 'bg-white',
        outlined: 'bg-white border border-secondary-200',
        elevated: 'bg-white shadow-lg',
    };

    const baseClasses = `rounded-lg p-4 ${variantClasses[variant]}`;

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                className={`${baseClasses} ${className}`}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View className={`${baseClasses} ${className}`}>{children}</View>;
};

export default Card;
