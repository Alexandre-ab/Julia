import React from 'react';
import { View, Text } from 'react-native';
import { GRAVITY_COLORS, GRAVITY_LABELS } from '../../utils/constants';

interface GravityBadgeProps {
    score: 1 | 2 | 3;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    animated?: boolean;
}

export const GravityBadge: React.FC<GravityBadgeProps> = ({
    score,
    size = 'md',
    showLabel = true,
    animated = false,
}) => {
    const color = GRAVITY_COLORS[score];
    const label = GRAVITY_LABELS[score];

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return (
        <View className="flex-row items-center">
            <View
                className={`${sizeClasses[size]} rounded-full items-center justify-center ${animated && score === 3 ? 'animate-pulse' : ''
                    }`}
                style={{ backgroundColor: color }}
            >
                <Text className={`text-white font-bold ${textSizeClasses[size]}`}>{score}</Text>
            </View>

            {showLabel && (
                <Text className={`ml-2 font-medium ${textSizeClasses[size]}`} style={{ color }}>
                    {label}
                </Text>
            )}
        </View>
    );
};

export default GravityBadge;
