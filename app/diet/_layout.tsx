// app/drawer/tabs/_layout.tsx (修正後)
import { FontAwesome6 } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { Provider as PaperProvider, Portal } from 'react-native-paper';

// PlaylistProvider をインポート
import React from 'react';
import { PlaylistProvider } from '../drawer/contexts/PlaylistContext'; // パスを適切に調整 (例: '../../contexts/PlaylistContext')

export default function TabLayout() {
  return (
    <PaperProvider>
      <Portal.Host>
        {/* ★ここが重要: PlaylistProvider で Tabs ナビゲーター全体をラップします */}
        <PlaylistProvider>
          <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
              name="fitness"
              options={{
                title: 'Fitness',
                headerShown: false, // ヘッダーを非表示にする
                tabBarIcon: ({ color }) => <FontAwesome6 name="person-walking" size={24} color={color} />,
              }}
            />

            <Tabs.Screen
              name="recipe"
              options={{
                title: 'Recipe',
                headerShown: false, // ヘッダーを非表示にする
                tabBarIcon: ({ color }) => <MaterialIcons size={28} name="set-meal" color={color} />,
              }}
            />
          </Tabs>
        </PlaylistProvider>
      </Portal.Host>
    </PaperProvider>
  );
}