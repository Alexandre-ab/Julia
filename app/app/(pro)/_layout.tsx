import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/ui/CustomTabBar';

const PRO_TABS = [
    { name: 'dashboard', label: 'Dashboard', icon: 'grid-outline' as const, iconFocused: 'grid' as const },
    { name: 'invite', label: 'Inviter', icon: 'person-add-outline' as const, iconFocused: 'person-add' as const },
];

export default function ProLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} tabs={PRO_TABS} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Mes Patients',
                    tabBarLabel: 'Dashboard',
                }}
            />
            <Tabs.Screen
                name="invite"
                options={{
                    title: 'Inviter un patient',
                    tabBarLabel: 'Inviter',
                }}
            />
            <Tabs.Screen
                name="patient"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
