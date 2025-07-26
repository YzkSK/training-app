// app/drawer/_layout.tsx (修正後 - PlaylistProvider を削除)
import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { RecipeProvider } from '../contexts/RecipeContext';

export default function Layout() {
  return (
    <RecipeProvider>
    <Tabs>
      <Tabs.Screen
        name="fitness"
        options={{
          title: 'fitness',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="person-running" size={size} color={color} />
          ),
          headerShown: false, // ドロワーのヘッダーを非表示にする
        }}
      />

      <Tabs.Screen
        name="recipe"
        options={{
          title: 'recipe',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="utensils" size={size} color={color} />
          ),
          headerShown: false, // ドロワーのヘッダーを非表示にする
        }}
      />

      {/* PlaylistList はfitness.tsxが担うが、Drawerメニューに表示したい場合は残す。
          このままだと app/_layout.tsx に PlaylistList の定義が無いため、この導線は機能しません。
          もしDrawerメニューに「マイ再生リスト」を独立して表示したいなら、
          app/_layout.tsx にも PlaylistList の Stack.Screen 定義が必要です。
      */}
      <Tabs.Screen
        name="PlaylistDetail"
        options={{
          title: 'マイ再生リスト',
          headerShown: false, // ドロワーのヘッダーを非表示にする
          href: null, // この画面は fitness.tsx が担うため、href を null に設定
        }}
      />

      <Tabs.Screen
        name="RecipeDetail"
        options={{
          title: 'レシピ詳細',
          headerShown: false, // ドロワーのヘッダーを非表示にする
          href: null, // この画面は fitness.tsx が担うため、href を null に設定
        }}
      />

      <Drawer.Screen name="index" redirect={true} />
      <Drawer.Screen name="components/FloatingActionButton" redirect={true} />
      <Drawer.Screen name="diet/add-fitness" redirect={true} />
      <Drawer.Screen name="diet/add-recipe" redirect={true} />
    </Tabs>
    </RecipeProvider>
  );
}