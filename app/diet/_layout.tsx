import { Stack } from 'expo-router';
import { PlaylistProvider } from '../drawer/contexts/PlaylistContext';
import { RecipeProvider } from '../drawer/contexts/RecipeContext';

export default function Layout() {
  return (
    // アプリケーションのルートにStackナビゲーターを配置します。
    // これにより、すべての画面がこのスタックの一部として管理されます。
    <RecipeProvider>
    <PlaylistProvider>
    <Stack>
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
          title: 'トレーニング項目追加', // 画面のタイトル
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
      <Stack.Screen
        name="PlaylistDetail" // app/PlaylistDetail.tsx
        options={{
          title: 'プレイリスト詳細', // 画面のタイトル
          presentation: 'modal', // モーダル表示にする場合は 'modal' を使用
        }}
      />
      <Stack.Screen
        name="RecipeDetail" // app/RecipeDetail.tsx
        options={{
          title: 'レシピ詳細', // 画面のタイトル
          presentation: 'modal', // モーダル表示にする場合は 'modal' を使用
        }}
      />
      {/* その他のルートレベルのスクリーンがあればここに追加します */}
    </Stack>
    </PlaylistProvider>
    </RecipeProvider>

  );
}
