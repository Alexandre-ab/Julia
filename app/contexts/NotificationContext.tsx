import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuration des notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    registerForPushNotifications: () => Promise<string | null>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const notificationListener = useRef<any>(null);
    const responseListener = useRef<any>(null);

    useEffect(() => {
        // S'inscrire aux notifications au montage
        registerForPushNotifications();

        // Listener pour les notifications reçues
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        // Listener pour les interactions avec les notifications
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Notification clicked:', response);
            // TODO: Navigation basée sur les données de la notification
        });

        return () => {
            notificationListener.current?.remove?.();
            responseListener.current?.remove?.();
        };
    }, []);

    const registerForPushNotifications = async (): Promise<string | null> => {
        try {
            // Vérifier les permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('Permission de notification refusée');
                return null;
            }

            // Obtenir le token Expo Push
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);

            // Configuration Android
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            console.log('Expo Push Token:', token);
            return token;
        } catch (error) {
            console.error('Erreur lors de l\'inscription aux notifications:', error);
            return null;
        }
    };

    const value: NotificationContextType = {
        expoPushToken,
        notification,
        registerForPushNotifications,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
