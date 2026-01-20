import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import COLORS from '../../utils/colors';

export default function ProLayout() {
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
                name="dashboard"
                options={{
                    title: 'Mes Patients',
                    tabBarLabel: 'Patients',
                    tabBarIcon: ({ color }) => <Text style={{ color }}>👥</Text>,
                }}
            />
            <Tabs.Screen
                name="invite"
                options={{
                    title: 'Inviter un patient',
                    tabBarLabel: 'Inviter',
                    tabBarIcon: ({ color }) => <Text style={{ color }}>➕</Text>,
                }}
            />
            <Tabs.Screen
                name="patient"
                options={{
                    href: null, // Masquer de la tab bar
                }}
            />
        </Tabs>
    );
}
