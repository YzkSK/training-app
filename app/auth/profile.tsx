import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

// --- Convex と Clerk のインポート ---
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api'; // apiパスはプロジェクト構造に合わせて調整
import { useUser } from '@clerk/clerk-expo';

// --- 型定義 ---
// personal.tsのgenderの型に合わせる
type Gender = "男性" | "女性" | "その他";

// Convexから取得するプロフィールデータの型 (personal.tsのgetクエリの戻り値と一致させる)
type ProfileDataFromConvex = {
  _id: string; // Convex ドキュメントID
  _creationTime: number; // Convex ドキュメントの作成時刻
  userId: string; // 紐づくユーザーのID
  gender: Gender; // personal.tsのv.unionに合わせる
  age: number; // personal.tsのv.number()に合わせる
  height: number; // personal.tsのv.number()に合わせる
  weight: number; // personal.tsのv.number()に合わせる
  move_level: 0 | 1 | 2 | 3 | 4 | 5; // personal.tsのv.unionに合わせる (名前もmove_levelに)
};

// 入力フォームの状態を管理するための型
// TextInputのvalueはstring、性別はnullを許容
type ProfileInputData = {
  gender: Gender | null; // 初期値や未選択時にnullを許容
  age: string; // TextInput の value は string なので
  height: string;
  weight: string;
  level: 0 | 1 | 2 | 3 | 4 | 5; // フォームのレベル選択は0-5
};

const levelDescriptions = [
  '運動習慣がない',
  '初心者 (週1回程度)',
  '初級〜中級 (週2〜3回)',
  '中級者 (週3〜4回)',
  '中級〜上級 (週4〜5回)',
  '上級者 (週5回以上)',
];

