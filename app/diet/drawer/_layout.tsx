// app/drawer/_layout.tsx (修正後 - PlaylistProvider を削除)
import { Drawer } from 'expo-router/drawer';
import { ModeProvider } from './contexts/ModeContext';
import { PlaylistProvider } from './contexts/PlaylistContext';

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