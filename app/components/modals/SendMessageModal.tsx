import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AnimatedButton from '../ui/AnimatedButton';
import COLORS from '../../utils/colors';

interface SendMessageModalProps {
    visible: boolean;
    patientId: string;
    conversationId?: string;
    onClose: () => void;
    onSend: (subject: string, content: string, conversationId?: string) => Promise<void>;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
    visible,
    patientId,
    conversationId,
    onClose,
    onSend,
}) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!subject.trim() || !content.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (subject.trim().length < 3) {
            Alert.alert('Erreur', 'Le sujet doit faire au moins 3 caractères');
            return;
        }

        if (content.trim().length < 10) {
            Alert.alert('Erreur', 'Le message doit faire au moins 10 caractères');
            return;
        }

        try {
            setIsSending(true);
            await onSend(subject.trim(), content.trim(), conversationId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSubject('');
            setContent('');
            onClose();
        } catch (error) {
            console.error('Erreur envoi message:', error);
            Alert.alert('Erreur', 'Impossible d\'envoyer le message');
        } finally {
            setIsSending(false);
        }
    };

    const handleClose = () => {
        if (subject.trim() || content.trim()) {
            Alert.alert(
                'Annuler',
                'Voulez-vous vraiment annuler ? Le message ne sera pas sauvegardé.',
                [
                    { text: 'Continuer', style: 'cancel' },
                    {
                        text: 'Annuler',
                        style: 'destructive',
                        onPress: () => {
                            setSubject('');
                            setContent('');
                            onClose();
                        },
                    },
                ]
            );
        } else {
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'flex-end',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            paddingTop: 24,
                            paddingBottom: Platform.OS === 'ios' ? 40 : 24,
                            maxHeight: '90%',
                        }}
                    >
                        {/* Header */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 24,
                                marginBottom: 24,
                            }}
                        >
                            <View>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.text.primary }}>
                                    Nouveau message
                                </Text>
                                {conversationId && (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 4,
                                        }}
                                    >
                                        <Ionicons name="link" size={14} color={COLORS.text.tertiary} style={{ marginRight: 4 }} />
                                        <Text style={{ fontSize: 12, color: COLORS.text.tertiary }}>
                                            Lié à une conversation
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={handleClose}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: COLORS.slate[100],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons name="close" size={24} color={COLORS.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Form */}
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingHorizontal: 24 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Sujet */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 }}>
                                    Sujet
                                </Text>
                                <TextInput
                                    value={subject}
                                    onChangeText={setSubject}
                                    placeholder="Ex: Retour sur votre séance du 15/01"
                                    placeholderTextColor={COLORS.text.tertiary}
                                    maxLength={200}
                                    style={{
                                        backgroundColor: COLORS.background.secondary,
                                        borderRadius: 12,
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                        fontSize: 15,
                                        color: COLORS.text.primary,
                                        borderWidth: 1,
                                        borderColor: COLORS.border.light,
                                    }}
                                />
                                <Text style={{ fontSize: 12, color: COLORS.text.tertiary, marginTop: 4 }}>
                                    {subject.length}/200 caractères
                                </Text>
                            </View>

                            {/* Message */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 }}>
                                    Message
                                </Text>
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Écrivez votre message au patient..."
                                    placeholderTextColor={COLORS.text.tertiary}
                                    multiline
                                    numberOfLines={8}
                                    maxLength={5000}
                                    textAlignVertical="top"
                                    style={{
                                        backgroundColor: COLORS.background.secondary,
                                        borderRadius: 12,
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                        fontSize: 15,
                                        color: COLORS.text.primary,
                                        minHeight: 180,
                                        borderWidth: 1,
                                        borderColor: COLORS.border.light,
                                    }}
                                />
                                <Text style={{ fontSize: 12, color: COLORS.text.tertiary, marginTop: 4 }}>
                                    {content.length}/5000 caractères
                                </Text>
                            </View>

                            {/* Info */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: COLORS.primary[50],
                                    padding: 12,
                                    borderRadius: 12,
                                    marginBottom: 20,
                                }}
                            >
                                <Ionicons name="information-circle" size={20} color={COLORS.primary[700]} style={{ marginRight: 8 }} />
                                <Text style={{ flex: 1, fontSize: 13, color: COLORS.primary[700], lineHeight: 18 }}>
                                    Le patient recevra ce message dans son onglet "Messages" et pourra le consulter à tout moment.
                                </Text>
                            </View>
                        </ScrollView>

                        {/* Actions */}
                        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                            <AnimatedButton
                                title="Envoyer le message"
                                onPress={handleSend}
                                variant="gradient"
                                loading={isSending}
                                disabled={!subject.trim() || !content.trim() || isSending}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default SendMessageModal;
