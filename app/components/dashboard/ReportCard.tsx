import React from 'react';
import { View, Text } from 'react-native';
import { SessionReport } from '../../types/report.types';
import { formatFullDate } from '../../utils/formatters';
import { TRIGGER_REASON_LABELS } from '../../utils/constants';
import GravityBadge from './GravityBadge';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ReportCardProps {
    report: SessionReport;
    onPress: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
    return (
        <Card onPress={onPress} className="mb-3" variant="elevated">
            <View className="flex-row items-center justify-between mb-2">
                <GravityBadge score={report.gravityScore as 1 | 2 | 3} />
                <Text className="text-xs text-secondary-500">{formatFullDate(report.createdAt)}</Text>
            </View>

            <Text className="text-sm text-secondary-700 mb-2" numberOfLines={3}>
                {report.aiSummary}
            </Text>

            <View className="flex-row flex-wrap items-center">
                {report.keyTopics.map((topic, index) => (
                    <View key={index} className="mr-2 mb-1">
                        <Badge variant="info" size="sm">
                            {topic}
                        </Badge>
                    </View>
                ))}
            </View>

            <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-secondary-200">
                <Text className="text-xs text-secondary-600">
                    {TRIGGER_REASON_LABELS[report.triggerReason]}
                </Text>

                {report.status === 'unread' ? (
                    <Badge variant="danger" size="sm">
                        Non lu
                    </Badge>
                ) : (
                    <Text className="text-xs text-secondary-500">Lu</Text>
                )}
            </View>
        </Card>
    );
};

export default ReportCard;
