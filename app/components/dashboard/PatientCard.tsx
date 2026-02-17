import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PatientStats } from '../../types/report.types';
import { formatRelativeTime } from '../../utils/formatters';
import GravityBadge from './GravityBadge';
import AnimatedCard from '../ui/AnimatedCard';
import COLORS from '../../utils/colors';

const { width } = Dimensions.get('window');
const isLargeScreen = width >= 768;

interface PatientCardProps {
    patient: PatientStats;
    onPress: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onPress }) => {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    return (
        <AnimatedCard
            onPress={onPress}
            useGradient={true}
            gradientColors={COLORS.gradients.card}
        >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
                {/* Avatar */}
                <View
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: COLORS.primary[100],
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.primary[700] }}>
                        {getInitials(patient.firstName, patient.lastName)}
                    </Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 4 }}>
                        {patient.firstName} {patient.lastName}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="mail-outline" size={14} color={COLORS.text.tertiary} style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 14, color: COLORS.text.secondary }}>
                            {patient.email}
                        </Text>
                    </View>
                </View>

                {/* Gravity Badge */}
                <GravityBadge 
                    score={patient.highestGravityScore as 1 | 2 | 3} 
                    size="sm" 
                    showLabel={false}
                    animated={patient.highestGravityScore === 3} 
                />
            </View>

            {/* Badges et stats */}
            <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap',
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: COLORS.border.light,
                gap: 8,
            }}>
                {patient.activeConversation && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: COLORS.emerald[50],
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: COLORS.emerald[200],
                        }}
                    >
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: COLORS.emerald[500],
                                marginRight: 6,
                            }}
                        />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.emerald[700] }}>
                            En conversation
                        </Text>
                    </View>
                )}

                {patient.unreadReportsCount > 0 && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: COLORS.rose[50],
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: COLORS.rose[200],
                        }}
                    >
                        <Ionicons name="notifications" size={14} color={COLORS.rose[700]} style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.rose[700] }}>
                            {patient.unreadReportsCount} alerte{patient.unreadReportsCount > 1 ? 's' : ''}
                        </Text>
                    </View>
                )}

                {patient.lastConversationAt && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: COLORS.slate[100],
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 8,
                        }}
                    >
                        <Ionicons name="time-outline" size={14} color={COLORS.slate[600]} style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 12, color: COLORS.slate[700] }}>
                            {formatRelativeTime(patient.lastConversationAt)}
                        </Text>
                    </View>
                )}
            </View>
        </AnimatedCard>
    );
};

export default PatientCard;
