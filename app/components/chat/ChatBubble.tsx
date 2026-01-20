import React from 'react';
import { View, Text } from 'react-native';
import { MessageSender } from '../../types/conversation.types';
import { formatTime } from '../../utils/formatters';
import { GRAVITY_COLORS } from '../../utils/constants';
import COLORS from '../../utils/colors';

interface ChatBubbleProps {
    sender: MessageSender;
    text: string;
    timestamp: string;
    gravityScore?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    sender,
    text,
    timestamp,
    gravityScore,
}) => {
    const isUser = sender === 'user';

    return (
        <View 
            className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
            style={{
                marginBottom: 16,
                alignItems: isUser ? 'flex-end' : 'flex-start',
            }}
        >
            <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-primary-600' : 'bg-secondary-100'}`}
                style={{
                    maxWidth: '80%',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: isUser ? COLORS.primary[600] : COLORS.background.tertiary,
                }}
            >
                <Text 
                    className={`text-base ${isUser ? 'text-white' : 'text-secondary-900'}`}
                    style={{
                        fontSize: 16,
                        color: isUser ? COLORS.text.inverse : COLORS.text.primary,
                    }}
                >
                    {text}
                </Text>

                <View 
                    className="flex-row items-center justify-between mt-1"
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 4,
                    }}
                >
                    <Text 
                        className={`text-xs ${isUser ? 'text-primary-100' : 'text-secondary-500'}`}
                        style={{
                            fontSize: 12,
                            color: isUser ? COLORS.primary[100] : COLORS.text.secondary,
                        }}
                    >
                        {formatTime(timestamp)}
                    </Text>

                    {gravityScore && gravityScore > 1 && (
                        <View
                            className="ml-2 w-2 h-2 rounded-full"
                            style={{ 
                                marginLeft: 8,
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: GRAVITY_COLORS[gravityScore as 1 | 2 | 3],
                            }}
                        />
                    )}
                </View>
            </View>

            {!isUser && (
                <Text 
                    className="text-xs text-secondary-500 mt-1 ml-2"
                    style={{
                        fontSize: 12,
                        color: COLORS.text.secondary,
                        marginTop: 4,
                        marginLeft: 8,
                    }}
                >
                    Assistant IA
                </Text>
            )}
        </View>
    );
};

export default ChatBubble;
