import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
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
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (animated && score === 3) {
            // Pulse animation for critical score
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [animated, score]);

    const sizeMap = {
        sm: { width: 24, height: 24, fontSize: 12 },
        md: { width: 32, height: 32, fontSize: 14 },
        lg: { width: 40, height: 40, fontSize: 16 },
    };

    const textSizeMap = {
        sm: 12,
        md: 14,
        lg: 16,
    };

    const iconMap = {
        1: '✓',
        2: '!',
        3: '!!',
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Animated.View
                style={{
                    width: sizeMap[size].width,
                    height: sizeMap[size].height,
                    borderRadius: sizeMap[size].width / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: color,
                    transform: animated && score === 3 ? [{ scale: pulseAnim }] : [],
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    elevation: 4,
                }}
            >
                <Text 
                    style={{ 
                        color: '#FFFFFF', 
                        fontWeight: 'bold',
                        fontSize: sizeMap[size].fontSize,
                    }}
                >
                    {iconMap[score]}
                </Text>
            </Animated.View>

            {showLabel && (
                <View
                    style={{
                        marginLeft: 8,
                        backgroundColor: `${color}20`,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: color,
                    }}
                >
                    <Text 
                        style={{ 
                            fontWeight: '600',
                            fontSize: textSizeMap[size],
                            color: color,
                        }}
                    >
                        {label}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default GravityBadge;
