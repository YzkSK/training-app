// app/RecipeDetailModal.tsx
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { RecipeItem, RecipeProvider, useRecipes } from './drawer/contexts/RecipeContext'; // RecipeContext.tsx から useRecipes と RecipeItem をインポート

const RecipeDetailModal: React.FC = () => {
  const { recipeId, recipeTitle } = useLocalSearchParams<{ recipeId: string; recipeTitle: string }>();
  const navigation = useNavigation();
  const { getRecipeById } = useRecipes(); // useRecipes から getRecipeById を取得

  const [recipe, setRecipe] = useState<RecipeItem | undefined>(undefined);

  useEffect(() => {
    // デバッグログを追加
    console.log('RecipeDetail: Received recipeId:', recipeId, 'recipeTitle:', recipeTitle);

    if (recipeTitle) {
      navigation.setOptions({ title: recipeTitle });
    }

    if (recipeId) {
      const foundRecipe = getRecipeById(recipeId);
      // ★ デバッグログを追加
      console.log('RecipeDetail: Found recipe in context:', foundRecipe);
      setRecipe(foundRecipe);
    } else {
        console.warn('RecipeDetail: recipeId is undefined.');
    }
  }, [recipeId, recipeTitle, getRecipeById, navigation]);

  // レシピが見つからない場合の表示
  if (!recipe) {
    return (
      // ★ View の直下に RecipeProvider を配置します
      <View style={recipeDetailModalStyles.container}>
        <RecipeProvider> {/* RecipeDetailModal が useRecipes() を呼び出すので、その内容全体をラップ */}
          <Text style={recipeDetailModalStyles.loadingText}>レシピが見つかりません。</Text>
          <TouchableOpacity style={recipeDetailModalStyles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={recipeDetailModalStyles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
        </RecipeProvider>
      </View>
    );
  }

  return (
    // ★ View の直下に RecipeProvider を配置します
    <View style={recipeDetailModalStyles.container}>
      <RecipeProvider> {/* RecipeDetailModal が useRecipes() を呼び出すので、その内容全体をラップ */}
        <ScrollView contentContainerStyle={recipeDetailModalStyles.scrollViewContent}>
          <Text style={recipeDetailModalStyles.sectionTitle}>材料</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={recipeDetailModalStyles.listItem}>・{ingredient}</Text>
          ))}

          <Text style={recipeDetailModalStyles.sectionTitle}>作り方</Text>
          {recipe.instructions.map((instruction, index) => (
            <Text key={index} style={recipeDetailModalStyles.listItem}>{index + 1}. {instruction}</Text>
          ))}

          {recipe.notes && (
            <>
              <Text style={recipeDetailModalStyles.sectionTitle}>メモ</Text>
              <Text style={recipeDetailModalStyles.notesText}>{recipe.notes}</Text>
            </>
          )}
        </ScrollView>

        <TouchableOpacity style={recipeDetailModalStyles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={recipeDetailModalStyles.closeButtonText}>閉じる</Text>
        </TouchableOpacity>
      </RecipeProvider>
    </View>
  );
};

const recipeDetailModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 50, // モーダルなので上部に少し余白
  } as ViewStyle,
  scrollViewContent: {
    paddingBottom: 20,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  } as TextStyle,
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  } as TextStyle,
  notesText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#777',
  } as TextStyle,
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  } as TextStyle,
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  } as ViewStyle,
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
});

export default RecipeDetailModal;