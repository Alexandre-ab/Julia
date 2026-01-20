import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PatientStats } from '../../types/report.types';
import { formatRelativeTime } from '../../utils/formatters';
import GravityBadge from './GravityBadge';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface PatientCardProps {
    patient: PatientStats;
    onPress: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onPress }) => {
    return (
        <Card onPress={onPress} className="mb-3" variant="outlined">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-secondary-900">
                        {patient.firstName} {patient.lastName}
                    </Text>
                    <Text className="text-sm text-secondary-600">{patient.email}</Text>
                </View>

                <GravityBadge score={patient.highestGravityScore as 1 | 2 | 3} animated={patient.highestGravityScore === 3} />
            </View>

            <View className="flex-row items-center flex-wrap mt-2">
                {patient.activeConversation && (
                    <Badge variant="success" size="sm" className="mr-2 mb-1">
                        🟢 En conversation
                    </Badge>
                )}

                {patient.unreadReportsCount > 0 && (
                    <Badge variant="danger" size="sm" className="mr-2 mb-1">
                        🔔 {patient.unreadReportsCount} alerte{patient.unreadReportsCount > 1 ? 's' : ''}
                    </Badge>
                )}

                {patient.lastConversationAt && (
                    <Text className="text-xs text-secondary-500">
                        Dernière activité: {formatRelativeTime(patient.lastConversationAt)}
                    </Text>
                )}
            </View>
        </Card>
    );
};

export default PatientCard;
