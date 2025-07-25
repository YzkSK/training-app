import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      {/* nameを "index" から "(tabs)" に変更しました。
        これにより、(tabs) ディレクトリ全体がドロワーの一画面として扱われ、
        ヘッダーに正しいタイトルが表示されるようになります。
      */}
      <Drawer.Screen
        name="(tabs)" // (tabs) ディレクトリを指します
        options={{
          title: 'メイン画面', // ヘッダーに表示されるタイトル
        }}
      />
      <Drawer.Screen
        name="profile" // app/profile.tsx (もし存在すれば)
        options={{
          title: 'プロフィール',
        }}
      />
    </Drawer>
  );
}
