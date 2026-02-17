import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import AnimatedButton from '../../components/ui/AnimatedButton';
import AnimatedCard from '../../components/ui/AnimatedCard';
import COLORS from '../../utils/colors';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { colors: t, isDark, toggle, mode } = useTheme();

    const handleLogout = () => {
        logout();
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName || !lastName) return '?';
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: t.bgSecondary }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header with gradient */}
            <LinearGradient
                colors={isDark ? ['#3F282D', '#261B1E'] : COLORS.gradients.header as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: 60,
                    paddingBottom: 40,
                    paddingHorizontal: 24,
                    alignItems: 'center',
                }}
            >
                {/* Avatar */}
                <View
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: isDark ? t.bgElevated : '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.primary[isDark ? 400 : 600], fontFamily: 'Jakarta-Bold' }}>
                        {getInitials(user?.firstName, user?.lastName)}
                    </Text>
                </View>

                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        marginBottom: 4,
                        fontFamily: 'Jakarta-Bold',
                    }}
                >
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        color: COLORS.primary[200],
                        fontFamily: 'Jakarta',
                    }}
                >
                    Patient
                </Text>
            </LinearGradient>

            <View style={{ padding: 24, marginTop: -20 }}>
                {/* Info Cards */}
                <AnimatedCard
                    style={{ marginBottom: 16, backgroundColor: t.bgCard }}
                    delay={100}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: isDark ? COLORS.primary[900] + '60' : COLORS.primary[100],
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 16,
                            }}
                        >
                            <Ionicons name="person" size={24} color={COLORS.primary[isDark ? 300 : 600]} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, color: t.textTertiary, marginBottom: 2, fontFamily: 'Jakarta' }}>
                                Nom complet
                            </Text>
                            <Text style={{ fontSize: 17, fontWeight: '600', color: t.text, fontFamily: 'Jakarta-SemiBold' }}>
                                {user?.firstName} {user?.lastName}
                            </Text>
                        </View>
                    </View>
                </AnimatedCard>

                <AnimatedCard
                    style={{ marginBottom: 16, backgroundColor: t.bgCard }}
                    delay={200}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: isDark ? COLORS.emerald[900] + '60' : COLORS.emerald[100],
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 16,
                            }}
                        >
                            <Ionicons name="mail" size={24} color={COLORS.emerald[isDark ? 300 : 600]} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, color: t.textTertiary, marginBottom: 2, fontFamily: 'Jakarta' }}>
                                Email
                            </Text>
                            <Text style={{ fontSize: 17, fontWeight: '600', color: t.text, fontFamily: 'Jakarta-SemiBold' }}>
                                {user?.email}
                            </Text>
                        </View>
                    </View>
                </AnimatedCard>

                {user?.linkedPro && (
                    <AnimatedCard
                        useGradient={true}
                        gradientColors={isDark ? [COLORS.primary[900], COLORS.primary[900]] : ['#FBF2F3', '#F3DADE']}
                        style={{ marginBottom: 24 }}
                        delay={300}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: isDark ? COLORS.primary[800] : COLORS.primary[200],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="medical" size={24} color={isDark ? COLORS.primary[300] : COLORS.primary[700]} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 13, color: isDark ? COLORS.primary[300] : COLORS.primary[600], marginBottom: 2, fontWeight: '600', fontFamily: 'Jakarta-SemiBold' }}>
                                    Therapeute
                                </Text>
                                <Text style={{ fontSize: 17, fontWeight: '700', color: isDark ? COLORS.primary[100] : COLORS.primary[900], fontFamily: 'Jakarta-Bold' }}>
                                    Dr. {user.linkedPro.firstName} {user.linkedPro.lastName}
                                </Text>
                            </View>
                        </View>
                    </AnimatedCard>
                )}

                {/* Dark Mode Toggle */}
                <AnimatedCard
                    style={{ marginBottom: 24, backgroundColor: t.bgCard }}
                    delay={400}
                >
                    <TouchableOpacity
                        onPress={toggle}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        activeOpacity={0.7}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: isDark ? COLORS.slate[700] : COLORS.slate[100],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons
                                    name={isDark ? 'moon' : 'sunny'}
                                    size={24}
                                    color={isDark ? '#FCD34D' : '#F59E0B'}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 17, fontWeight: '600', color: t.text, fontFamily: 'Jakarta-SemiBold' }}>
                                    Mode sombre
                                </Text>
                                <Text style={{ fontSize: 13, color: t.textTertiary, fontFamily: 'Jakarta' }}>
                                    {isDark ? 'Active' : 'Desactive'}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: 52,
                                height: 30,
                                borderRadius: 15,
                                backgroundColor: isDark ? COLORS.primary[600] : COLORS.slate[200],
                                justifyContent: 'center',
                                paddingHorizontal: 3,
                            }}
                        >
                            <View
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: '#FFFFFF',
                                    alignSelf: isDark ? 'flex-end' : 'flex-start',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </AnimatedCard>

                {/* Logout Button */}
                <AnimatedButton
                    title="Se deconnecter"
                    onPress={handleLogout}
                    variant="outline"
                    size="lg"
                />
            </View>
        </ScrollView>
    );
}
