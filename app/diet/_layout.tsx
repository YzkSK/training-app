import { Stack } from 'expo-router';
import { PlaylistProvider } from './drawer/contexts/PlaylistContext';
import { RecipeProvider } from './drawer/contexts/RecipeContext';

export default function dietLayout() {
  return (
    <RecipeProvider>
      <PlaylistProvider>
        <Stack>
          <Stack.Screen
            name="drawer"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="add-fitness"
            options={{
              title: '運動項目追加',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="add-recipe"
            options={{
              title: 'レシピ追加',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="PlaylistDetail"
            options={{
              title: 'プレイリスト詳細',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="RecipeDetail"
            options={{
              title: 'レシピ詳細',
              presentation: 'modal',
            }}
          />
        </Stack>
      </PlaylistProvider>
    </RecipeProvider>

  );
}
