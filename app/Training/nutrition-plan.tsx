// app/nutrition-plan.tsx
import { Ionicons } from '@expo/vector-icons';
// AsyncStorage はもう使用しません
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, Alert } from 'react-native'; // Alert をインポート
import { Button, HelperText, RadioButton, TextInput } from 'react-native-paper';

import { useQuery, useMutation } from 'convex/react'; // Convex hooksをインポート
import { api } from '../../convex/_generated/api'; // Convex APIをインポート

// AsyncStorageのキーはもう不要
// const USER_DATA_KEY = '@myTrainingApp:userData';

export default function NutritionPlanScreen() {
  const router = useRouter();

  // Convexから個人データを取得
  const personalData = useQuery(api.personal.get);
  // 個人データを保存・更新するConvexミューテーション
  const addOrUpdatePersonal = useMutation(api.personal.addOrUpdate);

  // ユーザー入力のState
  const [height, setHeight] = useState(''); // 身長 (cm)
  const [weight, setWeight] = useState(''); // 体重 (kg)
  const [age, setAge] = useState('');     // 年齢
  const [gender, setGender] = useState<'male' | 'female'>('male'); // 性別
  const [activityLevel, setActivityLevel] = useState('sedentary'); // 活動レベル (frontend string)

  // 計算結果のState
  const [bmr, setBmr] = useState<number | null>(null); // 基礎代謝量
  const [tdee, setTdee] = useState<number | null>(null); // 活動代謝量
  const [pfc, setPfc] = useState<{ protein: number; fat: number; carbs: number } | null>(null); // PFCグラム数

  // エラーメッセージのState
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [ageError, setAgeError] = useState('');

  // 初回ロード時またはpersonalDataが変更されたときにユーザーデータを読み込む
  useEffect(() => {
    if (personalData) {
      setHeight(personalData.height?.toString() || '');
      setWeight(personalData.weight?.toString() || '');
      setAge(personalData.age?.toString() || '');
      // Convexのgender ('男性', '女性') をフロントエンドの 'male', 'female' にマッピング
      if (personalData.gender === '男性') {
        setGender('male');
      } else if (personalData.gender === '女性') {
        setGender('female');
      } else {
        // 'その他' など、想定外の値の場合はデフォルトに設定
        setGender('male');
      }
      // Convexのmove_level (0-5) をフロントエンドのactivityLevel (string) にマッピング
      const activityMap: { [key: number]: string } = {
        0: 'sedentary',
        1: 'lightly_active',
        2: 'moderately_active',
        3: 'very_active',
        4: 'extra_active',
        5: 'extra_active', // 5もextra_activeにマッピング
      };
      setActivityLevel(activityMap[personalData.move_level] || 'sedentary');
    }
  }, [personalData]); // personalData が変更されたら再実行

  // 計算ロジック
  const calculateNutrition = async () => { // async に変更
    // 入力値のバリデーション
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);

    let isValid = true;
    if (isNaN(h) || h <= 0) {
      setHeightError('有効な身長を入力してください (cm)');
      isValid = false;
    } else {
      setHeightError('');
    }
    if (isNaN(w) || w <= 0) {
      setWeightError('有効な体重を入力してください (kg)');
      isValid = false;
    } else {
      setWeightError('');
    }
    if (isNaN(a) || a <= 0) {
      setAgeError('有効な年齢を入力してください');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!isValid) {
      setBmr(null);
      setTdee(null);
      setPfc(null);
      return;
    }

    // ハリス-ベネディクトの式 (Revised Harris-Benedict Equation)
    let calculatedBmr: number;
    if (gender === 'male') {
      calculatedBmr = 66.5 + (13.75 * w) + (5.003 * h) - (6.75 * a);
    } else {
      calculatedBmr = 655.1 + (9.563 * w) + (1.850 * h) - (4.676 * a);
    }
    setBmr(calculatedBmr);

    // 活動レベルに応じたTDEE計算
    let multiplier: number;
    // フロントエンドのactivityLevel文字列を数値にマッピング
    let moveLevelForConvex: 0 | 1 | 2 | 3 | 4 | 5;
    switch (activityLevel) {
      case 'sedentary':
        multiplier = 1.2;
        moveLevelForConvex = 0;
        break;
      case 'lightly_active':
        multiplier = 1.375;
        moveLevelForConvex = 1;
        break;
      case 'moderately_active':
        multiplier = 1.55;
        moveLevelForConvex = 2;
        break;
      case 'very_active':
        multiplier = 1.725;
        moveLevelForConvex = 3;
        break;
      case 'extra_active':
        multiplier = 1.9;
        moveLevelForConvex = 4; // または 5、Convexの定義による
        break;
      default:
        multiplier = 1.2;
        moveLevelForConvex = 0;
    }
    const calculatedTdee = calculatedBmr * multiplier;
    setTdee(calculatedTdee);

    // 推奨PFCバランス (例: P:25%, F:25%, C:50%)
    const proteinRatio = 0.25;
    const fatRatio = 0.25;
    const carbsRatio = 0.50;

    const proteinGrams = (calculatedTdee * proteinRatio) / 4;
    const fatGrams = (calculatedTdee * fatRatio) / 9;
    const carbsGrams = (calculatedTdee * carbsRatio) / 4;

    setPfc({
      protein: Math.round(proteinGrams),
      fat: Math.round(fatGrams),
      carbs: Math.round(carbsGrams),
    });

    // ユーザーデータをConvexに保存（または更新）
    try {
      await addOrUpdatePersonal({
        height: h,
        weight: w,
        age: a,
        // フロントエンドの'male'/'female'をConvexの'男性'/'女性'に変換
        gender: gender === 'male' ? '男性' : '女性',
        move_level: moveLevelForConvex,
      });
      Alert.alert('保存完了', '栄養プランデータが正常に保存されました！');
    } catch (e) {
      console.error("Failed to save user data to Convex:", e);
      Alert.alert('エラー', 'データの保存中に問題が発生しました。');
    }

    Keyboard.dismiss(); // 計算後にキーボードを閉じる
  };

  const getMealSuggestion = () => {
    if (!pfc) return null;

    return (
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionTitle}>🍽️ 食事提案の例</Text>
        <Text style={styles.suggestionText}>
          以下の食品群を組み合わせて、PFCバランスを意識した食事を摂りましょう。
        </Text>
        <View style={styles.suggestionSection}>
          <Text style={styles.sectionHeader}>高タンパク質源:</Text>
          <Text style={styles.sectionContent}>
            鶏むね肉、魚（鮭、サバなど）、卵、豆腐、納豆、プロテイン
          </Text>
        </View>
        <View style={styles.suggestionSection}>
          <Text style={styles.sectionHeader}>良質な脂質源:</Text>
          <Text style={styles.sectionContent}>
            アボカド、ナッツ類、オリーブオイル、魚油、アマニ油
          </Text>
        </View>
        <View style={styles.suggestionSection}>
          <Text style={styles.sectionHeader}>複合炭水化物源:</Text>
          <Text style={styles.sectionContent}>
            玄米、全粒粉パン、オートミール、さつまいも、じゃがいも
          </Text>
        </View>
        <Text style={styles.noteText}>
          ※これらはあくまで一般的な提案です。具体的な献立は、ご自身の好みや体調に合わせて調整してください。
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.fullScreenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Ionicons name="nutrition-outline" size={80} color="#FF6347" />
          <Text style={styles.title}>栄養素バランス計算＆食事提案</Text>

          {/* 身長入力 */}
          <TextInput
            label="身長 (cm)"
            value={height}
            onChangeText={text => {
              setHeight(text);
              setHeightError('');
            }}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="例: 170"
          />
          <HelperText type="error" visible={!!heightError}>
            {heightError}
          </HelperText>

          {/* 体重入力 */}
          <TextInput
            label="体重 (kg)"
            value={weight}
            onChangeText={text => {
              setWeight(text);
              setWeightError('');
            }}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="例: 65"
          />
          <HelperText type="error" visible={!!weightError}>
            {weightError}
          </HelperText>

          {/* 年齢入力 */}
          <TextInput
            label="年齢"
            value={age}
            onChangeText={text => {
              setAge(text);
              setAgeError('');
            }}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="例: 30"
          />
          <HelperText type="error" visible={!!ageError}>
            {ageError}
          </HelperText>

          {/* 性別選択 */}
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>性別:</Text>
            <RadioButton.Group onValueChange={newValue => setGender(newValue as 'male' | 'female')} value={gender}>
              <View style={styles.radioOption}>
                <RadioButton value="male" />
                <Text>男性</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="female" />
                <Text>女性</Text>
              </View>
            </RadioButton.Group>
          </View>

          {/* 活動レベル選択 */}
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>活動レベル:</Text>
            <RadioButton.Group onValueChange={newValue => setActivityLevel(newValue)} value={activityLevel}>
              <View style={styles.radioOption}>
                <RadioButton value="sedentary" />
                <Text>ほとんど運動しない</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="lightly_active" />
                <Text>週1-3回軽い運動</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="moderately_active" />
                <Text>週3-5回中程度の運動</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="very_active" />
                <Text>週6-7回激しい運動</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="extra_active" />
                <Text>非常に激しい運動/肉体労働</Text>
              </View>
            </RadioButton.Group>
          </View>

          {/* 計算ボタン */}
          <Button
            mode="contained"
            onPress={calculateNutrition}
            style={styles.calculateButton}
            labelStyle={styles.buttonLabel}
          >
            計算＆提案
          </Button>

          {/* 計算結果表示 */}
          {bmr !== null && tdee !== null && pfc !== null && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultHeader}>計算結果</Text>
              <Text style={styles.resultText}>基礎代謝量 (BMR): <Text style={styles.resultValue}>{bmr.toFixed(0)} kcal</Text></Text>
              <Text style={styles.resultText}>一日の総消費カロリー (TDEE): <Text style={styles.resultValue}>{tdee.toFixed(0)} kcal</Text></Text>
              <Text style={styles.resultHeader}>推奨PFCバランス</Text>
              <Text style={styles.resultText}>タンパク質 (P): <Text style={styles.resultValue}>{pfc.protein} g</Text></Text>
              <Text style={styles.resultText}>脂質 (F): <Text style={styles.resultValue}>{pfc.fat} g</Text></Text>
              <Text style={styles.resultText}>炭水化物 (C): <Text style={styles.resultValue}>{pfc.carbs} g</Text></Text>
              {getMealSuggestion()}
            </View>
          )}

          {/* Homeに戻るボタン（オプション） */}
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            戻る
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
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
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    marginBottom: 5,
  },
  radioGroup: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  calculateButton: {
    marginTop: 30,
    width: '80%',
    backgroundColor: '#007aff',
  },
  buttonLabel: {
    fontSize: 18,
    color: 'white',
  },
  resultsContainer: {
    marginTop: 30,
    padding: 20,
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007aff',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  resultValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6347',
    textAlign: 'center',
  },
  suggestionText: {
    fontSize: 14,
    marginBottom: 15,
    color: '#666',
  },
  suggestionSection: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    marginTop: 20,
    width: '50%',
    borderColor: '#007aff',
  },
});