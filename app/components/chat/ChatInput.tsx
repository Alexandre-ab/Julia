import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { MESSAGE_CONSTRAINTS } from '../../utils/constants';
import COLORS from '../../utils/colors';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    disabled = false,
    placeholder = 'Écrivez votre message...',
}) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim().length === 0) return;
        if (message.length > MESSAGE_CONSTRAINTS.MAX_LENGTH) return;

        onSend(message.trim());
        setMessage('');
    };

    const isValid = message.trim().length > 0 && message.length <= MESSAGE_CONSTRAINTS.MAX_LENGTH;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View 
                className="border-t border-secondary-200 bg-white p-3"
                style={{
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border.light,
                    backgroundColor: COLORS.background.primary,
                    padding: 12,
                    paddingBottom: 20, // More space from bottom
                }}
            >
                <View 
                    className="flex-row items-end"
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                    }}
                >
                    <View 
                        className="flex-1 mr-2"
                        style={{
                            flex: 1,
                            marginRight: 8,
                        }}
                    >
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            multiline
                            maxLength={MESSAGE_CONSTRAINTS.MAX_LENGTH}
                            editable={!disabled}
                            className="border border-secondary-300 rounded-2xl px-4 py-2 max-h-[100px] text-base text-secondary-900"
                            style={{ 
                                minHeight: 40,
                                borderWidth: 1,
                                borderColor: COLORS.border.medium,
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                maxHeight: 100,
                                fontSize: 16,
                                color: COLORS.text.primary,
                            }}
                        />
                        {message.length > MESSAGE_CONSTRAINTS.MAX_LENGTH * 0.9 && (
                            <Text 
                                className="text-xs text-secondary-500 mt-1"
                                style={{
                                    fontSize: 12,
                                    color: COLORS.text.secondary,
                                    marginTop: 4,
                                }}
                            >
                                {message.length} / {MESSAGE_CONSTRAINTS.MAX_LENGTH}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!isValid || disabled}
                        className={`w-10 h-10 rounded-full items-center justify-center ${isValid && !disabled ? 'bg-primary-600' : 'bg-secondary-300'}`}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isValid && !disabled ? COLORS.primary[600] : COLORS.border.medium,
                        }}
                    >
                        <Text 
                            className="text-white text-lg font-bold"
                            style={{
                                color: COLORS.text.inverse,
                                fontSize: 18,
                                fontWeight: 'bold',
                            }}
                        >
                            ↑
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatInput;
