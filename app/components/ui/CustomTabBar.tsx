import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import COLORS from '../../utils/colors';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';


interface TabConfig {
    name: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconFocused: keyof typeof Ionicons.glyphMap;
}

interface CustomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
    tabs: TabConfig[];
}

function TabBarItem({
    isFocused,
    onPress,
    onLongPress,
    label,
    icon,
    iconFocused,
    index,
}: {
    isFocused: boolean;
    onPress: () => void;
    onLongPress: () => void;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconFocused: keyof typeof Ionicons.glyphMap;
    index: number;
}) {
    const { colors: t, isDark } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const iconTranslateY = useRef(new Animated.Value(0)).current;
    const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
    const dotScale = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(iconTranslateY, {
                toValue: isFocused ? -2 : 0,
                friction: 8,
                tension: 60,
                useNativeDriver: true,
            }),
            Animated.timing(labelOpacity, {
                toValue: isFocused ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(dotScale, {
                toValue: isFocused ? 1 : 0,
                friction: 6,
                tension: 50,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isFocused]);

    const bgColor = isFocused
        ? (isDark ? COLORS.primary[900] + '40' : COLORS.primary[50])
        : 'transparent';

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.85,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 50,
                useNativeDriver: true,
            }),
        ]).start();

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            onLongPress={onLongPress}
            activeOpacity={1}
            style={styles.tabItem}
        >
            <Animated.View
                style={[
                    styles.tabContent,
                    {
                        transform: [{ scale: scaleAnim }],
                        backgroundColor: bgColor,
                    },
                ]}
            >
                <Animated.View style={{ transform: [{ translateY: iconTranslateY }] }}>
                    <Ionicons
                        name={isFocused ? iconFocused : icon}
                        size={24}
                        color={isFocused ? COLORS.primary[500] : (isDark ? '#64748B' : COLORS.text.tertiary)}
                    />
                </Animated.View>
                <Animated.Text
                    style={[
                        styles.tabLabel,
                        {
                            opacity: labelOpacity,
                            color: isFocused ? COLORS.primary[500] : (isDark ? '#64748B' : COLORS.text.tertiary),
                        },
                    ]}
                    numberOfLines={1}
                >
                    {label}
                </Animated.Text>
                {/* Active dot indicator */}
                <Animated.View
                    style={[
                        styles.activeDot,
                        {
                            transform: [{ scale: dotScale }],
                            backgroundColor: COLORS.primary[500],
                        },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );

}

export default function CustomTabBar({ state, descriptors, navigation, tabs }: CustomTabBarProps) {
    const { colors: t, isDark } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();

    // Filter out hidden routes
    const visibleRoutes = state.routes.filter((_route: any, index: number) => {
        const { options } = descriptors[state.routes[index].key];
        return options.href !== null;
    });

    return (
        <View style={[styles.container]}>
            {Platform.OS === 'ios' ? (
                <BlurView
                    intensity={isDark ? 40 : 80}
                    tint={isDark ? 'dark' : 'light'}
                    style={[
                        styles.blurContainer,
                        {
                            borderTopColor: t.tabBarBorder,
                        },
                    ]}
                >
                    <View style={styles.tabsRow}>
                        {visibleRoutes.map((route: any, index: number) => {

                            const realIndex = state.routes.indexOf(route);
                            const { options } = descriptors[route.key];
                            const isFocused = state.index === realIndex;
                            const tabConfig = tabs.find(tab => tab.name === route.name);
                            if (!tabConfig) return null;

                            return (
                                <TabBarItem
                                    key={route.key}
                                    isFocused={isFocused}
                                    onPress={() => {
                                        const event = navigation.emit({
                                            type: 'tabPress',
                                            target: route.key,
                                            canPreventDefault: true,
                                        });
                                        if (!isFocused && !event.defaultPrevented) {
                                            navigation.navigate(route.name, route.params);
                                        }
                                    }}
                                    onLongPress={() => {
                                        navigation.emit({
                                            type: 'tabLongPress',
                                            target: route.key,
                                        });
                                    }}
                                    label={tabConfig.label}
                                    icon={tabConfig.icon}
                                    iconFocused={tabConfig.iconFocused}
                                    index={index}
                                />
                            );
                        })}

                        <TouchableOpacity
                            onPress={() => {
                                logout();
                                router.replace('/(auth)/login');
                            }}
                            style={styles.tabItem}
                        >
                            <View style={styles.tabContent}>
                            <Ionicons name="log-out-outline" size={24} color={COLORS.primary[600]} />
                            <Animated.Text style={styles.tabLabel}>{" "}</Animated.Text>
                            <Animated.View style={styles.activeDot} />
                            </View>
                        
                            
                            
                        </TouchableOpacity>
                    </View>

                </BlurView>
            ) : (
                <View
                    style={[
                        styles.solidContainer,
                        {
                            backgroundColor: t.tabBar,
                            borderTopColor: t.tabBarBorder,
                            shadowColor: isDark ? '#000' : COLORS.primary[600],
                        },
                    ]}
                >
                    <View style={styles.tabsRow}>
                        {visibleRoutes.map((route: any, index: number) => {
                            const realIndex = state.routes.indexOf(route);
                            const { options } = descriptors[route.key];
                            const isFocused = state.index === realIndex;
                            const tabConfig = tabs.find(tab => tab.name === route.name);
                            if (!tabConfig) return null;

                            return (
                                <TabBarItem
                                    key={route.key}
                                    isFocused={isFocused}
                                    onPress={() => {
                                        const event = navigation.emit({
                                            type: 'tabPress',
                                            target: route.key,
                                            canPreventDefault: true,
                                        });
                                        if (!isFocused && !event.defaultPrevented) {
                                            navigation.navigate(route.name, route.params);
                                        }
                                    }}
                                    onLongPress={() => {
                                        navigation.emit({
                                            type: 'tabLongPress',
                                            target: route.key,
                                        });
                                    }}
                                    label={tabConfig.label}
                                    icon={tabConfig.icon}
                                    iconFocused={tabConfig.iconFocused}
                                    index={index}
                                />
                            );
                        })}
                        <TouchableOpacity
                            onPress={() => {
                                logout();
                                router.replace('/(auth)/login');
                            }}
                            style={styles.tabItem}
                        >
                            <View style={styles.tabContent}>
                                <Ionicons name="log-out-outline" size={24} color={COLORS.primary[600]} />
                                <Animated.Text style={styles.tabLabel}>{" "}</Animated.Text>
                                <Animated.View style={styles.activeDot} />
                            </View>
                        </TouchableOpacity>
                    </View>  
                </View>

            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    blurContainer: {
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        paddingTop: 8,
        borderTopWidth: 1,
    },
    solidContainer: {
        paddingBottom: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 16,
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 16,
        minWidth: 64,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
        letterSpacing: 0.2,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
    },
});
