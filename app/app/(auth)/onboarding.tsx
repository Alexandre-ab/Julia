import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    TouchableOpacity,
    Platform,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../utils/colors';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    description: string;
    gradient: string[];
    accentColor: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        icon: 'heart-outline',
        title: 'Bienvenue sur\nProjet J',
        subtitle: 'Votre espace de bien-etre',
        description:
            'Un accompagnement therapeutique personnalise, accessible a tout moment depuis votre telephone.',
        gradient: ['#7D5259', '#9C6B73'],
        accentColor: '#C4B5FD',
    },
    {
        id: '2',
        icon: 'chatbubbles-outline',
        title: 'Parlez\nlibrement',
        subtitle: 'Intelligence artificielle bienveillante',
        description:
            'Exprimez-vous en toute confidentialite. Notre IA analyse vos echanges pour mieux vous accompagner.',
        gradient: ['#0891B2', '#06B6D4'],
        accentColor: '#A5F3FC',
    },
    {
        id: '3',
        icon: 'shield-checkmark-outline',
        title: 'Suivi par votre\ntherapeute',
        subtitle: 'Connexion professionnelle',
        description:
            'Votre therapeute suit votre evolution et vous envoie des retours personnalises en toute securite.',
        gradient: ['#059669', '#10B981'],
        accentColor: '#A7F3D0',
    },
    {
        id: '4',
        icon: 'rocket-outline',
        title: 'Pret a\ncommencer ?',
        subtitle: 'C\'est parti',
        description:
            'Connectez-vous avec le lien fourni par votre therapeute et commencez votre parcours de bien-etre.',
        gradient: ['#E11D48', '#F43F5E'],
        accentColor: '#FECDD3',
    },
];

const ONBOARDING_KEY = '@projet_j_onboarding_done';

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        } else {
            handleFinish();
        }
    };

    const handleSkip = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleFinish();
    };

    const handleFinish = async () => {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        router.replace('/(auth)/login');
    };

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const iconScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
        });

        const iconOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        const textTranslateY = scrollX.interpolate({
            inputRange,
            outputRange: [40, 0, 40],
            extrapolate: 'clamp',
        });

        const textOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={{ width, flex: 1 }}>
                <LinearGradient
                    colors={item.gradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}
                >
                    {/* Decorative circles */}
                    <View
                        style={{
                            position: 'absolute',
                            top: height * 0.08,
                            right: -40,
                            width: 200,
                            height: 200,
                            borderRadius: 100,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            bottom: height * 0.15,
                            left: -60,
                            width: 160,
                            height: 160,
                            borderRadius: 80,
                            backgroundColor: 'rgba(255,255,255,0.04)',
                        }}
                    />

                    {/* Icon */}
                    <Animated.View
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 36,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 48,
                            transform: [{ scale: iconScale }],
                            opacity: iconOpacity,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                        }}
                    >
                        <Ionicons name={item.icon} size={56} color="#FFFFFF" />
                    </Animated.View>

                    {/* Text content */}
                    <Animated.View
                        style={{
                            alignItems: 'center',
                            transform: [{ translateY: textTranslateY }],
                            opacity: textOpacity,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 38,
                                fontWeight: '800',
                                color: '#FFFFFF',
                                textAlign: 'center',
                                lineHeight: 46,
                                letterSpacing: -1,
                                marginBottom: 12,
                            }}
                        >
                            {item.title}
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: item.accentColor,
                                textAlign: 'center',
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                                marginBottom: 20,
                            }}
                        >
                            {item.subtitle}
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: 'rgba(255,255,255,0.85)',
                                textAlign: 'center',
                                lineHeight: 26,
                                maxWidth: 300,
                            }}
                        >
                            {item.description}
                        </Text>
                    </Animated.View>
                </LinearGradient>
            </View>
        );
    };

    const isLast = currentIndex === slides.length - 1;

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <StatusBar style="light" />
            <FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={(item) => item.id}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(newIndex);
                }}
                scrollEventThrottle={16}
            />

            {/* Bottom controls */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingBottom: Platform.OS === 'ios' ? 50 : 32,
                    paddingHorizontal: 32,
                    paddingTop: 24,
                }}
            >
                {/* Pagination dots */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 32,
                    }}
                >
                    {slides.map((_, index) => {
                        const dotWidth = scrollX.interpolate({
                            inputRange: [
                                (index - 1) * width,
                                index * width,
                                (index + 1) * width,
                            ],
                            outputRange: [8, 28, 8],
                            extrapolate: 'clamp',
                        });
                        const dotOpacity = scrollX.interpolate({
                            inputRange: [
                                (index - 1) * width,
                                index * width,
                                (index + 1) * width,
                            ],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={{
                                    width: dotWidth,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#FFFFFF',
                                    opacity: dotOpacity,
                                    marginHorizontal: 4,
                                }}
                            />
                        );
                    })}
                </View>

                {/* Buttons */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {!isLast ? (
                        <TouchableOpacity
                            onPress={handleSkip}
                            style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                        >
                            <Text
                                style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: 16,
                                    fontWeight: '500',
                                }}
                            >
                                Passer
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}

                    <TouchableOpacity
                        onPress={handleNext}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            paddingVertical: 14,
                            paddingHorizontal: 28,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.3)',
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: 17,
                                fontWeight: '700',
                                marginRight: isLast ? 8 : 0,
                            }}
                        >
                            {isLast ? 'Commencer' : 'Suivant'}
                        </Text>
                        <Ionicons
                            name={isLast ? 'arrow-forward' : 'chevron-forward'}
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
}
