import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import COLORS from '../../utils/colors';

export default function PatientLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: COLORS.primary[600],
                tabBarInactiveTintColor: COLORS.text.secondary,
                tabBarStyle: {
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 65,
                },
            }}
        >
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Discussion',
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color }) => <Text style={{ color }}>💬</Text>,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Historique',
                    tabBarLabel: 'Historique',
                    tabBarIcon: ({ color }) => <Text style={{ color }}>📋</Text>,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarLabel: 'Profil',
                    tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
                }}
            />
        </Tabs>
    );
}
