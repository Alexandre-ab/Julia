import '../global.css';
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
