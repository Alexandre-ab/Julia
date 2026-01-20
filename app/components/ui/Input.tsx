import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    error,
    autoCapitalize = 'none',
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    maxLength,
    className = '',
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const borderColor = error
        ? 'border-red-500'
        : isFocused
            ? 'border-primary-600'
            : 'border-secondary-300';

    return (
        <View className={`mb-4 ${className}`}>
            {label && <Text className="text-sm font-medium text-secondary-700 mb-1">{label}</Text>}

            <View className={`relative ${multiline ? 'min-h-[100px]' : ''}`}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !showPassword}
                    autoCapitalize={autoCapitalize}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : 1}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`border-2 ${borderColor} rounded-lg px-4 py-3 text-base text-secondary-900 ${multiline ? 'min-h-[100px] pt-3' : ''
                        }`}
                    placeholderTextColor="#9CA3AF"
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3"
                    >
                        <Text className="text-primary-600 text-sm font-medium">
                            {showPassword ? 'Cacher' : 'Voir'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

            {maxLength && (
                <Text className="text-secondary-500 text-xs mt-1 text-right">
                    {value.length} / {maxLength}
                </Text>
            )}
        </View>
    );
};

export default Input;
