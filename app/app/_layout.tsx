import '../global.css';
import { cssInterop } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

cssInterop(LinearGradient, {
    className: {
        target: 'style',
    },
});

import { View, ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
} from '@expo-google-fonts/playfair-display';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'Jakarta': PlusJakartaSans_400Regular,
        'Jakarta-Medium': PlusJakartaSans_500Medium,
        'Jakarta-SemiBold': PlusJakartaSans_600SemiBold,
        'Jakarta-Bold': PlusJakartaSans_700Bold,
        'Jakarta-ExtraBold': PlusJakartaSans_800ExtraBold,
        'Playfair-Bold': PlayfairDisplay_700Bold,
        'Playfair-ExtraBold': PlayfairDisplay_800ExtraBold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7D5259' }}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <Slot />
                    </NotificationProvider>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
