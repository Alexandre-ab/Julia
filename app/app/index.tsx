import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../hooks/useAuth';

const ONBOARDING_KEY = '@projet_j_onboarding_done';

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [ready, setReady] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const titleSlide = useRef(new Animated.Value(40)).current;
    const buttonFade = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;
    const iconFloat = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            if (user?.role === 'patient') {
                router.replace('/(patient)/chat');
            } else if (user?.role === 'pro') {
                router.replace('/(pro)/dashboard');
            }
        }
    }, [isLoading, isAuthenticated, user]);

    useEffect(() => {
        if (!ready) return;
        // Entrance animations
        Animated.stagger(200, [
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.spring(titleSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(buttonFade, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(buttonSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
            ]),
        ]).start();

        // Floating icon animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconFloat, {
                    toValue: -10,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(iconFloat, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [ready]);

    const init = async () => {
        try {
            const done = await AsyncStorage.getItem(ONBOARDING_KEY);
            if (!done) {
                router.replace('/(auth)/onboarding');
                return;
            }
        } catch (e) {
            // Continue
        }
        setReady(true);
    };

    // Always show the rose background - never white
    if (!ready || isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#7D5259', alignItems: 'center', justifyContent: 'center' }}>
                <StatusBar style="light" />
                <View
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons name="heart" size={40} color="#FFFFFF" />
                </View>
            </View>
        );
    }

    if (isAuthenticated) return null;

    return (
        <View style={{ flex: 1, backgroundColor: '#7D5259' }}>
            <StatusBar style="light" />

            {/* Decorative shapes */}
            <View
                style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 250,
                    height: 250,
                    borderRadius: 125,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    bottom: 100,
                    left: -80,
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    backgroundColor: 'rgba(255,255,255,0.04)',
                }}
            />

            <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center' }}>
                {/* Logo */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: iconFloat }],
                        marginBottom: 48,
                    }}
                >
                    <View
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: 28,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.15,
                            shadowRadius: 16,
                        }}
                    >
                        <Ionicons name="heart" size={44} color="#FFFFFF" />
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: titleSlide }],
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: 44,
                            fontWeight: '800',
                            textAlign: 'center',
                            lineHeight: 52,
                            letterSpacing: -1,
                            fontFamily: 'Jakarta-ExtraBold',
                        }}
                    >
                        Prenez soin{'\n'}de vous{' '}
                        <Text style={{ fontFamily: 'Playfair-Bold', fontStyle: 'italic', color: '#E4BCC1' }}>
                            simplement
                        </Text>
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 16,
                            textAlign: 'center',
                            marginTop: 16,
                            lineHeight: 24,
                            fontFamily: 'Jakarta',
                        }}
                    >
                        Votre espace de bien-etre{'\n'}accessible a tout moment
                    </Text>
                </Animated.View>

                {/* CTA Button */}
                <Animated.View
                    style={{
                        width: '100%',
                        marginTop: 48,
                        opacity: buttonFade,
                        transform: [{ translateY: buttonSlide }],
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        activeOpacity={0.9}
                        style={{
                            backgroundColor: '#FFFFFF',
                            paddingVertical: 20,
                            borderRadius: 16,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.15,
                            shadowRadius: 16,
                            elevation: 8,
                        }}
                    >
                        <Text
                            style={{
                                color: '#7D5259',
                                fontSize: 18,
                                fontWeight: '700',
                                letterSpacing: 0.3,
                                fontFamily: 'Jakarta-Bold',
                                marginRight: 8,
                            }}
                        >
                            Commencer
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#7D5259" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}
