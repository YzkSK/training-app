// // app/drawer/tabs/_layout.tsx (修正後)
// import { FontAwesome6 } from '@expo/vector-icons';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { Tabs } from 'expo-router';
// import { Provider as PaperProvider, Portal } from 'react-native-paper';

// // PlaylistProvider をインポート
// import React from 'react';
// import { PlaylistProvider } from '../drawer/contexts/PlaylistContext'; // パスを適切に調整 (例: '../../contexts/PlaylistContext')

// export default function TabLayout() {
//   return (
//     <PaperProvider>
//       <Portal.Host>
//         {/* ★ここが重要: PlaylistProvider で Tabs ナビゲーター全体をラップします */}
//         <PlaylistProvider>
//           <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
//             <Tabs.Screen
//               name="fitness"
//               options={{
//                 title: 'Fitness',
//                 headerShown: false, // ヘッダーを非表示にする
//                 tabBarIcon: ({ color }) => <FontAwesome6 name="person-walking" size={24} color={color} />,
//               }}
//             />

//             <Tabs.Screen
//               name="recipe"
//               options={{
//                 title: 'Recipe',
//                 headerShown: false, // ヘッダーを非表示にする
//                 tabBarIcon: ({ color }) => <MaterialIcons size={28} name="set-meal" color={color} />,
//               }}
//             />
//           </Tabs>
//         </PlaylistProvider>
//       </Portal.Host>
//     </PaperProvider>
//   );
// }

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
