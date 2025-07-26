// app/add-recipe.tsx
import { Ionicons } from '@expo/vector-icons'; // Ioniconsをインポート
import { useRouter } from 'expo-router'; // useRouterをインポート
import React, { useState } from 'react'; // useStateをインポート
import { ScrollView, StyleSheet, Text, View } from 'react-native'; // ScrollViewをインポート
import { Button, TextInput } from 'react-native-paper'; // ButtonとTextInputをインポート

export default function AddRecipeScreen() {
  const router = useRouter();

  // 各入力フィールドのstate
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');

  const handleSaveRecipe = () => {
    console.log('レシピを保存しました。');
    console.log('レシピ名:', recipeName);
    console.log('材料:', ingredients);
    console.log('作り方:', instructions);
    console.log('メモ:', notes);
    // ここに保存ロジック（例: Firestoreへの保存など）を追加します。

    // 保存後に前の画面に戻る例
    router.back();
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
          label="材料"
          value={ingredients}
          onChangeText={setIngredients}
          mode="outlined"
          multiline // 複数行入力可能にする
          numberOfLines={4} // 初期表示行数
          style={styles.inputMultiline}
          placeholder="例: 鶏もも肉 300g, 玉ねぎ 1個, カレールー 1箱"
        />

        {/* 作り方入力欄 */}
        <TextInput
          label="作り方"
          value={instructions}
          onChangeText={setInstructions}
          mode="outlined"
          multiline // 複数行入力可能にする
          numberOfLines={8} // 初期表示行数
          style={styles.inputMultiline}
          placeholder="例: 1. 鶏肉と玉ねぎを切る..."
        />

        {/* メモ入力欄 */}
        <TextInput
          label="メモ"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline // 複数行入力可能にする
          numberOfLines={3} // 初期表示行数
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
    flexGrow: 1, // コンテンツが画面より大きい場合にスクロール可能にする
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
    minHeight: 80, // 複数行入力の最小高さ
  },
  saveButton: {
    marginTop: 30,
    width: '80%',
  },
  buttonLabel: {
    fontSize: 18,
  },
});
