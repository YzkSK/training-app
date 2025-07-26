import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="tabs" // メインのタブ画面
        options={{
          title: 'トレーニング記録',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        // `planning.tsx` を指すように設定
        name="planning" 
        options={{
          title: 'トレーニングプラン',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile" // プロフィール画面 (もし存在すれば)
        options={{
          title: 'プロフィール',
           drawerIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
