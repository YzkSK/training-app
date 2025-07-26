// app/drawer/record.tsx
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Svg, { Circle } from 'react-native-svg';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel'; // ConvexのDoc型をインポート

// 仮のContextやデータインターフェース (Convexのデータ構造に合わせる)
// Convexから取得する日次記録の型
interface DailyKcalRecord extends Doc<'kcal_record'> {}

// ユーザーのメトリクス（目標値や基礎代謝など、将来的にはConvexで管理するべきデータ）
interface UserMetrics {
  dailyBasalMetabolicRate: number; // 基礎代謝（今回はフロントエンドで仮で保持）
  dailyExerciseCalories: number; // その日の運動による消費カロリー（Convexから取得）
  dailyIntakeCalories: number; // その日の摂取カロリー（Convexから取得）
  targetConsumption: number; // 目標消費カロリー（今回はフロントエンドで仮で保持）
  targetIntake: number; // 目標摂取カロリー（今回はフロントエンドで仮で保持）
}

// 円グラフのコンポーネント (変更なし)
interface ActivityRingProps {
  consumption: number; // 消費カロリー
  targetConsumption: number; // 目標消費カロリー
  intake: number; // 摂取カロリー
  targetIntake: number; // 目標摂取カロリー
}

const ActivityRing: React.FC<ActivityRingProps> = ({
  consumption,
  targetConsumption,
  intake,
  targetIntake,
}) => {
  const size = Dimensions.get('window').width * 0.6; // 画面幅の60%
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const consumptionProgress = Math.min(consumption / targetConsumption, 1);
  const consumptionStrokeDashoffset = circumference * (1 - consumptionProgress);

  const intakeProgress = Math.min(intake / targetIntake, 1);
  const intakeStrokeDashoffset = circumference * (1 - intakeProgress);

  return (
    <View style={recordScreenStyles.ringContainer}>
      <Svg width={size} height={size}>
        {/* 外側の背景リング（消費カロリー） */}
        <Circle
          stroke="#ccc"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* 内側の背景リング（摂取カロリー） */}
        <Circle
          stroke="#ccc"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 5}
          strokeWidth={strokeWidth}
          opacity={0.3}
        />

        {/* 外側の進捗リング（消費カロリー） */}
        <Circle
          stroke="#A2FF86" // 消費カロリーの色 (緑)
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={consumptionStrokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
        {/* 内側の進捗リング（摂取カロリー） */}
        <Circle
          stroke="#FFD700" // 摂取カロリーの色 (黄)
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 5}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={intakeStrokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={recordScreenStyles.ringLabels}>
        <Text style={recordScreenStyles.ringLabelText}>{`${Math.round(consumption)} / ${targetConsumption} Kcal`}</Text>
        <Text style={recordScreenStyles.ringSubLabelText}>消費</Text>
        <Text style={recordScreenStyles.ringLabelText}>{`${Math.round(intake)} / ${targetIntake} Kcal`}</Text>
        <Text style={recordScreenStyles.ringSubLabelText}>摂取</Text>
      </View>
    </View>
  );
};


const RecordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD形式
  const [currentDateDisplay, setCurrentDateDisplay] = useState(''); // 表示用日付

  // Convexから選択された日付のカロリー記録を取得
  // api.kcal_record.get_by_date は後で定義します
  const dailyRecord = useQuery(api.kcal_record.get_by_date, { date: selectedDate });

  // カロリー記録を更新するConvexミューテーション
  const addKcalRecord = useMutation(api.kcal_record.add);
  const updateKcalRecord = useMutation(api.kcal_record.update); // 更新用ミューテーションも必要 (後で定義)

  // ユーザーメトリクス（基礎代謝と目標カロリーは、Convexから取得しない限りダミー値を保持）
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    dailyBasalMetabolicRate: 1500, // 仮の基礎代謝
    dailyExerciseCalories: 0, // Convexから取得
    dailyIntakeCalories: 0, // Convexから取得
    targetConsumption: 2000, // 仮の目標消費カロリー
    targetIntake: 1800, // 仮の目標摂取カロリー
  });
  const [intakeInput, setIntakeInput] = useState('');

  // 日付が変更されたときに表示を更新
  useEffect(() => {
    const dateObj = new Date(selectedDate);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', weekday: 'long' };
    setCurrentDateDisplay(dateObj.toLocaleDateString('ja-JP', options));
  }, [selectedDate]);

  // dailyRecord (Convexからのデータ) が更新されたときにUserMetricsを更新
  useEffect(() => {
    setUserMetrics(prev => ({
      ...prev,
      // Convexからのデータを反映
      dailyIntakeCalories: dailyRecord?.intakeCalories || 0,
      dailyExerciseCalories: dailyRecord?.burnedCalories || 0, // このburnedCaloriesは運動によるものと仮定
      // dailyBasalMetabolicRate と targetXXX は、Convexのuser設定から取得するように拡張可能
    }));
  }, [dailyRecord]); // dailyRecord が変わるたびに実行

  // 基礎代謝は固定値として合計消費カロリーに含める
  const totalConsumption = userMetrics.dailyBasalMetabolicRate + userMetrics.dailyExerciseCalories;

  const handleSaveIntake = async () => {
    const parsedIntake = Number(intakeInput);
    if (isNaN(parsedIntake) || parsedIntake < 0) {
      Alert.alert('入力エラー', '有効な摂取カロリーを入力してください。');
      return;
    }

    try {
      if (dailyRecord) {
        // 既存の記録がある場合は更新
        await updateKcalRecord({
          recordId: dailyRecord._id,
          date: selectedDate, // 日付は変更しないが、引数として渡す
          intakeCalories: parsedIntake,
          burnedCalories: dailyRecord.burnedCalories // 運動カロリーはそのまま維持
        });
        Alert.alert('更新完了', `${parsedIntake}kcal に摂取カロリーを更新しました。`);
      } else {
        // 新しい記録がない場合は追加
        await addKcalRecord({
          date: selectedDate,
          intakeCalories: parsedIntake,
          burnedCalories: userMetrics.dailyExerciseCalories, // その日の運動カロリーも一緒に保存
        });
        Alert.alert('保存完了', `${parsedIntake}kcal を摂取カロリーとして記録しました。`);
      }
      setIntakeInput(''); // 入力フィールドをクリア
    } catch (error) {
      console.error('カロリー記録の保存/更新中にエラー:', error);
      Alert.alert('エラー', 'カロリー記録の保存中に問題が発生しました。');
    }
  };


  return (
    <SafeAreaView style={recordScreenStyles.safeArea}>
      <ScrollView contentContainerStyle={recordScreenStyles.scrollViewContent}>
        {/* ヘッダー部分 */}
        <View style={recordScreenStyles.header}>
          <View>
            <Text style={recordScreenStyles.dateText}>{currentDateDisplay}</Text>
          </View>
          {/* カレンダーアイコンに変更 */}
          <TouchableOpacity
            style={recordScreenStyles.profileIconContainer}
            onPress={() => setIsCalendarVisible(true)}
          >
            <AntDesign name="calendar" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* アクティビティリング部分 */}
        <View style={recordScreenStyles.activityRingSection}>
          {/* dailyRecord が undefined の場合はローディング表示などを考慮 */}
          {dailyRecord === undefined ? (
              <Text style={recordScreenStyles.loadingText}>データを読み込み中...</Text>
          ) : (
            <ActivityRing
              consumption={totalConsumption}
              targetConsumption={userMetrics.targetConsumption}
              intake={userMetrics.dailyIntakeCalories}
              targetIntake={userMetrics.targetIntake}
            />
          )}
          <View style={recordScreenStyles.ringLegend}>
            <View style={recordScreenStyles.legendItem}>
              <View style={[recordScreenStyles.legendColor, { backgroundColor: '#A2FF86' }]} />
              <Text style={recordScreenStyles.legendText}>消費カロリー</Text>
            </View>
            <View style={recordScreenStyles.legendItem}>
              <View style={[recordScreenStyles.legendColor, { backgroundColor: '#FFD700' }]} />
              <Text style={recordScreenStyles.legendText}>摂取カロリー</Text>
            </View>
          </View>
        </View>

        {/* 摂取カロリー入力欄 */}
        <View style={recordScreenStyles.intakeInputSection}>
          <Text style={recordScreenStyles.inputSectionTitle}>摂取カロリー記録</Text>
          <TextInput
            style={recordScreenStyles.textInput}
            keyboardType="numeric"
            value={intakeInput}
            onChangeText={setIntakeInput}
            placeholder="今日の摂取カロリーを入力 (kcal)"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={recordScreenStyles.saveButton} onPress={handleSaveIntake}>
            <Text style={recordScreenStyles.saveButtonText}>記録を保存</Text>
          </TouchableOpacity>
          <Text style={recordScreenStyles.currentIntakeText}>現在の摂取カロリー: {userMetrics.dailyIntakeCalories} kcal</Text>
        </View>

      </ScrollView>

      {/* カレンダーモーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => {
          setIsCalendarVisible(!isCalendarVisible);
        }}
      >
        <View style={recordScreenStyles.centeredView}>
          <View style={recordScreenStyles.calendarModalView}>
            <Calendar
              onDayPress={day => {
                setSelectedDate(day.dateString);
                setIsCalendarVisible(false);
              }}
              markedDates={{
                [selectedDate]: { selected: true, marked: true, selectedColor: '#007AFF' },
              }}
              theme={{
                arrowColor: '#007AFF',
                todayTextColor: '#007AFF',
                selectedDayBackgroundColor: '#007AFF',
                dotColor: '#007AFF',
                textSectionTitleColor: '#b6c1cd',
              }}
            />
            <TouchableOpacity
              style={recordScreenStyles.closeCalendarButton}
              onPress={() => setIsCalendarVisible(false)}
            >
              <Text style={recordScreenStyles.closeCalendarButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const recordScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  } as ViewStyle,
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 20,
  },
  profileIconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  } as ViewStyle,
  ringLabels: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -30 }],
  } as ViewStyle,
  ringLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  } as TextStyle,
  ringSubLabelText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  } as TextStyle,
  titleText: { // 現在使われていないが、残しておく
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  }