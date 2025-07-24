// app/(auth)/_layout.tsx

import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import React from 'react';

// ★ 修正点1: TabBarIconの代わりに、Ioniconsを直接インポート
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthRoutesLayout() {
  const colorScheme = useColorScheme();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={'/(home)'} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
      sceneContainerStyle={{
        backgroundColor: "white",
      }}>
      <Tabs.Screen
        name="signIn"
        options={{
          title: 'Sign In',
          // ★ 修正点2: <TabBarIcon> の代わりに <Ionicons> を直接使う
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signUp"
        options={{
          title: 'Sign Up',
          // ★ 修正点3: こちらも同様に <Ionicons> を直接使う
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-add' : 'person-add-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}