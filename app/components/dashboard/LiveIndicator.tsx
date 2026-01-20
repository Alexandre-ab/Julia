import React from 'react';
import { View, Text } from 'react-native';

interface LiveIndicatorProps {
    isActive: boolean;
    text?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
    isActive,
    text = 'En conversation',
}) => {
    if (!isActive) return null;

    return (
        <View className="flex-row items-center bg-green-50 px-3 py-2 rounded-lg">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            <Text className="text-sm font-medium text-green-700">{text}</Text>
        </View>
    );
};

export default LiveIndicator;
