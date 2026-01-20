import React, { useState } from 'react';
import { View, Text, ScrollView, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { generateInviteLink } from '../../services/auth.service';
import Button from '../../components/ui/Button';

export default function InviteScreen() {
    const [inviteLink, setInviteLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        try {
            setIsLoading(true);
            const result = await generateInviteLink();
            setInviteLink(result.inviteLink);
        } catch (error) {
            console.error('Erreur génération lien:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        await Clipboard.setStringAsync(inviteLink);
        // TODO: Show toast notification
    };

    const handleShare = async () => {
        await Share.share({
            message: `Rejoignez-moi sur Projet J : ${inviteLink}`,
            url: inviteLink,
        });
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-6">
                <Text className="text-2xl font-bold text-secondary-900 mb-4">
                    Inviter un patient
                </Text>

                <Text className="text-secondary-600 mb-6">
                    Générez un lien d'invitation unique pour permettre à un patient de créer son compte.
                </Text>

                <Button
                    title="Générer un lien d'invitation"
                    onPress={handleGenerate}
                    loading={isLoading}
                    className="mb-6"
                />

                {inviteLink && (
                    <View className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                        <Text className="text-sm text-primary-700 mb-2">Lien d'invitation :</Text>
                        <Text className="text-primary-900 font-mono text-xs mb-4" selectable>
                            {inviteLink}
                        </Text>

                        <View className="flex-row space-x-2">
                            <Button
                                title="Copier"
                                onPress={handleCopy}
                                variant="outline"
                                className="flex-1"
                            />
                            <Button title="Partager" onPress={handleShare} className="flex-1" />
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
