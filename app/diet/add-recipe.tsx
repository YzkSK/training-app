// app/add-recipe.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native'; // Alertをインポート
import { Button, TextInput } from 'react-native-paper';

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function AddRecipeScreen() {
  const router = useRouter();

  // 各入力フィールドのstate
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');

  // Convexのaddミューテーションを使用
  const addRecipe = useMutation(api.recipe.add);

  const handleSaveRecipe = async () => {
    // 入力値のバリデーション (簡易的)
    if (!recipeName || !ingredients || !instructions) {
      Alert.alert('入力エラー', 'レシピ名、材料、作り方は必須項目です。');
      return;
    }

    try {
      // 材料と作り方を改行で分割し、配列にする
      const ingredientsArray = ingredients.split('\n').filter(item => item.trim() !== '');
      const instructionsArray = instructions.split('\n').filter(item => item.trim() !== '');

      // Convexのaddミューテーションを呼び出し、データを保存
      await addRecipe({
        name: recipeName,
        ingredients: ingredientsArray,
        instructions: instructionsArray.join('\n'),
        memo: notes.trim() !== '' ? notes : undefined, // メモが空の場合はundefinedを渡す
      });

      Alert.alert('保存成功', 'レシピが正常に保存されました！');
      console.log('レシピを保存しました。');
      // 保存後に前の画面に戻る
      router.back();
    } catch (error) {
      console.error('レシピの保存中にエラーが発生しました:', error);
      Alert.alert('保存エラー', 'レシピの保存中に問題が発生しました。');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* レシピ追加画面のアイコン */}
        <Ionicons name="restaurant-outline" size={80} color="green" />
        <Text style={styles.title}>レシピ追加画面</Text>

        {/* レシピ名入力欄 */}
        <TextInput
          label="レシピ名"
          value={recipeName}
          onChangeText={setRecipeName}
          mode="outlined"
          style={styles.input}
          placeholder="例: 簡単チキンカレー"
        />

        {/* 材料入力欄 */}
        <TextInput
          label="材料 (1行に1つの材料を記述)"
          value={ingredients}
          onChangeText={setIngredients}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.inputMultiline}
          placeholder="例:&#10;鶏もも肉 300g&#10;玉ねぎ 1個&#10;カレールー 1箱" // ヒントとして改行を入れておく
        />

        {/* 作り方入力欄 */}
        <TextInput
          label="作り方 (手順ごとに1行で記述)"
          value={instructions}
          onChangeText={setInstructions}
          mode="outlined"
          multiline
          numberOfLines={8}
          style={styles.inputMultiline}
          placeholder="例:&#10;1. 鶏肉と玉ねぎを切る&#10;2. フライパンで鶏肉を炒める&#10;3. 玉ねぎを加えて炒める"
        />

        {/* メモ入力欄 */}
        <TextInput
          label="メモ (オプション)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.inputMultiline}
          placeholder="例: ご飯と一緒に食べると美味しい"
        />

        {/* 保存ボタン */}
        <Button
          mode="contained"
          onPress={handleSaveRecipe}
          style={styles.saveButton}
          labelStyle={styles.buttonLabel}
        >
          レシピを保存
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  inputMultiline: {
    width: '100%',
    marginBottom: 15,
    minHeight: 80,
  },
  saveButton: {
    marginTop: 30,
    width: '80%',
  },
  buttonLabel: {
    fontSize: 18,
  },
});