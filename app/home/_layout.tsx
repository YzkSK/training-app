import React from 'react';
import { Tabs } from 'expo-router';

// これらのコンポーネントと定数があなたのプロジェクトの正しいパスに存在することを確認してください
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeTabLayout() {
  const colorScheme = useColorScheme();

  // ★ 修正点1: 認証チェックを削除
  // この(home)レイアウトは、app/_layout.tsxによって既に認証済みのユーザーしか
  // アクセスできないよう保護されているため、ここでのリダイレクトは不要です。

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true, // ヘッダーを表示して画面タイトルなどを表示
      }}>
      <Tabs.Screen
        // このタブは app/(home)/index.tsx を表示します
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        // ★ 修正点2: あなたのファイル構成に合わせて'profile'タブを追加
        // このタブは app/(home)/profile.tsx を表示します
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
      {/* もし'explore'画面を追加したい場合は、
        app/(home)/explore.tsx というファイルを作成してください。
      */}
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      */}
    </Tabs>
  );
}