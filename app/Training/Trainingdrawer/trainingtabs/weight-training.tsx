import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FloatingActionButton from '../../../../components/Trainingfab';

// --- 型定義 ---
type TrainingData = {
  id: number;
  title: string;
  values: { [key: string]: string };
  type: 'weight' | 'bodyweight';
  notes?: string;
};

type GroupedTrainingData = {
  [date: string]: TrainingData[];
};

const STORAGE_KEY = '@myTrainingApp:logs';

export default function Tab() {
  const [weightTrainings, setWeightTrainings] = useState<GroupedTrainingData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // データの読み込み処理
  const loadWeightTrainings = useCallback(async () => {
    setIsLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const allLogs = jsonValue ? (JSON.parse(jsonValue) as GroupedTrainingData) : {};
      const weightLogs: GroupedTrainingData = {};
      for (const date in allLogs) {
        // 'weight'タイプのトレーニングのみをフィルタリング
        const filteredLogs = allLogs[date].filter(log => log.type === 'weight');
        if (filteredLogs.length > 0) {
          weightLogs[date] = filteredLogs;
        }
      }
      setWeightTrainings(weightLogs);
    } catch (e) {
      console.error('Failed to fetch weight trainings:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWeightTrainings();
      return () => setPendingDeleteId(null);
    }, [loadWeightTrainings])
  );

  // 削除実行関数
  const executeDelete = async (trainingId: number, date: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      let allLogs: GroupedTrainingData = jsonValue ? JSON.parse(jsonValue) : {};

      if (allLogs[date]) {
        allLogs[date] = allLogs[date].filter(training => training.id !== trainingId);
        if (allLogs[date].length === 0) {
          delete allLogs[date];
        }
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
        
        // Stateを直接更新
        setWeightTrainings(currentTrainings => {
          const newTrainings = { ...currentTrainings };
          if (newTrainings[date]) {
            newTrainings[date] = newTrainings[date].filter(t => t.id !== trainingId);
            if (newTrainings[date].length === 0) {
              delete newTrainings[date];
            }
          }
          return newTrainings;
        });
      }
    } catch (e) {
      console.error('Failed to delete training:', e);
    } finally {
      setPendingDeleteId(null);
    }
  };

  // リスト項目のレンダリング
  const renderTrainingItem = ({ item, date }: { item: TrainingData; date: string }) => {
    const isPendingDelete = pendingDeleteId === item.id;

    if (isPendingDelete) {
      return (
        <View style={[styles.trainingItem, styles.pendingDeleteBackground]}>
          <Text style={styles.confirmText}>本当に削除しますか？</Text>
          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity onPress={() => setPendingDeleteId(null)} style={styles.iconButton}>
              <Ionicons name="close-circle-outline" size={30} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => executeDelete(item.id, date)} style={styles.iconButton}>
              <Ionicons name="checkmark-circle" size={30} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.trainingItem}>
        <View style={styles.trainingInfo}>
          <Text style={styles.trainingTitle}>{item.title}</Text>
          {/* 重量(kg)も表示 */}
          <Text style={styles.trainingValues}>
            {item.values.kg} kg × {item.values.reps} reps × {item.values.sets} sets
          </Text>
          {item.notes && <Text style={styles.notesText}>Notes: {item.notes}</Text>}
        </View>
        <TouchableOpacity onPress={() => setPendingDeleteId(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDateSection = ({ item: date }: { item: string }) => (
    <View style={styles.dateSection} key={date}>
      <Text style={styles.dateHeader}>{date}</Text>
      <FlatList
        data={weightTrainings[date]}
        renderItem={({ item }) => renderTrainingItem({ item, date })}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );

  const sortedDates = Object.keys(weightTrainings).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <View style={styles.container}>
       <ScrollView style={styles.scrollView} onScrollBeginDrag={() => setPendingDeleteId(null)}>
        {/* ヘッダーを変更 */}
        <Text style={styles.header}>ウエイトトレーニング記録</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>読み込み中...</Text>
        ) : sortedDates.length > 0 ? (
          <FlatList
            data={sortedDates}
            renderItem={renderDateSection}
            keyExtractor={(date) => date}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="barbell" size={50} color="#ccc" />
            {/* メッセージを変更 */}
            <Text style={styles.noDataText}>記録されたウエイトトレーニングはありません。</Text>
          </View>
        )}
      </ScrollView>
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 20,
    },
    dateSection: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    dateHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#007aff',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 10,
    },
    trainingItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trainingInfo: {
        flex: 1,
    },
    trainingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    trainingValues: {
        fontSize: 16,
        color: '#333',
    },
    notesText: {
        fontStyle: 'italic',
        color: '#555',
        marginTop: 5,
    },
    deleteButton: {
        padding: 8,
        marginLeft: 10,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        color: '#888',
    },
    pendingDeleteBackground: {
      backgroundColor: '#fff0f0',
      borderColor: '#ff3b30',
      borderWidth: 1,
    },
    confirmText: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    confirmButtonContainer: {
      flexDirection: 'row',
    },
    iconButton: {
      padding: 8,
      marginLeft: 15,
    },
});