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
                    paddingBottom: 10,
                    paddingTop: 10,
                    height: 70,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                    borderTopWidth: 0,
                },
            }}
        >
            <Tabs.Screen
                name="chat"
                options={{
                    headerTitle: '',
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>💬</Text>,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Historique',
                    tabBarLabel: 'Historique',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📋</Text>,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarLabel: 'Profil',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👤</Text>,
                }}
            />
        </Tabs>
    );
}
