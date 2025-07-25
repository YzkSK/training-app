import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      {/* (tabs)グループをDrawerのスクリーンとして定義します。
          これにより、タブナビゲーションがドロワーメニューからアクセスできるようになります。
          headerShown: false を設定しないことで、Drawerが自動的にヘッダーとハンバーガーアイコンを提供します。
      */}
      <Drawer.Screen
        name="tabs"
        options={{
          title: 'メイン', // ドロワーメニューに表示されるタイトル
        }}
      />

      {/* ドロワーに直接追加したいスクリーンのみをここに記述します。
          これにより、profile.tsx のみがドロワーメニューに表示され、
          他のルートファイル（例: index.tsx, components/FloatingActionButton.tsxなど）は表示されなくなります。
      */}
      <Drawer.Screen
        name="profile" // app/profile.tsx (存在しない場合は作成してください)
        options={{
          title: 'プロフィール', // ドロワーメニューに表示されるタイトル
        }}
      />
      <Drawer.Screen
        name="index"
        redirect={true} // app/index.tsx (存在しない場合は作成してください)
      />
      <Drawer.Screen
        name="components/FloatingActionButton"
        redirect={true} // app/components/FloatingActionButton.tsx (存在しない場合は作成してください)
      />
      <Drawer.Screen
        name="add-fitness"
        redirect={true} 
      />
      <Drawer.Screen
        name="add-recipe"
        redirect={true} 
      />
    </Drawer>

  );
}
