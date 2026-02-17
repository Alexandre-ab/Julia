import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import COLORS from '../../utils/colors';

export default function LoginScreen() {
    const { login } = useAuth();
    const { colors: t, isDark } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const formSlide = useRef(new Animated.Value(50)).current;
    const formFade = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(150, [
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.out(Easing.back(1.2)),
                    useNativeDriver: true,
                }),
                Animated.timing(formFade, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(formSlide, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleLogin = async () => {
        if (!email || !password) {
            shake();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Erreur', 'Email et mot de passe requis');
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            setIsLoading(true);
            await login({ email, password });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/');
        } catch (err) {
            shake();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
                'Erreur',
                (err as any).response?.data?.message || (err as any).message || 'Erreur de connexion'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const inputStyle = (field: string) => ({
        flex: 1,
        fontSize: 16,
        color: t.text,
        paddingVertical: Platform.OS === 'ios' ? 16 : 12,
        paddingHorizontal: 0,
    });

    return (
        <View style={{ flex: 1, backgroundColor: t.bg }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header section with gradient */}
                    <LinearGradient
                        colors={isDark ? ['#3F282D', '#261B1E'] : ['#B07A82', '#7D5259']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingTop: Platform.OS === 'ios' ? 80 : 60,
                            paddingBottom: 48,
                            paddingHorizontal: 32,
                            borderBottomLeftRadius: 32,
                            borderBottomRightRadius: 32,
                        }}
                    >
                        {/* Decorative elements */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 40,
                                right: -20,
                                width: 140,
                                height: 140,
                                borderRadius: 70,
                                backgroundColor: 'rgba(255,255,255,0.06)',
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 20,
                                left: -30,
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: 'rgba(255,255,255,0.04)',
                            }}
                        />

                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ scale: logoScale }],
                                alignItems: 'center',
                            }}
                        >
                            {/* Logo icon */}
                            <View
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 22,
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 20,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                <Ionicons name="heart" size={36} color="#FFFFFF" />
                            </View>

                            <Text
                                style={{
                                    fontSize: 32,
                                    fontWeight: '800',
                                    color: '#FFFFFF',
                                    textAlign: 'center',
                                    letterSpacing: -0.5,
                                }}
                            >
                                Bon retour
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: COLORS.primary[200],
                                    textAlign: 'center',
                                    marginTop: 8,
                                }}
                            >
                                Connectez-vous a Projet J
                            </Text>
                        </Animated.View>
                    </LinearGradient>

                    {/* Form section */}
                    <Animated.View
                        style={{
                            flex: 1,
                            paddingHorizontal: 28,
                            paddingTop: 36,
                            opacity: formFade,
                            transform: [{ translateY: formSlide }, { translateX: shakeAnim }],
                        }}
                    >
                        {/* Email field */}
                        <View style={{ marginBottom: 20 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: t.textSecondary,
                                    marginBottom: 8,
                                    letterSpacing: 0.3,
                                }}
                            >
                                Email
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: t.inputBg,
                                    borderWidth: 2,
                                    borderColor:
                                        focusedField === 'email'
                                            ? COLORS.primary[500]
                                            : t.inputBorder,
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={
                                        focusedField === 'email'
                                            ? COLORS.primary[500]
                                            : t.textTertiary
                                    }
                                    style={{ marginRight: 12 }}
                                />
                                <TextInput
                                    style={inputStyle('email')}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="votre@email.com"
                                    placeholderTextColor={t.textTertiary}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    editable={!isLoading}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        {/* Password field */}
                        <View style={{ marginBottom: 28 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: t.textSecondary,
                                    marginBottom: 8,
                                    letterSpacing: 0.3,
                                }}
                            >
                                Mot de passe
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: t.inputBg,
                                    borderWidth: 2,
                                    borderColor:
                                        focusedField === 'password'
                                            ? COLORS.primary[500]
                                            : t.inputBorder,
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={
                                        focusedField === 'password'
                                            ? COLORS.primary[500]
                                            : t.textTertiary
                                    }
                                    style={{ marginRight: 12 }}
                                />
                                <TextInput
                                    style={inputStyle('password')}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Votre mot de passe"
                                    placeholderTextColor={t.textTertiary}
                                    secureTextEntry={!showPassword}
                                    editable={!isLoading}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={t.textTertiary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                onPress={handleLogin}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                disabled={isLoading}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={
                                        isLoading
                                            ? [COLORS.primary[300], COLORS.primary[400]]
                                            : (COLORS.gradients.primary as any)
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        paddingVertical: 18,
                                        borderRadius: 14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: COLORS.primary[600],
                                        shadowOffset: { width: 0, height: 6 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 12,
                                        elevation: 8,
                                    }}
                                >
                                    {isLoading ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons
                                                name="sync"
                                                size={20}
                                                color="#FFFFFF"
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    fontSize: 17,
                                                    fontWeight: '700',
                                                }}
                                            >
                                                Connexion...
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text
                                            style={{
                                                color: '#FFFFFF',
                                                fontSize: 17,
                                                fontWeight: '700',
                                                letterSpacing: 0.3,
                                            }}
                                        >
                                            Se connecter
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Hint */}
                        <View
                            style={{
                                marginTop: 32,
                                backgroundColor: isDark ? COLORS.primary[900] + '30' : COLORS.primary[50],
                                borderRadius: 14,
                                padding: 20,
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                borderWidth: 1,
                                borderColor: isDark ? COLORS.primary[800] : COLORS.primary[100],
                            }}
                        >
                            <Ionicons
                                name="information-circle"
                                size={22}
                                color={COLORS.primary[500]}
                                style={{ marginRight: 12, marginTop: 1 }}
                            />
                            <Text
                                style={{
                                    flex: 1,
                                    color: isDark ? COLORS.primary[200] : COLORS.primary[700],
                                    fontSize: 14,
                                    lineHeight: 22,
                                }}
                            >
                                Premiere connexion ?{'\n'}
                                Demandez votre lien d'invitation a votre therapeute.
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
