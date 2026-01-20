import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PatientDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-secondary-900 text-lg">Détail patient: {id}</Text>
            <Text className="text-sm text-secondary-500 mt-2">
                TODO: Tabs (Conversations, Rapports, Live)
            </Text>
        </View>
    );
}
