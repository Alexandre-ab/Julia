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
                className="bg-white p-4"
                style={{
                    backgroundColor: COLORS.background.primary,
                    padding: 16,
                    paddingBottom: 24,
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
                            placeholderTextColor={COLORS.slate[400]}
                            multiline
                            maxLength={MESSAGE_CONSTRAINTS.MAX_LENGTH}
                            editable={!disabled}
                            className="border border-slate-300 rounded-full px-5 py-3 max-h-[100px] text-base text-slate-900 bg-white shadow-md"
                            style={{
                                minHeight: 44,
                                borderWidth: 1,
                                borderColor: COLORS.slate[300],
                                borderRadius: 999,
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                maxHeight: 100,
                                fontSize: 16,
                                color: COLORS.slate[900],
                                backgroundColor: '#FFFFFF',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        />
                        {message.length > MESSAGE_CONSTRAINTS.MAX_LENGTH * 0.9 && (
                            <Text
                                className="text-xs text-slate-500 mt-1"
                                style={{
                                    fontSize: 12,
                                    color: COLORS.slate[500],
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
                        className={`w-11 h-11 rounded-full items-center justify-center ${isValid && !disabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isValid && !disabled ? COLORS.indigo[500] : COLORS.slate[300],
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
