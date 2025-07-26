// app/drawer/tabs/recipe.tsx
import FloatingActionButton from '@/components/Fitnessfab';
import type { NavigationProp } from '@react-navigation/native'; // 型定義をインポート
import { router, useNavigation } from 'expo-router'; // useNavigation をインポート
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

// RecipeContext.tsx から useRecipes と RecipeItem 型をインポート
import { RecipeItem, RecipeProvider, useRecipes } from '../contexts/RecipeContext'; // ★ ここを変更

// FloatingActionButton は fitness.tsx にあるため、ここではインポートしません。
// もし recipe.tsx にも表示したい場合は、インポートし、return 文に追加してください。
// import FloatingActionButton from '@/components/FloatingActionButton';


// 型定義: レシピ詳細ルートパラメータ型
type RecipeStackParamList = {
  RecipeDetailModal: { recipeId: string; recipeTitle: string };
};

const RecipeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecipeStackParamList>>();

  // useRecipes から recipes を取得
  const { recipes } = useRecipes(); // ★ ここを変更


  // レシピ項目をタップした時のハンドラ
  const handleRecipePress = (recipeId: string, recipeTitle: string) => {
    // RecipeDetailModal.tsx に遷移 (モーダル表示)
    // app/_layout.tsx で RecipeDetailModal が modal presentation で定義されている前提
    router.push({ pathname: '../../diet/RecipeDetail', params: { recipeId, recipeTitle } });
  };


  return (
    // ★ SafeAreaView の直下に RecipeProvider を配置します
    // PlaylistContext が app/drawer/tabs/_layout.tsx にあるため、
    // ここで RecipeProvider をラップすることで、この画面と下位コンポーネントで useRecipes が使えます。
    <SafeAreaView style={recipeScreenStyles.safeArea}>
      <RecipeProvider> {/* RecipeScreen が useRecipes() を呼び出すので、RecipeScreen の内容全体をラップ */}
        <View style={recipeScreenStyles.container}>

          <ScrollView style={recipeScreenStyles.scrollViewContent}>

            <View style={recipeScreenStyles.sectionHeader}>
              <Text style={recipeScreenStyles.sectionTitle}>あなたのレシピ</Text>
            </View>

            {recipes.length === 0 ? (
              <Text style={recipeScreenStyles.emptyRecipeText}>まだレシピがありません。</Text>
            ) : (
              <View style={recipeScreenStyles.recipeListContainer}>
                {/* recipes が RecipeItem[] 型と正しく推論されていることを前提とする */}
                {recipes.map((recipe: RecipeItem) => ( // ★ ここを変更
                  <TouchableOpacity
                    key={recipe.id}
                    style={recipeScreenStyles.recipeItem}
                    onPress={() => handleRecipePress(recipe.id, recipe.title)}
                  >
                    <Text style={recipeScreenStyles.recipeTitle}>{recipe.title}</Text>
                    {/* レシピ固有の情報を表示 */}
                    <Text style={recipeScreenStyles.ingredientCount}>{recipe.ingredients.length} 種類の材料</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
            <FloatingActionButton />
        </View>
      </RecipeProvider>
    </SafeAreaView>
  );
};

export default RecipeScreen;

// スタイルシート (fitnessScreenStyles を recipeScreenStyles に変更)
const recipeScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight ?? 0) + 20) : 20,
    paddingBottom: 20,
  } as ViewStyle,

  sectionHeader: {
    marginTop: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  } as TextStyle,
  recipeListContainer: { // playlistListContainer を recipeListContainer に変更
  } as ViewStyle,
  recipeItem: { // playlistItem を recipeItem に変更
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  recipeTitle: { // playlistName を recipeTitle に変更
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  } as TextStyle,
  ingredientCount: { // itemCount を ingredientCount に変更
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  } as TextStyle,
  emptyRecipeText: { // emptyPlaylistText を emptyRecipeText に変更
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  } as TextStyle,
});