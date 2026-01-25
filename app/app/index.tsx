import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const { width } = Dimensions.get('window');

    // Keep the redirection logic for authenticated users
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            if (user?.role === 'patient') {
                router.replace('/(patient)/chat');
            } else if (user?.role === 'pro') {
                router.replace('/(pro)/dashboard');
            }
        }
    }, [isLoading, isAuthenticated, user]);

    // Show loading state briefly or if checking auth
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-blue-600">
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    // If authenticated, we return null while the useEffect redirects (prevent flash)
    if (isAuthenticated) return null;

    return (
        <View className="flex-1 bg-blue-600">
            <StatusBar style="light" />

            <SafeAreaView className="flex-1 p-6 flex-col justify-center items-center">

                {/* Main Content Section */}
                <View className="w-full space-y-12 items-center">
                    {/* Main Text */}
                    <View>
                        <Text className="text-white text-5xl font-bold text-center leading-[1.2]">
                            Prenez soin{'\n'}de vous{' '}
                            <Text className="italic text-blue-200">simplement</Text>{'\n'}
                            et rapidement.
                        </Text>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        className="w-full bg-white py-5 rounded-full items-center shadow-lg active:scale-95 transition-all"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },
                            shadowOpacity: 0.30,
                            shadowRadius: 4.65,
                            elevation: 8,
                        }}
                    >
                        <Text className="text-blue-600 text-xl font-bold tracking-wide">
                            Commencer
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
