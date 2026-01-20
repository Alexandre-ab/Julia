import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { getPatients } from '../../services/dashboard.service';
import { PatientStats } from '../../types/report.types';
import PatientCard from '../../components/dashboard/PatientCard';

export default function DashboardScreen() {
    const [patients, setPatients] = useState<PatientStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            setIsLoading(true);
            const data = await getPatients();
            setPatients(data);
        } catch (error) {
            console.error('Erreur chargement patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadPatients();
        setIsRefreshing(false);
    };

    return (
        <View className="flex-1 bg-secondary-50">
            <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PatientCard
                        patient={item}
                        onPress={() => router.push(`/(pro)/patient/${item.id}`)}
                    />
                )}
                contentContainerClassName="p-4"
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    <View className="items-center py-12">
                        <Text className="text-secondary-600">Aucun patient</Text>
                    </View>
                }
            />
        </View>
    );
}
