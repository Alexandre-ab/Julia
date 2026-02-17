import React, { useState } from 'react';
import { View, Text, ScrollView, Share, Alert, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { generateInviteLink } from '../../services/auth.service';
import AnimatedButton from '../../components/ui/AnimatedButton';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useTheme } from '../../contexts/ThemeContext';
import COLORS from '../../utils/colors';

export default function InviteScreen() {
    const { colors: t, isDark } = useTheme();
    const [inviteLink, setInviteLink] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        try {
            setIsLoading(true);
            const result = await generateInviteLink();
            setInviteLink(result.inviteLink);
            setExpiresAt(result.expiresAt);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Erreur génération lien:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Erreur', 'Impossible de générer le lien d\'invitation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        await Clipboard.setStringAsync(inviteLink);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('✅ Copié', 'Le lien a été copié dans le presse-papiers');
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Rejoignez-moi sur Projet J pour un suivi thérapeutique personnalisé :\n\n${inviteLink}`,
                title: 'Invitation Projet J',
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
            console.error('Erreur partage:', error);
        }
    };

    const formatExpiryDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: t.bgSecondary }}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    <View
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <Ionicons name="person-add" size={32} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 }}>
                        Inviter un patient
                    </Text>
                    <Text style={{ fontSize: 16, color: COLORS.primary[100] }}>
                        Générez un lien d'invitation sécurisé
                    </Text>
                </LinearGradient>

                <View style={{ marginTop: -20, paddingHorizontal: 24, paddingBottom: 100 }}>
                    {/* Instructions */}
                    <AnimatedCard
                        useGradient={true}
                        gradientColors={['#FBF2F3', '#F3DADE']}
                        style={{ marginBottom: 24 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: COLORS.primary[200],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="information-circle" size={24} color={COLORS.primary[700]} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary[900], marginBottom: 8 }}>
                                    Comment ça marche ?
                                </Text>
                                <Text style={{ fontSize: 14, color: COLORS.primary[700], lineHeight: 22 }}>
                                    1. Générez un lien unique{'\n'}
                                    2. Envoyez-le à votre patient{'\n'}
                                    3. Le patient créera son compte{'\n'}
                                    4. Vous serez automatiquement connectés
                                </Text>
                            </View>
                        </View>
                    </AnimatedCard>

                    {/* Bouton de génération */}
                    {!inviteLink && (
                        <AnimatedCard style={{ marginBottom: 24, alignItems: 'center', paddingVertical: 40 }}>
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: COLORS.primary[50],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 24,
                                }}
                            >
                                <Ionicons name="link" size={40} color={COLORS.primary[600]} />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 8 }}>
                                Prêt à inviter un patient ?
                            </Text>
                            <Text style={{ fontSize: 14, color: COLORS.text.secondary, textAlign: 'center', marginBottom: 32, paddingHorizontal: 20 }}>
                                Cliquez ci-dessous pour générer un lien d'invitation sécurisé
                            </Text>
                            <AnimatedButton
                                title="Générer un lien d'invitation"
                                onPress={handleGenerate}
                                loading={isLoading}
                                variant="gradient"
                                size="lg"
                            />
                        </AnimatedCard>
                    )}

                    {/* Lien généré */}
                    {inviteLink && (
                        <>
                            <AnimatedCard
                                useGradient={true}
                                gradientColors={['#FFFFFF', '#F0FDF4']}
                                style={{ marginBottom: 16 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    <View
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: COLORS.emerald[100],
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 12,
                                        }}
                                    >
                                        <Ionicons name="checkmark-circle" size={24} color={COLORS.emerald[600]} />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.emerald[700] }}>
                                        Lien généré avec succès !
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        backgroundColor: COLORS.slate[50],
                                        borderRadius: 12,
                                        padding: 16,
                                        marginBottom: 16,
                                        borderWidth: 1,
                                        borderColor: COLORS.border.light,
                                    }}
                                >
                                    <Text style={{ fontSize: 12, color: COLORS.text.tertiary, marginBottom: 8 }}>
                                        Lien d'invitation
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: COLORS.text.primary,
                                            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                                            lineHeight: 20,
                                        }}
                                        selectable
                                    >
                                        {inviteLink}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: COLORS.primary[50],
                                        padding: 12,
                                        borderRadius: 8,
                                        marginBottom: 20,
                                    }}
                                >
                                    <Ionicons name="time-outline" size={20} color={COLORS.primary[700]} style={{ marginRight: 8 }} />
                                    <Text style={{ fontSize: 13, color: COLORS.primary[700], flex: 1 }}>
                                        Expire le {formatExpiryDate(expiresAt)}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <AnimatedButton
                                            title="Copier"
                                            onPress={handleCopy}
                                            variant="outline"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <AnimatedButton
                                            title="Partager"
                                            onPress={handleShare}
                                            variant="gradient"
                                        />
                                    </View>
                                </View>
                            </AnimatedCard>

                            {/* Bouton pour générer un nouveau lien */}
                            <TouchableOpacity
                                onPress={handleGenerate}
                                style={{
                                    alignItems: 'center',
                                    paddingVertical: 16,
                                }}
                            >
                                <Text style={{ fontSize: 15, color: COLORS.primary[600], fontWeight: '600' }}>
                                    Générer un nouveau lien
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
