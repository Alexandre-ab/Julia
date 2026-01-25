import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        try {
            console.log('🔵 Login attempt started');
            console.log('📧 Email:', email);

            if (!email || !password) {
                Alert.alert('Erreur', 'Email et mot de passe requis');
                return;
            }

            setIsLoading(true);
            console.log('📡 Calling login API...');
            const response = await login({ email, password });
            console.log('✅ Login successful!');

            // Redirection automatique vers la page appropriée
            // Note: Le composant index.tsx gérera la redirection selon le rôle
            router.replace('/');
        } catch (err) {
            console.error('❌ Login error:', err);
            Alert.alert('Erreur', err.response?.data?.message || err.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Bienvenue</Text>
                    <Text style={styles.subtitle}>Connectez-vous à Projet Juli</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="votre@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            secureTextEntry
                            editable={!isLoading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.hint}>
                        Première connexion ?{'\n'}
                        Demandez votre lien d'invitation à votre thérapeute
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    input: {
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    button: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    hint: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 14,
        marginTop: 24,
        lineHeight: 20,
    },
});
