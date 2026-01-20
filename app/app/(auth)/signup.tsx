import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { validateInviteToken } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { isValidEmail, validatePassword } from '../../utils/validators';

export default function SignupScreen() {
    const { register } = useAuth();
    const { token } = useLocalSearchParams<{ token: string }>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [proName, setProName] = useState('');

    useEffect(() => {
        if (token) {
            checkToken();
        }
    }, [token]);

    const checkToken = async () => {
        try {
            const result = await validateInviteToken(token);
            if (result.valid) {
                setTokenValid(true);
                setProName(result.proName || '');
            } else {
                setError(result.message || 'Token invalide');
            }
        } catch (err) {
            setError('Token invalide ou expiré');
        }
    };

    const handleRegister = async () => {
        try {
            setError('');

            if (!isValidEmail(email)) {
                setError('Email invalide');
                return;
            }

            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                setError(passwordValidation.errors[0]);
                return;
            }

            if (!firstName || !lastName) {
                setError('Prénom et nom requis');
                return;
            }

            setIsLoading(true);
            await register({ email, password, firstName, lastName, inviteToken: token });
            // Navigation automatique vers la page appropriée
            router.replace('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !tokenValid) {
        return (
            <View className="flex-1 bg-white items-center justify-center px-6">
                <Text className="text-xl font-bold text-red-600 mb-2">❌ Lien invalide</Text>
                <Text className="text-center text-secondary-600">
                    Ce lien d'invitation est invalide ou a expiré.{'\n'}
                    Demandez un nouveau lien à votre thérapeute.
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView className="flex-1 bg-white">
                <View className="flex-1 px-6 py-12">
                    <Text className="text-3xl font-bold text-center mb-2 text-secondary-900">
                        Créer votre compte
                    </Text>
                    <Text className="text-center text-secondary-600 mb-8">
                        Invitation de {proName}
                    </Text>

                    {error && (
                        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <Text className="text-red-700 text-sm">{error}</Text>
                        </View>
                    )}

                    <Input
                        label="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Prénom"
                    />

                    <Input
                        label="Nom"
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Nom"
                    />

                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="votre@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    <Button
                        title="Créer mon compte"
                        onPress={handleRegister}
                        loading={isLoading}
                        className="mt-4"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
