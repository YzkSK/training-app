// app/drawer/_layout.tsx (修正後)
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { PlaylistProvider } from './contexts/PlaylistContext'; // PlaylistProvider をインポート

export default function Layout() {
  return (
    // ★ ここに PlaylistProvider を配置し、Drawer ナビゲーター全体をラップします
    <PlaylistProvider>
      <Drawer>
        {/* タブナビゲーターグループ */}
        <Drawer.Screen
          name="tabs" // app/drawer/tabs/_layout.tsx を参照
          options={{
            title: 'メイン', // ドロワーメニューに表示されるタイトル
          }}
        />

        {/* プロフィール画面 */}
        <Drawer.Screen
          name="profile" // app/drawer/profile.tsx
          options={{
            title: 'プロフィール',
          }}
        />

        {/* 再生リスト一覧画面への導線
        <Drawer.Screen
          name="PlaylistList" // app/PlaylistList.tsx を参照
          options={{
            title: 'マイ再生リスト',
          }}
        /> */}

        {/* その他のルート */}
        <Drawer.Screen name="index" redirect={true} />
        <Drawer.Screen name="components/FloatingActionButton" redirect={true} />
        <Drawer.Screen name="diet/add-fitness" redirect={true} />
        <Drawer.Screen name="diet/add-recipe" redirect={true} />
      </Drawer>
    </PlaylistProvider>
  );
}