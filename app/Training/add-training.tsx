// app/add-training.tsx
import { Ionicons } from '@expo/vector-icons';
// AsyncStorage はもう使用しません
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react'; // React をインポート
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { useMutation } from 'convex/react'; // Convex hooksをインポート
import { api } from '../../convex/_generated/api'; // Convex APIをインポート

// --- 型定義 ---
// Convexのテーブルスキーマに合わせるため、ここでは直接使用せず、バックエンドの引数に合わせる
// type TrainingData = { ... }; // これはもう不要

// STORAGE_KEY はもう不要
// const STORAGE_KEY = '@myTrainingApp:logs'; 

export default function AddTrainingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Convexのミューテーションを準備
  const addWeightTraining = useMutation(api.w_training.add);
  const addBodyweightTraining = useMutation(api.bw_training.add);

  // --- State定義 ---
  const [trainingName, setTrainingName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState(''); // ウエイトトレーニング用
  const [sets, setSets] = useState('');
  const [notes, setNotes] = useState('');
  const [trainingType, setTrainingType] = useState<'weight' | 'bodyweight'>('weight');

  // ホーム画面から渡された日付、または現在の日付をキーとして使用
  const dateKey = typeof params.date === 'string' ? params.date : new Date().toISOString().split('T')[0];

  const handleSaveTraining = async () => {
    // --- バリデーション（入力チェック） ---
    if (!trainingName.trim()) {
      Alert.alert('エラー', 'トレーニング名を入力してください。');
      return;
    }
    if (trainingType === 'weight' && (!weight.trim() || isNaN(Number(weight)))) {
      Alert.alert('エラー', '重量を数字で入力してください。');
      return;
    }
    if (!reps.trim() || isNaN(Number(reps)) || Number(reps) <= 0) {
      Alert.alert('エラー', '回数を有効な数字で入力してください。');
      return;
    }
    if (!sets.trim() || isNaN(Number(sets)) || Number(sets) <= 0) {
      Alert.alert('エラー', 'セット数を有効な数字で入力してください。');
      return;
    }

    try {
      const parsedReps = Number(reps);
      const parsedSets = Number(sets);
      const trimmedNotes = notes.trim() === '' ? undefined : notes.trim(); // 空の場合は undefined を渡す

      if (trainingType === 'weight') {
        const parsedWeight = Number(weight);
        await addWeightTraining({
          date: dateKey,
          exercise: trainingName.trim(),
          weight: parsedWeight,
          reps: parsedReps,
          sets: parsedSets,
          notes: trimmedNotes,
        });
      } else { // 'bodyweight'
        await addBodyweightTraining({
          date: dateKey,
          exercise: trainingName.trim(),
          reps: parsedReps,
          sets: parsedSets,
          notes: trimmedNotes,
        });
      }

      Alert.alert('成功', 'トレーニングが保存されました！', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);

    } catch (e: any) { // エラーの型を any にして console.error に渡せるように
      console.error('トレーニングの保存に失敗しました:', e);
      // Convexからのエラーメッセージがあれば表示
      Alert.alert('エラー', `トレーニングの保存に失敗しました: ${e.message || '不明なエラー'}`);
    }
  };

  // --- UI部分 ---
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Ionicons name="barbell-outline" size={80} color="#007aff" />
        <Text style={styles.title}>新しいトレーニングを追加</Text>
        <Text style={styles.dateText}>{dateKey} の記録</Text>

        <TextInput
          label="トレーニング名"
          value={trainingName}
          onChangeText={setTrainingName}
          mode="outlined"
          style={styles.input}
          placeholder="例: スクワット / プッシュアップ"
        />

        <View style={styles.typeSelectionContainer}>
          <Text style={styles.typeSelectionLabel}>タイプ:</Text>
          <TouchableOpacity
            style={[styles.typeButton, trainingType === 'weight' && styles.typeButtonActive]}
            onPress={() => setTrainingType('weight')}
          >
            <Text style={[styles.typeButtonText, trainingType === 'weight' && styles.typeButtonTextActive]}>
              Weight
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, trainingType === 'bodyweight' && styles.typeButtonActive]}
            onPress={() => setTrainingType('bodyweight')}
          >
            <Text style={[styles.typeButtonText, trainingType === 'bodyweight' && styles.typeButtonTextActive]}>
              Bodyweight
            </Text>
          </TouchableOpacity>
        </View>

        {trainingType === 'weight' && (
          <TextInput
            label="重量 (kg)"
            value={weight}
            onChangeText={setWeight}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="例: 60"
          />
        )}

        <TextInput label="回数 (Reps)" value={reps} onChangeText={setReps} mode="outlined" keyboardType="numeric" style={styles.input} placeholder="例: 10" />
        <TextInput label="セット数 (Sets)" value={sets} onChangeText={setSets} mode="outlined" keyboardType="numeric" style={styles.input} placeholder="例: 3" />
        <TextInput label="メモ (任意)" value={notes} onChangeText={setNotes} mode="outlined" multiline numberOfLines={3} style={styles.inputMultiline} placeholder="例: フォームに気をつけた" />
        <Button mode="contained" onPress={handleSaveTraining} style={styles.saveButton} labelStyle={styles.buttonLabel}>
          トレーニングを保存
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          戻る
        </Button>
      </View>
    </ScrollView>
  );
}

// --- スタイル定義 ---
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingBottom: 20 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  dateText: { fontSize: 18, color: '#555', marginBottom: 20 },
  input: { width: '100%', marginBottom: 15 },
  inputMultiline: { width: '100%', marginBottom: 15, minHeight: 80 },
  typeSelectionContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, width: '100%', justifyContent: 'center' },
  typeSelectionLabel: { fontSize: 16, marginRight: 10, fontWeight: 'bold', color: '#333' },
  typeButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginHorizontal: 5 },
  typeButtonActive: { backgroundColor: '#007aff', borderColor: '#007aff' },
  typeButtonText: { fontSize: 16, color: '#555' },
  typeButtonTextActive: { color: 'white', fontWeight: 'bold' },
  saveButton: { marginTop: 20, width: '80%' },
  buttonLabel: { fontSize: 18 },
  backButton: { marginTop: 10, width: '80%' },
});