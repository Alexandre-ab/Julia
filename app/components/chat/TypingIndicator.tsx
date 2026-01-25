import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

export const TypingIndicator: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnimation = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animation1 = createAnimation(dot1, 0);
        const animation2 = createAnimation(dot2, 150);
        const animation3 = createAnimation(dot3, 300);

        animation1.start();
        animation2.start();
        animation3.start();

        return () => {
            animation1.stop();
            animation2.stop();
            animation3.stop();
        };
    }, []);

    const createDotStyle = (animatedValue: Animated.Value) => ({
        opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
        }),
        transform: [
            {
                translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                }),
            },
        ],
    });

    return (
        <View className="mb-4 items-start">
            <View className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
                <View className="flex-row items-center space-x-1">
                    <Animated.View
                        style={[createDotStyle(dot1)]}
                        className="w-2 h-2 rounded-full bg-indigo-400 mr-1"
                    />
                    <Animated.View
                        style={[createDotStyle(dot2)]}
                        className="w-2 h-2 rounded-full bg-indigo-400 mr-1"
                    />
                    <Animated.View
                        style={[createDotStyle(dot3)]}
                        className="w-2 h-2 rounded-full bg-indigo-400"
                    />
                </View>
            </View>
            <Text className="text-xs text-slate-500 mt-1 ml-2">Assistant IA est en train d'écrire...</Text>
        </View>
    );
};

export default TypingIndicator;
