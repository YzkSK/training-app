import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import React from 'react';

// これらのインポートはあなたの元のコードからのものです。
// これらのファイルが指定されたパスに存在することを確認してください。
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthRoutesLayout() {
  const colorScheme = useColorScheme();
  const { isSignedIn } = useAuth();

  // 1. ユーザーがサインイン済みの場合、(home)グループへリダイレクトします。
  // これにより、サインイン済みのユーザーが認証画面を見るのを防ぎます。
  if (isSignedIn) {
    return <Redirect href={'/(home)'} />;
  }

  // 2. ユーザーがサインインしていない場合、Tabsナビゲーションを表示します。
  // これにより、サインイン画面とサインアップ画面をタブで切り替えられます。
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // ヘッダーを非表示にして認証画面をスッキリさせます
      }}
      sceneContainerStyle={{
        backgroundColor: "white",
      }}>
      <Tabs.Screen
        // 3. 'name'プロパティは、(auth)ディレクトリ内のファイル名と一致させる必要があります。
        name="signIn"
        options={{
          title: 'Sign In',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        // 4. こちらも同様に、'name'はファイル名'signUp.tsx'と一致させます。
        name="signUp"
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-add' : 'person-add-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}