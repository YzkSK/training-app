// app/drawer/tabs/_layout.tsx (修正後 - PlaylistProvider を削除)
import { FontAwesome6 } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';

// PlaylistProvider は上位 (_layout.tsx) に移動したので、ここにはインポートしません。
// import { PlaylistProvider } from '../../contexts/PlaylistContext'; // ← この行を削除

export default function TabLayout() {
  return (
    <PaperProvider>
      <Portal.Host>
        {/* ★ PlaylistProvider はここから削除します！ */}
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
          {/* フィットネス画面 */}
          <Tabs.Screen
            name="fitness"
            options={{
              title: 'Fitness',
              headerShown: false,
              tabBarIcon: ({ color }) => <FontAwesome6 name="person-walking" size={24} color={color} />,
            }}
          />

          {/* レシピ画面 */}
          <Tabs.Screen
            name="recipe"
            options={{
              title: 'Recipe',
              headerShown: false,
              tabBarIcon: ({ color }) => <MaterialIcons size={28} name="set-meal" color={color} />,
            }}
          />
          <Tabs.Screen
            name="PlaylistDetail"
            options={{
              title: 'Playlist Detail',
              headerShown: false,
              href: null,
            }}
          />
        </Tabs>
      </Portal.Host>
    </PaperProvider>
  );
}
  