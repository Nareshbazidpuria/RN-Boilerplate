import './global.css';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 p-4">
          <View className="items-center justify-center py-10">
            <Text className="text-3xl font-bold text-sky-600">
              NativeWind is working! 🎉
            </Text>
            <Text className="text-gray-500 mt-2 text-base">
              React Native {require('react-native/package.json').version}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
