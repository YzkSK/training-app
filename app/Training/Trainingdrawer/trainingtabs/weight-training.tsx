import { Ionicons } from '@expo/vector-icons';
// AsyncStorage はもう使用しません
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState, useMemo, useEffect } from 'react'; // useMemo, useEffect をインポート
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'; // Alert をインポート
import FloatingActionButton from '../../../../components/Trainingfab';

import { useQuery, useMutation } from 'convex/react'; // Convex hooksをインポート
import { api } from '../../../../convex/_generated/api'; // Convex APIをインポート
import { Doc, Id } from '../../../../convex/_generated/dataModel'; // ConvexのDocとId型をインポート

// --- 型定義 ---
// Convexのw_trainingテーブルのDoc型を直接使用
type TrainingData = Doc<'w_training'>;
// notes は Convex スキーマに v.optional(v.string()) を追加した場合、TrainingData に notes?: string; を含めることができます

// GroupedTrainingData はフロントエンドの表示用に保持
type GroupedTrainingData = {
  [date: string]: TrainingData[];
};

// STORAGE_KEY はもう不要
// const STORAGE_KEY = '@myTrainingApp:logs';

export default function Tab() {
  // Convexからすべてのウエイトトレーニング記録を取得
  const allWeightTrainings = useQuery(api.w_training.list);
  // トレーニング記録を削除するConvexミューテーション
  const deleteWeightTraining = useMutation(api.w_training.remove); // remove は後で定義します

  const [isLoading, setIsLoading] = useState(true);
  // ★ 新しいState: 削除確認中のIDを保持する (Convexの_id型に合わせる)
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<'w_training'> | null>(null);

  // allWeightTrainings (Convexからのデータ) が更新されたときに isLoading を更新
  useEffect(() => {
    if (allWeightTrainings !== undefined) {
      setIsLoading(false);
    }
  }, [allWeightTrainings]);

  // Convexから取得したデータを日付ごとにグループ化するメモ化された関数
  const groupedTrainings: GroupedTrainingData = useMemo(() => {
    const grouped: GroupedTrainingData = {};
    if (allWeightTrainings) {
      // allWeightTrainingsはすでに新しい順にソートされているので、そのまま使用
      for (const training of allWeightTrainings) {
        // ConvexのdateフィールドはYYYY-MM-DD形式を期待
        const date = training.date;
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(training);
      }
    }
    return grouped;
  }, [allWeightTrainings]); // allWeightTrainings が変更されたら再計算

  useFocusEffect(
    useCallback(() => {
      // 画面からフォーカスが外れたら、削除確認状態をリセットする
      return () => setPendingDeleteId(null);
    }, [])
  );

  // 削除実行関数 (ConvexのIDを使用)
  const executeDelete = async (trainingId: Id<'w_training'>) => {
    try {
      await deleteWeightTraining({ id: trainingId });
      Alert.alert('削除完了', 'トレーニング記録が正常に削除されました。');
      // ConvexのuseQueryが自動的にデータを再フェッチするため、
      // 手動でweightTrainingsを更新する必要はありません。
    } catch (e) {
      console.error('Failed to delete training:', e);
      Alert.alert('削除エラー', 'トレーニング記録の削除中に問題が発生しました。');
    } finally {
      // 削除確認状態を解除
      setPendingDeleteId(null);
    }
  };

  // リスト項目のレンダリング
  const renderTrainingItem = ({ item }: { item: TrainingData }) => {
    const isPendingDelete = pendingDeleteId === item._id;

    if (isPendingDelete) {
      return (
        <View style={[styles.trainingItem, styles.pendingDeleteBackground]}>
          <Text style={styles.confirmText}>本当に削除しますか？</Text>
          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity onPress={() => setPendingDeleteId(null)} style={styles.iconButton}>
              <Ionicons name="close-circle-outline" size={30} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => executeDelete(item._id)} style={styles.iconButton}>
              <Ionicons name="checkmark-circle" size={30} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.trainingItem}>
        <View style={styles.trainingInfo}>
          <Text style={styles.trainingTitle}>{item.exercise}</Text>
          {/* 重量(kg)も表示 */}
          <Text style={styles.trainingValues}>
            {item.weight} kg × {item.reps} reps × {item.sets} sets
          </Text>
          {/* item.notes はConvexスキーマにあれば表示。なければこの行は削除 */}
        </View>
        <TouchableOpacity onPress={() => setPendingDeleteId(item._id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDateSection = ({ item: date }: { item: string }) => (
    <View style={styles.dateSection} key={date}>
      <Text style={styles.dateHeader}>{date}</Text>
      <FlatList
        data={groupedTrainings[date]} // groupedTrainings を使用
        renderItem={({ item }) => renderTrainingItem({ item })} // item のみ渡す
        keyExtractor={(item) => item._id} // Convexの_id をキーにする
        scrollEnabled={false}
      />
    </View>
  );

  const sortedDates = Object.keys(groupedTrainings).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <View style={styles.container}>
       <ScrollView style={styles.scrollView} onScrollBeginDrag={() => setPendingDeleteId(null)}>
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