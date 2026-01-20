import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import COLORS from '../../utils/colors';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    return (
        <ScrollView 
            className="flex-1 bg-white"
            style={{ flex: 1, backgroundColor: COLORS.background.primary }}
        >
            <View 
                className="p-6"
                style={{ padding: 24 }}
            >
                <Text 
                    className="text-2xl font-bold text-secondary-900 mb-4"
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: COLORS.text.primary,
                        marginBottom: 16,
                    }}
                >
                    Mon Profil
                </Text>

                <View 
                    className="bg-secondary-50 rounded-lg p-4 mb-4"
                    style={{
                        backgroundColor: '#F9FAFB',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                    }}
                >
                    <Text 
                        className="text-sm text-secondary-600 mb-1"
                        style={{
                            fontSize: 14,
                            color: '#4B5563',
                            marginBottom: 4,
                        }}
                    >
                        Nom
                    </Text>
                    <Text 
                        className="text-lg font-semibold text-secondary-900"
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: COLORS.text.primary,
                        }}
                    >
                        {user?.firstName} {user?.lastName}
                    </Text>
                </View>

                <View 
                    className="bg-secondary-50 rounded-lg p-4 mb-4"
                    style={{
                        backgroundColor: '#F9FAFB',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                    }}
                >
                    <Text 
                        className="text-sm text-secondary-600 mb-1"
                        style={{
                            fontSize: 14,
                            color: '#4B5563',
                            marginBottom: 4,
                        }}
                    >
                        Email
                    </Text>
                    <Text 
                        className="text-lg text-secondary-900"
                        style={{
                            fontSize: 18,
                            color: COLORS.text.primary,
                        }}
                    >
                        {user?.email}
                    </Text>
                </View>

                {user?.linkedPro && (
                    <View 
                        className="bg-primary-50 rounded-lg p-4 mb-4"
                        style={{
                            backgroundColor: COLORS.primary[50],
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 16,
                        }}
                    >
                        <Text 
                            className="text-sm text-primary-600 mb-1"
                            style={{
                                fontSize: 14,
                                color: COLORS.primary[600],
                                marginBottom: 4,
                            }}
                        >
                            Thérapeute
                        </Text>
                        <Text 
                            className="text-lg font-semibold text-primary-900"
                            style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: COLORS.primary[900],
                            }}
                        >
                            Dr. {user.linkedPro.firstName} {user.linkedPro.lastName}
                        </Text>
                    </View>
                )}

                <Button title="Se déconnecter" onPress={logout} variant="outline" className="mt-4" />
            </View>
        </ScrollView>
    );
}
