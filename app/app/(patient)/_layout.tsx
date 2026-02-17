import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/ui/CustomTabBar';

const PATIENT_TABS = [
    { name: 'chat', label: 'Chat', icon: 'chatbubble-outline' as const, iconFocused: 'chatbubble' as const },
    { name: 'history', label: 'Historique', icon: 'time-outline' as const, iconFocused: 'time' as const },
    { name: 'messages', label: 'Messages', icon: 'mail-outline' as const, iconFocused: 'mail' as const },
    { name: 'profile', label: 'Profil', icon: 'person-outline' as const, iconFocused: 'person' as const },
];

export default function PatientLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} tabs={PATIENT_TABS} />}
            screenOptions={{
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name="chat"
                options={{
                    headerTitle: '',
                    tabBarLabel: 'Chat',
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Historique',
                    tabBarLabel: 'Historique',
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarLabel: 'Messages',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarLabel: 'Profil',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="[id]"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
