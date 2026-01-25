import '../global.css'; // Ensure this is imported first
import { cssInterop } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

// Enable className support for LinearGradient
cssInterop(LinearGradient, {
    className: {
        target: 'style',
    },
});

import { Slot } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <NotificationProvider>
                    <Slot />
                </NotificationProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
