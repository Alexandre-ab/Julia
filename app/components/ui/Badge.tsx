import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
}) => {
    const variantClasses = {
        default: 'bg-secondary-100 text-secondary-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-orange-100 text-orange-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    const baseClasses = 'rounded-full font-semibold';

    return (
        <View className={`self-start ${className}`}>
            <Text className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
                {children}
            </Text>
        </View>
    );
};

export default Badge;
