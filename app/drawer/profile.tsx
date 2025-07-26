import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

// --- 型定義 ---
type Gender = 'male' | 'female' | 'other';
type ProfileData = {
  gender: Gender | null;
  age: string;
  height: string;
  weight: string;
  level: number;
};

const PROFILE_STORAGE_KEY = '@myTrainingApp:profile';

// ★ 運動レベルの説明を追加
const levelDescriptions = [
  '運動習慣がない',
  '初心者 (週1回程度)',
  '初級〜中級 (週2〜3回)',
  '中級者 (週3〜4回)',
  '中級〜上級 (週4〜5回)',
  '上級者 (週5回以上)',
];

export default function ProfileScreen() {
  // --- State定義 ---
  const [profile, setProfile] = useState<ProfileData>({
    gender: null,
    age: '',
    height: '',
    weight: '',
    level: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // --- データ読み込み処理 ---
  const loadProfile = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (jsonValue !== null) {
        setProfile(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load profile.', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  // --- データ保存処理 ---
  const handleSave = async () => {
    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, jsonValue);
      setIsEditMode(false); // 保存後に表示モードに戻る
      Alert.alert('成功', 'プロフィールを保存しました。');
    } catch (e) {
      Alert.alert('エラー', 'プロフィールの保存に失敗しました。');
      console.error('Failed to save profile.', e);
    }
  };

  // --- UIコンポーネント ---

  // 性別選択ボタン
  const GenderSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>性別</Text>
      <View style={styles.optionContainer}>
        {(['male', 'female', 'other'] as Gender[]).map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.optionButton, profile.gender === g && styles.optionButtonActive]}
            onPress={() => setProfile({ ...profile, gender: g })}
          >
            <Text style={[styles.optionText, profile.gender === g && styles.optionTextActive]}>
              {g === 'male' ? '男性' : g === 'female' ? '女性' : 'その他'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // 運動レベル選択
  const LevelSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>運動レベル</Text>
      <View style={styles.optionContainer}>
        {[0, 1, 2, 3, 4, 5].map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.levelButton, profile.level === l && styles.levelButtonActive]}
            onPress={() => setProfile({ ...profile, level: l })}
          >
            <Text style={[styles.levelText, profile.level === l && styles.levelTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* ★ 選択中のレベルの説明を表示 */}
      <Text style={styles.levelDescription}>{levelDescriptions[profile.level]}</Text>
    </View>
  );
  
  // 表示モードのUI
  const renderDisplayMode = () => (
    <View style={styles.card}>
        <View style={styles.displayRow}>
            <Ionicons name="person-outline" size={24} color="#555" />
            <Text style={styles.displayLabel}>性別</Text>
            <Text style={styles.displayValue}>{profile.gender ? (profile.gender === 'male' ? '男性' : profile.gender === 'female' ? '女性' : 'その他') : '未設定'}</Text>
        </View>
        <View style={styles.displayRow}>
            <Ionicons name="calendar-outline" size={24} color="#555" />
            <Text style={styles.displayLabel}>年齢</Text>
            <Text style={styles.displayValue}>{profile.age ? `${profile.age} 歳` : '未設定'}</Text>
        </View>
        <View style={styles.displayRow}>
            <Ionicons name="body-outline" size={24} color="#555" />
            <Text style={styles.displayLabel}>身長</Text>
            <Text style={styles.displayValue}>{profile.height ? `${profile.height} cm` : '未設定'}</Text>
        </View>
        <View style={styles.displayRow}>
            <Ionicons name="barbell-outline" size={24} color="#555" />
            <Text style={styles.displayLabel}>体重</Text>
            <Text style={styles.displayValue}>{profile.weight ? `${profile.weight} kg` : '未設定'}</Text>
        </View>
        <View style={styles.displayRow}>
            <Ionicons name="star-outline" size={24} color="#555" />
            <Text style={styles.displayLabel}>運動レベル</Text>
            {/* ★ レベルと説明を両方表示 */}
            <View style={styles.displayValueContainer}>
              <Text style={styles.displayValue}>{profile.level ?? '0'}</Text>
              <Text style={styles.displaySubValue}>{levelDescriptions[profile.level]}</Text>
            </View>
        </View>
        <Button mode="contained" onPress={() => setIsEditMode(true)} style={styles.editButton}>
            編集する
        </Button>
    </View>
  );

  // 編集モードのUI
  const renderEditMode = () => (
    <View style={styles.card}>
      <GenderSelector />
      <TextInput
        label="年齢"
        value={profile.age}
        onChangeText={(text) => setProfile({ ...profile, age: text.replace(/[^0-9]/g, '') })}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="身長 (cm)"
        value={profile.height}
        onChangeText={(text) => setProfile({ ...profile, height: text.replace(/[^0-9.]/g, '') })}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="体重 (kg)"
        value={profile.weight}
        onChangeText={(text) => setProfile({ ...profile, weight: text.replace(/[^0-9.]/g, '') })}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
      />
      <LevelSelector />
      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        保存する
      </Button>
      <Button mode="outlined" onPress={() => { loadProfile(); setIsEditMode(false); }} style={styles.cancelButton}>
        キャンセル
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>プロフィール</Text>
        {isEditMode ? renderEditMode() : renderDisplayMode()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  optionButtonActive: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  levelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  levelButtonActive: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  levelText: {
    fontSize: 16,
    color: '#333',
  },
  levelTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // ★ 説明用のスタイルを追加
  levelDescription: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 5,
  },
  cancelButton: {
    marginTop: 10,
  },
  editButton: {
    marginTop: 20,
    paddingVertical: 5,
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  displayLabel: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
  // ★ 表示モードで値を右寄せにするためのコンテナ
  displayValueContainer: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  displayValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007aff',
  },
  // ★ 表示モードの説明用スタイル
  displaySubValue: {
    fontSize: 12,
    color: '#666',
  },
});
