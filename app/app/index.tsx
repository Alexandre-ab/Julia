import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // Rediriger selon le rôle
    if (user?.role === 'patient') {
        return <Redirect href="/(patient)/chat" />;
    }

    if (user?.role === 'pro') {
        return <Redirect href="/(pro)/dashboard" />;
    }

    return <Redirect href="/(auth)/login" />;
}
