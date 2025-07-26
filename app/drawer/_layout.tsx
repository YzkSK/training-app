// app/drawer/_layout.tsx (修正後 - PlaylistProvider を削除)
import { ModeProvider } from '@/contexts/ModeContext';
import { Drawer } from 'expo-router/drawer';
import { PlaylistProvider } from './contexts/PlaylistContext';
// import { PlaylistProvider } from './contexts/PlaylistContext'; // ★ この行を削除

export default function Layout() {
  return (
    <ModeProvider>
    <PlaylistProvider>
    <Drawer>
      <Drawer.Screen
        name="tabs"
        options={{
          title: 'メイン',
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: 'プロフィール',
        }}
      />

      {/* PlaylistList はfitness.tsxが担うが、Drawerメニューに表示したい場合は残す。
          ただし、このルート名が app/_layout.tsx にもなければナビゲーションエラーになる。
      */}
      <Drawer.Screen
        name="PlaylistList"
        options={{
          title: 'マイ再生リスト',
        }}
      />

      <Drawer.Screen name="index" redirect={true} />
      <Drawer.Screen name="components/FloatingActionButton" redirect={true} />
      <Drawer.Screen name="diet/add-fitness" redirect={true} />
      <Drawer.Screen name="diet/add-recipe" redirect={true} />
    </Drawer>
    </PlaylistProvider>
    </ModeProvider>
  );
}