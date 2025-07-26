// app/drawer/record.tsx
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Calendar をインポート
import Svg, { Circle } from 'react-native-svg';

// 仮のContextやデータインターフェース (実際には既存のContextを拡張したり新規作成)
interface UserMetrics {
  dailyBasalMetabolicRate: number; // 基礎代謝（ダミー値）
  dailyExerciseCalories: number; // 運動による消費カロリー（ダミー値）
  dailyIntakeCalories: number; // 摂取カロリー（ここで入力）
  targetConsumption: number; // 目標消費カロリー
  targetIntake: number; // 目標摂取カロリー
}

// 円グラフのコンポーネント
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
          stroke="#ccc" // 背景色を明るめに
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* 内側の背景リング（摂取カロリー） */}
        <Circle
          stroke="#ccc" // 背景色を明るめに
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
  const [isCalendarVisible, setIsCalendarVisible] = useState(false); // カレンダーモーダルの表示状態
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD形式
  const [currentDate, setCurrentDate] = useState(''); // 表示用日付
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    dailyBasalMetabolicRate: 1500,
    dailyExerciseCalories: 300,
    dailyIntakeCalories: 0,
    targetConsumption: 2000,
    targetIntake: 1800,
  });
  const [intakeInput, setIntakeInput] = useState('');

  useEffect(() => {
    // currentDate を selectedDate に基づいて設定
    const dateObj = new Date(selectedDate);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', weekday: 'long' };
    setCurrentDate(dateObj.toLocaleDateString('ja-JP', options));

    // ★★★ ここからユーザーのデータシミュレーションロジック ★★★
    // 選択された日付に基づいてダミーの userMetrics を更新
    const dayOfMonth = new Date(selectedDate).getDate();
    setUserMetrics(prev => ({
      ...prev,
      dailyBasalMetabolicRate: 1500 + (dayOfMonth % 5) * 50, // 日付によって少し変化
      dailyExerciseCalories: 300 + (dayOfMonth % 7) * 20,
      dailyIntakeCalories: 0, // 摂取カロリーは入力待ちなのでリセット
    }));
    // ★★★ ここまでユーザーのデータシミュレーションロジック ★★★

  }, [selectedDate]);

  const totalConsumption = userMetrics.dailyBasalMetabolicRate + userMetrics.dailyExerciseCalories;

  const handleSaveIntake = () => {
    const parsedIntake = Number(intakeInput);
    if (isNaN(parsedIntake) || parsedIntake < 0) {
      Alert.alert('入力エラー', '有効な摂取カロリーを入力してください。');
      return;
    }
    setUserMetrics(prev => ({ ...prev, dailyIntakeCalories: parsedIntake }));
    setIntakeInput('');
    Alert.alert('保存完了', `${parsedIntake}kcal を摂取カロリーとして記録しました。`);
  };


  return (
    <SafeAreaView style={recordScreenStyles.safeArea}>
      <ScrollView contentContainerStyle={recordScreenStyles.scrollViewContent}>
        {/* ヘッダー部分 */}
        <View style={recordScreenStyles.header}>
          <View>
            <Text style={recordScreenStyles.dateText}>{currentDate}</Text>
          </View>
          {/* カレンダーアイコンに変更 */}
          <TouchableOpacity
            style={recordScreenStyles.profileIconContainer}
            onPress={() => setIsCalendarVisible(true)} // タップでモーダル表示
          >
            <AntDesign name="calendar" size={24} color="#333" /> {/* アイコンをカレンダーに変更 */}
          </TouchableOpacity>
        </View>

        {/* アクティビティリング部分 */}
        <View style={recordScreenStyles.activityRingSection}>
          <ActivityRing
            consumption={totalConsumption}
            targetConsumption={userMetrics.targetConsumption}
            intake={userMetrics.dailyIntakeCalories}
            targetIntake={userMetrics.targetIntake}
          />
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
                setSelectedDate(day.dateString); // 日付選択
                setIsCalendarVisible(false); // モーダルを閉じる
              }}
              markedDates={{
                [selectedDate]: { selected: true, marked: true, selectedColor: '#007AFF' },
              }}
              theme={{
                arrowColor: '#007AFF', // 矢印の色
                todayTextColor: '#007AFF', // 今日の日付の色
                selectedDayBackgroundColor: '#007AFF', // 選択された日付の背景色
                dotColor: '#007AFF', // ドットの色
                textSectionTitleColor: '#b6c1cd', // 曜日表示の色
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
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIconContainer: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 8,
  },
  activityRingSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ringLabels: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringLabelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ringSubLabelText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ringLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 5,
  },
  legendText: {
    color: '#333',
    fontSize: 14,
  },
  intakeInputSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 30,
  },
  inputSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentIntakeText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  centeredView: { // モーダル背景
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as ViewStyle,
  calendarModalView: { // モーダルコンテンツ
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  } as ViewStyle,
  closeCalendarButton: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  } as ViewStyle,
  closeCalendarButtonText: {
    color: 'black',
    fontWeight: 'bold',
  } as TextStyle,
});

export default RecordScreen;