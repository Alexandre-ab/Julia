import { View, Text } from 'react-native';

export default function TestStyles() {
    return (
        <View className="flex-1 items-center justify-center bg-blue-500 p-8">
            <View className="bg-white rounded-2xl p-6 shadow-lg">
                <Text className="text-2xl font-bold text-gray-900 mb-4">
                    Test NativeWind
                </Text>
                <Text className="text-base text-gray-600">
                    Si vous voyez ce texte stylé avec un fond blanc arrondi sur fond bleu,
                    NativeWind fonctionne correctement ! 🎉
                </Text>
                <View className="mt-4 bg-primary-600 rounded-lg p-3">
                    <Text className="text-white text-center font-semibold">
                        Bouton Test
                    </Text>
                </View>
            </View>
        </View>
    );
}
