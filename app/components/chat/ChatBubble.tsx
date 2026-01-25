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
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isUser ? 'bg-indigo-500' : 'bg-white border border-slate-200'}`}
                style={{
                    maxWidth: '80%',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: isUser ? COLORS.indigo[500] : '#FFFFFF',
                    borderWidth: isUser ? 0 : 1,
                    borderColor: isUser ? 'transparent' : COLORS.slate[200],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                }}
            >
                <Text
                    className={`text-base ${isUser ? 'text-white' : 'text-slate-900'}`}
                    style={{
                        fontSize: 16,
                        lineHeight: 22,
                        color: isUser ? COLORS.text.inverse : COLORS.slate[900],
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
                        className={`text-xs ${isUser ? 'text-indigo-100' : 'text-slate-500'}`}
                        style={{
                            fontSize: 12,
                            color: isUser ? COLORS.indigo[100] : COLORS.slate[500],
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
                    className="text-xs text-slate-500 mt-1 ml-2"
                    style={{
                        fontSize: 12,
                        color: COLORS.slate[500],
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
