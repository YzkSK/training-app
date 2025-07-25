// app/auth/_layout.tsx

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="signIn" // app/auth/signIn.tsx ファイルに対応
        options={{
          title: 'Sign In',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'log-in' : 'log-in-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="signUp" // app/auth/signUp.tsx ファイルに対応
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-add' : 'person-add-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}