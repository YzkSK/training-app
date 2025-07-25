// app/PlaylistDetail.tsx
import { useLocalSearchParams, useNavigation } from 'expo-router'; // useLocalSearchParams と useNavigation をインポート
import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, UIManager, View, ViewStyle } from 'react-native';
import { usePlaylists } from '../contexts/PlaylistContext'; // app から contexts への相対パス

// LayoutAnimationをAndroidで有効化
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 仮の全アイテムデータ (fitness.tsxのinitialListDataを再利用)
interface ItemData {
  id: string;
  title: string;
  calories: string;
  showRefreshIcon?: boolean;
}

const allInitialListData: ItemData[] = [
  { id: 'item1', title: '足やせ', calories: '150kcal', showRefreshIcon: false },
  { id: 'item2', title: '火曜日', calories: '150kcal', showRefreshIcon: true },
  { id: 'item3', title: 'ランニング', calories: '400kcal', showRefreshIcon: false },
  { id: 'item4', title: 'ヨガ', calories: '100kcal', showRefreshIcon: false },
  { id: 'item5', title: '腕立て伏せ', calories: '80kcal', showRefreshIcon: false },
  { id: 'item6', title: 'スクワット', calories: '120kcal', showRefreshIcon: false },
  { id: 'item7', title: 'ストレッチ', calories: '50kcal', showRefreshIcon: false },
];

const PlaylistDetailScreen: React.FC = () => {
  const { playlistId, playlistName } = useLocalSearchParams<{ playlistId: string; playlistName: string }>(); // パラメータを取得
  const navigation = useNavigation();
  const { getPlaylistById } = usePlaylists(); // Contextからデータ取得ヘルパーを取得

  const [playlistItems, setPlaylistItems] = useState<ItemData[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // ナビゲーションヘッダーのタイトルを設定
    if (playlistName) {
      navigation.setOptions({ title: playlistName });
    }

    if (playlistId) {
        const playlist = getPlaylistById(playlistId);
        if (playlist) {
            const itemsInPlaylist = allInitialListData.filter(item =>
                playlist.items.includes(item.id)
            );
            setPlaylistItems(itemsInPlaylist);
        }
    }
  }, [playlistId, playlistName, getPlaylistById, navigation]);

  const toggleExpand = (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <View style={playlistDetailStyles.container}>
      {playlistItems.length === 0 ? (
        <Text style={playlistDetailStyles.emptyText}>この再生リストにはアイテムがありません。</Text>
      ) : (
        <ScrollView style={playlistDetailStyles.scrollView}>
          {playlistItems.map(item => (
            <View key={item.id} style={playlistDetailStyles.accordionItemContainer}>
              <TouchableOpacity
                style={playlistDetailStyles.accordionHeader}
                onPress={() => toggleExpand(item.id)}
              >
                <Text style={playlistDetailStyles.accordionTitle}>{item.title}</Text>
              </TouchableOpacity>
              {expandedItems[item.id] && (
                <View style={playlistDetailStyles.accordionContent}>
                  <Text style={playlistDetailStyles.accordionText}>カロリー: {item.calories}</Text>
                  {item.showRefreshIcon && <Text style={playlistDetailStyles.accordionText}>更新アイコンあり</Text>}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const playlistDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  } as TextStyle,
  accordionItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  } as ViewStyle,
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  } as ViewStyle,
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  } as TextStyle,
  accordionContent: {
    padding: 15,
    backgroundColor: '#fff',
  } as ViewStyle,
  accordionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  } as TextStyle,
});

export default PlaylistDetailScreen;