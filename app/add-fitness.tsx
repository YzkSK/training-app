// app/add-training.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router'; // useLocalSearchParams をインポート
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

// --- 型定義 ---
type TrainingData = {
  id: number;
  title: string;
  values: { [key: string]: string };
  type: 'weight' | 'bodyweight';
  notes?: string; // メモも保存できるように追加
};

const STORAGE_KEY = '@myTrainingApp:logs'; 

export default function AddTrainingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ルーターからパラメータを取得

  // --- State定義 ---
  const [trainingName, setTrainingName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
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
    if (!reps.trim() || isNaN(Number(reps))) {
      Alert.alert('エラー', '回数を数字で入力してください。');
      return;
    }
    if (!sets.trim() || isNaN(Number(sets))) {
      Alert.alert('エラー', 'セット数を数字で入力してください。');
      return;
    }

    // --- 保存するデータを作成 ---
    const newTraining: TrainingData = {
      id: Date.now(),
      title: trainingName.trim(),
      values: { 
        kg: trainingType === 'weight' ? weight.trim() : '',
        reps: reps.trim(), 
        sets: sets.trim() 
      }, 
      type: trainingType,
      notes: notes.trim(), // メモも保存
    };

    try {
      // --- AsyncStorageへの保存処理 ---
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      let allLogs = jsonValue !== null ? JSON.parse(jsonValue) : {};
      const currentDayLogs = allLogs[dateKey] ? [...allLogs[dateKey]] : [];
      
      const isDuplicate = currentDayLogs.some(t => t.title === newTraining.title && t.type === newTraining.type);
      if (isDuplicate) {
        Alert.alert('エラー', '同じ名前のトレーニングが既にこの日に存在します。');
        return;
      }

      const updatedDayLogs = [...currentDayLogs, newTraining];
      allLogs[dateKey] = updatedDayLogs;

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
      Alert.alert('成功', 'トレーニングが保存されました！', [
        { text: 'OK', onPress: () => router.replace('/') } 
      ]);

    } catch (e) {
      console.error('トレーニングの保存に失敗しました:', e);
      Alert.alert('エラー', 'トレーニングの保存に失敗しました。');
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
          placeholder="例: スクワット"
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
  backButton: { marginTop: 10, width: '80%' }, // 追加
});