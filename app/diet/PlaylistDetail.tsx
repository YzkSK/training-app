// app/PlaylistDetail.tsx (修正後 - PlaylistProvider をコンポーネント内部でラップ)
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, UIManager, View, ViewStyle } from 'react-native';
import { ItemDetailData, PlaylistProvider, usePlaylists } from '../drawer/contexts/PlaylistContext'; // PlaylistProvider もインポート

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PlaylistDetailScreen: React.FC = () => {
  const { playlistId, playlistName } = useLocalSearchParams<{ playlistId: string; playlistName: string }>();
  const navigation = useNavigation();

  const { getPlaylistById, allItems, updateItemData } = usePlaylists(); // ここで usePlaylists を呼び出す

  const [playlistItems, setPlaylistItems] = useState<ItemDetailData[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [editedItems, setEditedItems] = useState<Record<string, ItemDetailData>>({});

  useEffect(() => {
    console.log('PlaylistDetailScreen: Received playlistId:', playlistId, 'playlistName:', playlistName);

    if (playlistName) {
      navigation.setOptions({ title: playlistName });
    }

    if (playlistId) {
      const playlist = getPlaylistById(playlistId);
      console.log('PlaylistDetailScreen: Found playlist in context:', playlist);
      if (playlist) {
        console.log('PlaylistDetailScreen: allItems from context:', allItems);
        console.log('PlaylistDetailScreen: playlist.items (IDs):', playlist.items);

        const itemsInPlaylist = playlist.items.map(itemId =>
          allItems.find(item => item.id === itemId)
        ).filter(Boolean) as ItemDetailData[];
        
        console.log('PlaylistDetailScreen: Filtered itemsInPlaylist:', itemsInPlaylist);

        setPlaylistItems(itemsInPlaylist);
        
        const initialEdited: Record<string, ItemDetailData> = {};
        itemsInPlaylist.forEach(item => {
          initialEdited[item.id] = { ...item };
        });
        setEditedItems(initialEdited);
      } else {
          console.warn(`PlaylistDetailScreen: Playlist with ID ${playlistId} not found.`);
      }
    } else {
        console.warn('PlaylistDetailScreen: playlistId is undefined.');
    }
  }, [playlistId, playlistName, getPlaylistById, allItems, navigation]);

  const toggleExpand = (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleInputChange = (itemId: string, field: 'repsOrDuration' | 'baseCalories', value: string) => {
    setEditedItems(prev => {
      const updatedItem = { ...prev[itemId] };
      const numericValue = Number(value) || 0;

      if (field === 'baseCalories') {
        updatedItem.baseCalories = numericValue;
      } else {
        updatedItem.repsOrDuration = numericValue;
      }

      updatedItem.calories = (updatedItem.baseCalories || 0) * (updatedItem.repsOrDuration || 0);

      return {
        ...prev,
        [itemId]: updatedItem,
      };
    });
  };

  const handleSaveChanges = () => {
    let changesMade = false;
    Object.values(editedItems).forEach(editedItem => {
      const originalItem = allItems.find(item => item.id === editedItem.id);
      if (originalItem && (
          originalItem.baseCalories !== editedItem.baseCalories ||
          originalItem.repsOrDuration !== editedItem.repsOrDuration ||
          originalItem.calories !== editedItem.calories
      )) {
        updateItemData(editedItem);
        changesMade = true;
      }
    });

    if (changesMade) {
      Alert.alert('保存完了', '変更が保存されました。', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('変更なし', '保存する変更がありませんでした。', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    // ★ View の直下に PlaylistProvider を配置します
    <View style={playlistDetailStyles.container}>
      <PlaylistProvider> {/* PlaylistDetailScreen が usePlaylists() を呼び出すので、その内容全体をラップ */}
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
                  <Text style={playlistDetailStyles.totalCaloriesText}>
                    {editedItems[item.id]?.calories || 0}kcal
                  </Text>
                  <AntDesign
                    name={expandedItems[item.id] ? "up" : "down"}
                    size={16}
                    color="#333"
                  />
                </TouchableOpacity>
                {expandedItems[item.id] && (
                  <View style={playlistDetailStyles.accordionContent}>
                    <View style={playlistDetailStyles.inputRow}>
                      <Text style={playlistDetailStyles.inputLabel}>基本カロリー:</Text>
                      <TextInput
                        style={playlistDetailStyles.textInput}
                        keyboardType="numeric"
                        value={String(editedItems[item.id]?.baseCalories || '')}
                        onChangeText={(text) => handleInputChange(item.id, 'baseCalories', text)}
                        placeholder="1回あたりカロリー"
                      />
                    </View>
                    <View style={playlistDetailStyles.inputRow}>
                      <Text style={playlistDetailStyles.inputLabel}>回数/時間:</Text>
                      <TextInput
                        style={playlistDetailStyles.textInput}
                        keyboardType="numeric"
                        value={String(editedItems[item.id]?.repsOrDuration || '')}
                        onChangeText={(text) => handleInputChange(item.id, 'repsOrDuration', text)}
                        placeholder="回数/時間"
                      />
                    </View>
                    {item.showRefreshIcon && <Text style={playlistDetailStyles.accordionText}>更新アイコンあり</Text>}
                  </View>
                )}
              </View>
            ))}
            <TouchableOpacity style={playlistDetailStyles.saveButton} onPress={handleSaveChanges}>
              <Text style={playlistDetailStyles.saveButtonText}>変更を保存</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </PlaylistProvider>
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
  totalCaloriesText: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  } as ViewStyle,
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    width: 90,
  } as TextStyle,
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  } as TextStyle,
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  } as ViewStyle,
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
});

export default PlaylistDetailScreen;