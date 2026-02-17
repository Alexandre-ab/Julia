import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getPatients } from '../../services/dashboard.service';
import { PatientStats } from '../../types/report.types';
import PatientCard from '../../components/dashboard/PatientCard';
import AnimatedCard from '../../components/ui/AnimatedCard';
import EmptyState from '../../components/ui/EmptyState';
import { useTheme } from '../../contexts/ThemeContext';
import COLORS from '../../utils/colors';
import { useAuth } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');
const isLargeScreen = width >= 768; // Tablette/PC

export default function DashboardScreen() {
    const { user } = useAuth();
    const { colors: t, isDark } = useTheme();
    const [patients, setPatients] = useState<PatientStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            setIsLoading(true);
            const data = await getPatients();
            setPatients(data);
        } catch (error) {
            console.error('Erreur chargement patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadPatients();
        setIsRefreshing(false);
    };

    // Calcul des statistiques
    const totalPatients = patients.length;
    const activeConversations = patients.filter(p => p.activeConversation).length;
    const criticalPatients = patients.filter(p => p.highestGravityScore === 3).length;
    const vigilancePatients = patients.filter(p => p.highestGravityScore === 2).length;

    const StatCard = ({ title, value, icon, color, onPress }: any) => (
        <AnimatedCard
            onPress={onPress}
            useGradient={false}
            style={{
                flex: 1,
                marginHorizontal: 6,
                marginBottom: 12,
                minWidth: isLargeScreen ? 200 : 150,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, color: COLORS.text.tertiary, marginBottom: 8 }}>
                        {title}
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary }}>
                        {value}
                    </Text>
                </View>
                <View
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: color + '20',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons name={icon} size={28} color={color} />
                </View>
            </View>
        </AnimatedCard>
    );

    return (
        <View style={{ flex: 1, backgroundColor: t.bgSecondary }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Header avec gradient */}
                <LinearGradient
                    colors={isDark ? ['#3F282D', '#261B1E'] : COLORS.gradients.header as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        paddingTop: 60,
                        paddingBottom: 32,
                        paddingHorizontal: 24,
                    }}
                >
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 }}>
                        Tableau de bord
                    </Text>
                    <Text style={{ fontSize: 16, color: COLORS.primary[100] }}>
                        Bonjour Dr. {user?.firstName} {user?.lastName}
                    </Text>
                </LinearGradient>

                <View style={{ marginTop: -20, paddingHorizontal: isLargeScreen ? 32 : 16 }}>
                    {/* Statistiques */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 24 }}
                        contentContainerStyle={{ paddingHorizontal: isLargeScreen ? 0 : 10 }}
                    >
                        <StatCard
                            title="Total patients"
                            value={totalPatients}
                            icon="people"
                            color={COLORS.primary[600]}
                        />
                        <StatCard
                            title="Conversations actives"
                            value={activeConversations}
                            icon="chatbubbles"
                            color={COLORS.emerald[600]}
                        />
                        <StatCard
                            title="Vigilance"
                            value={vigilancePatients}
                            icon="warning"
                            color={COLORS.warning}
                        />
                        <StatCard
                            title="Critique"
                            value={criticalPatients}
                            icon="alert-circle"
                            color={COLORS.error}
                        />
                    </ScrollView>

                    {/* Actions rapides */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ 
                            fontSize: 20, 
                            fontWeight: 'bold', 
                            color: t.text,
                            marginBottom: 16,
                        }}>
                            Actions rapides
                        </Text>
                        
                        <View style={{ 
                            flexDirection: isLargeScreen ? 'row' : 'column',
                            gap: 12,
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    router.push('/(pro)/invite');
                                }}
                                style={{ flex: 1 }}
                            >
                                <LinearGradient
                                    colors={COLORS.gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 20,
                                        borderRadius: 16,
                                        shadowColor: COLORS.primary[600],
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 24,
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 16,
                                        }}
                                    >
                                        <Ionicons name="person-add" size={24} color="#FFFFFF" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                                            Inviter un patient
                                        </Text>
                                        <Text style={{ fontSize: 14, color: COLORS.primary[100] }}>
                                            Générer un lien d'invitation
                                        </Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Liste des patients */}
                    <View style={{ marginBottom: 100 }}>
                        <Text style={{ 
                            fontSize: 20, 
                            fontWeight: 'bold', 
                            color: t.text,
                            marginBottom: 16,
                        }}>
                            Mes patients ({totalPatients})
                        </Text>

                        {isLoading ? (
                            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                                <Text style={{ color: COLORS.text.secondary }}>Chargement...</Text>
                            </View>
                        ) : patients.length === 0 ? (
                            <EmptyState
                                icon="people-outline"
                                title="Aucun patient"
                                description="Invitez votre premier patient pour commencer"
                                action={
                                    <TouchableOpacity
                                        onPress={() => router.push('/(pro)/invite')}
                                        style={{
                                            backgroundColor: COLORS.primary[600],
                                            paddingHorizontal: 24,
                                            paddingVertical: 14,
                                            borderRadius: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Ionicons name="person-add" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16, fontFamily: 'Jakarta-SemiBold' }}>
                                            Inviter un patient
                                        </Text>
                                    </TouchableOpacity>
                                }
                            />
                        ) : (
                            <View>
                                {patients.map((patient, index) => (
                                    <View
                                        key={patient.id}
                                        style={{
                                            marginBottom: 12,
                                        }}
                                    >
                                        <PatientCard
                                            patient={patient}
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                router.push(`/(pro)/patient/${patient.id}`);
                                            }}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
