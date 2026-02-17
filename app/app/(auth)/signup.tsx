import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { validateInviteToken } from '../../services/auth.service';
import { isValidEmail, validatePassword } from '../../utils/validators';
import COLORS from '../../utils/colors';

export default function SignupScreen() {
    const { register } = useAuth();
    const { colors: t, isDark } = useTheme();
    const { token } = useLocalSearchParams<{ token: string }>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [proName, setProName] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerScale = useRef(new Animated.Value(0.6)).current;
    const formFade = useRef(new Animated.Value(0)).current;
    const formSlide = useRef(new Animated.Value(40)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (token) checkToken();
    }, [token]);

    useEffect(() => {
        Animated.stagger(200, [
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(headerScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(formFade, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(formSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

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
            setError('Token invalide ou expire');
        }
    };

    const shake = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleRegister = async () => {
        setError('');

        if (!isValidEmail(email)) {
            setError('Email invalide');
            shake();
            return;
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors[0]);
            shake();
            return;
        }
        if (!firstName || !lastName) {
            setError('Prenom et nom requis');
            shake();
            return;
        }

        try {
            setIsLoading(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await register({ email, password, firstName, lastName, inviteToken: token });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
            shake();
        } finally {
            setIsLoading(false);
        }
    };

    const renderInput = (
        field: string,
        label: string,
        icon: keyof typeof Ionicons.glyphMap,
        value: string,
        setter: (v: string) => void,
        options: {
            placeholder?: string;
            keyboardType?: any;
            autoCapitalize?: any;
            secureTextEntry?: boolean;
        } = {}
    ) => (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: t.textSecondary, marginBottom: 8, letterSpacing: 0.3 }}>
                {label}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: t.inputBg,
                    borderWidth: 2,
                    borderColor: focusedField === field ? COLORS.primary[500] : t.inputBorder,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                }}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={focusedField === field ? COLORS.primary[500] : t.textTertiary}
                    style={{ marginRight: 12 }}
                />
                <TextInput
                    style={{
                        flex: 1,
                        fontSize: 16,
                        color: t.text,
                        paddingVertical: Platform.OS === 'ios' ? 16 : 12,
                    }}
                    value={value}
                    onChangeText={setter}
                    placeholder={options.placeholder || ''}
                    placeholderTextColor={t.textTertiary}
                    keyboardType={options.keyboardType}
                    autoCapitalize={options.autoCapitalize}
                    secureTextEntry={options.secureTextEntry && !showPassword}
                    editable={!isLoading}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                />
                {options.secureTextEntry && (
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
                )}
            </View>
        </View>
    );

    if (!token || !tokenValid) {
        return (
            <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <View
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: COLORS.rose[50],
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 24,
                    }}
                >
                    <Ionicons name="close-circle" size={40} color={COLORS.rose[500]} />
                </View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.rose[600], marginBottom: 12 }}>
                    Lien invalide
                </Text>
                <Text style={{ textAlign: 'center', color: t.textSecondary, fontSize: 15, lineHeight: 24 }}>
                    Ce lien d'invitation est invalide ou a expire.{'\n'}
                    Demandez un nouveau lien a votre therapeute.
                </Text>
            </View>
        );
    }

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
                    {/* Header */}
                    <LinearGradient
                        colors={isDark ? ['#065F46', '#064E3B'] : ['#059669', '#10B981']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingTop: Platform.OS === 'ios' ? 70 : 50,
                            paddingBottom: 40,
                            paddingHorizontal: 32,
                            borderBottomLeftRadius: 32,
                            borderBottomRightRadius: 32,
                        }}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                top: 30,
                                right: -20,
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                backgroundColor: 'rgba(255,255,255,0.06)',
                            }}
                        />

                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ scale: headerScale }],
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 20,
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                <Ionicons name="person-add" size={30} color="#FFFFFF" />
                            </View>

                            <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', letterSpacing: -0.5 }}>
                                Creer votre compte
                            </Text>
                            <Text style={{ fontSize: 15, color: '#A7F3D0', textAlign: 'center', marginTop: 8 }}>
                                Invitation de {proName}
                            </Text>
                        </Animated.View>
                    </LinearGradient>

                    {/* Form */}
                    <Animated.View
                        style={{
                            paddingHorizontal: 28,
                            paddingTop: 28,
                            paddingBottom: 40,
                            opacity: formFade,
                            transform: [{ translateY: formSlide }, { translateX: shakeAnim }],
                        }}
                    >
                        {error ? (
                            <View
                                style={{
                                    backgroundColor: COLORS.rose[50],
                                    borderRadius: 12,
                                    padding: 14,
                                    marginBottom: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: COLORS.rose[200],
                                }}
                            >
                                <Ionicons name="alert-circle" size={20} color={COLORS.rose[500]} style={{ marginRight: 10 }} />
                                <Text style={{ color: COLORS.rose[700], fontSize: 14, flex: 1 }}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                                {renderInput('firstName', 'Prenom', 'person-outline', firstName, setFirstName, {
                                    placeholder: 'Prenom',
                                    autoCapitalize: 'words',
                                })}
                            </View>
                            <View style={{ flex: 1 }}>
                                {renderInput('lastName', 'Nom', 'person-outline', lastName, setLastName, {
                                    placeholder: 'Nom',
                                    autoCapitalize: 'words',
                                })}
                            </View>
                        </View>

                        {renderInput('email', 'Email', 'mail-outline', email, setEmail, {
                            placeholder: 'votre@email.com',
                            keyboardType: 'email-address',
                            autoCapitalize: 'none',
                        })}

                        {renderInput('password', 'Mot de passe', 'lock-closed-outline', password, setPassword, {
                            placeholder: 'Minimum 8 caracteres',
                            secureTextEntry: true,
                        })}

                        {/* Register button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 8 }}>
                            <TouchableOpacity
                                onPress={handleRegister}
                                onPressIn={() => Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start()}
                                onPressOut={() => Animated.spring(buttonScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start()}
                                disabled={isLoading}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={isLoading ? ['#6EE7B7', '#34D399'] : ['#059669', '#10B981']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        paddingVertical: 18,
                                        borderRadius: 14,
                                        alignItems: 'center',
                                        shadowColor: '#059669',
                                        shadowOffset: { width: 0, height: 6 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 12,
                                        elevation: 8,
                                    }}
                                >
                                    {isLoading ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="sync" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>
                                                Creation...
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 }}>
                                            Creer mon compte
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
