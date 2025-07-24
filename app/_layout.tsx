import { Stack } from 'expo-router';

export default function Layout() {
  return (
    // アプリケーションのルートにStackナビゲーターを配置します。
    // これにより、すべての画面がこのスタックの一部として管理されます。
    <Stack>
      {/* ドロワーナビゲーター全体をStackのスクリーンとして定義します。
          これにより、ドロワー内のすべての画面がスタックナビゲーションの一部になります。
          headerShown: false に設定することで、ドロワー自身がヘッダーを管理します。
          この '(drawer)' は、app/(drawer) フォルダ内の _layout.tsx を参照します。
      */}
      <Stack.Screen
        name="drawer"
        options={{ headerShown: false }} // ドロワーのヘッダーを非表示にする
      />

      {/* ドロワーには表示されないが、フローティングアクションボタンから遷移させたい画面を
          Stackの直接の子として定義します。これにより、router.push() でアクセス可能になります。
      */}
      <Stack.Screen
        name="add-fitness" // app/add-fitness.tsx
        options={{
          title: '運動項目追加', // 画面のタイトル
          presentation: 'modal', // モーダル表示にする場合は 'modal' を使用
        }}
      />
      <Stack.Screen
        name="add-recipe" // app/add-recipe.tsx
        options={{
          title: 'レシピ追加', // 画面のタイトル
          presentation: 'modal', // モーダル表示にする場合は 'modal' を使用
        }}
      />
      {/* その他のルートレベルのスクリーンがあればここに追加します */}
    </Stack>
  );
}