export default function ProfileScreen() {
  const { isLoaded, isSignedIn, user } = useUser();

  // --- Convexフック ---
  // personal.ts の get クエリを呼び出す
  const convexProfile = useQuery(api.personal.get);
  // personal.ts の addOrUpdate ミューテーションを呼び出す
  const addOrUpdateProfile = useMutation(api.personal.addOrUpdate);

  // --- State定義 ---
  const [localProfileData, setLocalProfileData] = useState<ProfileInputData>({
    gender: null,
    age: '',
    height: '',
    weight: '',
    level: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingOperation, setIsLoadingOperation] = useState(false);

  // Convexからのデータロード時の処理
  useEffect(() => {
    if (convexProfile !== undefined && convexProfile !== null) {
      // Convexから取得したnumber型の値をstringに変換してフォームにセット
      setLocalProfileData({
        gender: convexProfile.gender,
        age: String(convexProfile.age),
        height: String(convexProfile.height),
        weight: String(convexProfile.weight),
        level: convexProfile.move_level, // move_level を level にマップ
      });
    } else if (convexProfile === null && isSignedIn) {
      // ログイン済みだがConvexにプロフィールがない場合、初期値をセット
      setLocalProfileData({
        gender: null,
        age: '',
        height: '',
        weight: '',
        level: 0,
      });
    }
  }, [convexProfile, isSignedIn]);

  // データ保存/作成処理
  const handleSave = async () => {
    setIsLoadingOperation(true); // 保存/作成開始
    try {
      // 入力値のバリデーションと型変換
      const parsedAge = parseInt(localProfileData.age, 10);
      const parsedHeight = parseFloat(localProfileData.height);
      const parsedWeight = parseFloat(localProfileData.weight);

      if (
        !localProfileData.gender || // 性別が選択されていない
        isNaN(parsedAge) || parsedAge <= 0 || // 年齢が数値でない、または0以下
        isNaN(parsedHeight) || parsedHeight <= 0 || // 身長が数値でない、または0以下
        isNaN(parsedWeight) || parsedWeight <= 0 // 体重が数値でない、または0以下
      ) {
        Alert.alert('入力エラー', 'すべての項目を正しく入力してください。');
        setIsLoadingOperation(false);
        return;
      }

      await addOrUpdateProfile({
        gender: localProfileData.gender, // Gender型 (男性/女性/その他)
        age: parsedAge, // number型に変換
        height: parsedHeight, // number型に変換
        weight: parsedWeight, // number型に変換
        move_level: localProfileData.level, // number型 (0-5)
      });
      Alert.alert('成功', 'プロフィールを保存しました。');
      setIsEditMode(false); // 保存後に表示モードに戻る
    } catch (e: any) {
      console.error('プロフィールの保存/作成に失敗しました。', e);
      Alert.alert('エラー', `プロフィールの保存/作成に失敗しました: ${e.message}`);
    } finally {
      setIsLoadingOperation(false); // 保存/作成終了
    }
  };

  // --- UIコンポーネント ---

  // 性別選択ボタン
  const GenderSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>性別</Text>
      <View style={styles.optionContainer}>
        {(['男性', '女性', 'その他'] as Gender[]).map((g) => ( // Gender型のリテラルを直接使用
          <TouchableOpacity
            key={g}
            style={[styles.optionButton, localProfileData.gender === g && styles.optionButtonActive]}
            onPress={() => setLocalProfileData({ ...localProfileData, gender: g })}
          >
            <Text style={[styles.optionText, localProfileData.gender === g && styles.optionTextActive]}>
              {g} {/* 日本語リテラルなのでそのまま表示 */}
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
            style={[styles.levelButton, localProfileData.level === l && styles.levelButtonActive]}
            onPress={() => setLocalProfileData({ ...localProfileData, level: l as 0 | 1 | 2 | 3 | 4 | 5 })}
          >
            <Text style={[styles.levelText, localProfileData.level === l && styles.levelTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.levelDescription}>{levelDescriptions[localProfileData.level]}</Text>
    </View>
  );

  // 表示モードのUI
  const renderDisplayMode = () => (
    <View style={styles.card}>
      <View style={styles.displayRow}>
        <Ionicons name="person-outline" size={24} color="#555" />
        <Text style={styles.displayLabel}>性別</Text>
        <Text style={styles.displayValue}>{localProfileData.gender || '未設定'}</Text>
      </View>
      <View style={styles.displayRow}>
        <Ionicons name="calendar-outline" size={24} color="#555" />
        <Text style={styles.displayLabel}>年齢</Text>
        <Text style={styles.displayValue}>{localProfileData.age ? `${localProfileData.age} 歳` : '未設定'}</Text>
      </View>
      <View style={styles.displayRow}>
        <Ionicons name="body-outline" size={24} color="#555" />
        <Text style={styles.displayLabel}>身長</Text>
        <Text style={styles.displayValue}>{localProfileData.height ? `${localProfileData.height} cm` : '未設定'}</Text>
      </View>
      <View style={styles.displayRow}>
        <Ionicons name="barbell-outline" size={24} color="#555" />
        <Text style={styles.displayLabel}>体重</Text>
        <Text style={styles.displayValue}>{localProfileData.weight ? `${localProfileData.weight} kg` : '未設定'}</Text>
      </View>
      <View style={styles.displayRow}>
        <Ionicons name="star-outline" size={24} color="#555" />
        <Text style={styles.displayLabel}>運動レベル</Text>
        <View style={styles.displayValueContainer}>
          <Text style={styles.displayValue}>{localProfileData.level}</Text>
          <Text style={styles.displaySubValue}>{levelDescriptions[localProfileData.level]}</Text>
        </View>
      </View>
      {isSignedIn && (
        <Button mode="contained" onPress={() => setIsEditMode(true)} style={styles.editButton}>
          編集する
        </Button>
      )}
    </View>
  );

  // 編集モードのUI
  const renderEditMode = () => (
    <View style={styles.card}>
      <GenderSelector />
      <TextInput
        label="年齢"
        value={localProfileData.age}
        onChangeText={(text) => setLocalProfileData({ ...localProfileData, age: text.replace(/[^0-9]/g, '') })}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="身長 (cm)"
        value={localProfileData.height}
        onChangeText={(text) => setLocalProfileData({ ...localProfileData, height: text.replace(/[^0-9.]/g, '') })}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="体重 (kg)"
        value={localProfileData.weight}
        onChangeText={(text) => setLocalProfileData({ ...localProfileData, weight: text.replace(/[^0-9.]/g, '') })}
        keyboardType="decimal-pad"
        mode="outlined"
        style={styles.input}
      />
      <LevelSelector />
      <Button mode="contained" onPress={handleSave} style={styles.saveButton} disabled={isLoadingOperation}>
        {isLoadingOperation ? '保存中...' : (convexProfile ? '更新する' : '登録する')}
      </Button>
      <Button
        mode="outlined"
        onPress={() => {
          // キャンセル時はConvexから取得した元のデータにリセット
          if (convexProfile) {
            setLocalProfileData({
              gender: convexProfile.gender,
              age: String(convexProfile.age), // numberをstringに戻す
              height: String(convexProfile.height), // numberをstringに戻す
              weight: String(convexProfile.weight), // numberをstringに戻す
              level: convexProfile.move_level, // move_level を level にマップ
            });
          } else {
            // 新規作成中のキャンセルなら初期値にリセット
            setLocalProfileData({ gender: null, age: '', height: '', weight: '', level: 0 });
          }
          setIsEditMode(false);
        }}
        style={styles.cancelButton}
        disabled={isLoadingOperation}
      >
        キャンセル
      </Button>
    </View>
  );

  // --- ローディングと認証状態のハンドリング ---
  if (!isLoaded || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.header}>認証情報を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>プロフィール</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>プロフィールを表示するにはログインが必要です。</Text>
            {/* ここにログインボタンなどを配置 */}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (convexProfile === undefined) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.header}>プロフィールデータを読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ログイン済みだが、Convexにプロフィールデータがまだない場合
  // 自動的に編集モードにして入力させる
  if (convexProfile === null && !isEditMode) {
    // 既にuseEffectでlocalProfileDataは初期化されている
    setIsEditMode(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>プロフィール</Text>
        {isEditMode ? renderEditMode() : renderDisplayMode()}
      </ScrollView>
    </SafeAreaView>
  );
}

// スタイルは変更なし
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
  displayValueContainer: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  displayValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007aff',
  },
  displaySubValue: {
    fontSize: 12,
    color: '#666',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    color: '#555',
  }
});