// app/diet/add-fitness.tsx (修正後 - PlaylistProvider をコンポーネント内部でラップ)

import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput, TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import { ItemDetailData, PlaylistProvider, usePlaylists } from '../drawer/contexts/PlaylistContext';

// ListItemコンポーネントのPropsの型定義
interface ListItemProps {
  id: string;
  title: string;
  calories: number;
  showRefreshIcon?: boolean;
  isSelected: boolean;
  onPress: (id: string) => void;
}

// リストアイテムのコンポーネント
const ListItem: React.FC<ListItemProps> = ({
  id,
  title,
  calories,
  showRefreshIcon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        addFitnessScreenStyles.listItemContainer,
        isSelected && addFitnessScreenStyles.selectedListItemContainer,
      ]}
      onPress={() => onPress(id)}
    >
      <Text style={addFitnessScreenStyles.titleText}>{title}</Text>
      {showRefreshIcon && (
        <View style={addFitnessScreenStyles.refreshIcon}>
          <AntDesign name="reload1" size={24} color="#555" />
        </View>
      )}
      <Text style={addFitnessScreenStyles.calorieText}>{String(calories)}kcal</Text>
    </TouchableOpacity>
  );
};

// リストデータ (PlaylistContext の ItemDetailData 型に合わせる)
const initialListData: ItemDetailData[] = [
  { id: 'item1', title: '足やせ', baseCalories: 5, calories: 100, repsOrDuration: 20, showRefreshIcon: false },
  { id: 'item2', title: '火曜日', baseCalories: 20, calories: 600, repsOrDuration: 30, showRefreshIcon: true },
  { id: 'item3', title: 'ランニング', baseCalories: 7, calories: 420, repsOrDuration: 60, showRefreshIcon: false },
  { id: 'item4', title: 'ヨガ', baseCalories: 3, calories: 135, repsOrDuration: 45, showRefreshIcon: false },
  { id: 'item5', title: '腕立て伏せ', baseCalories: 6, calories: 90, repsOrDuration: 15, showRefreshIcon: false },
  { id: 'item6', title: 'スクワット', baseCalories: 8, calories: 160, repsOrDuration: 20, showRefreshIcon: false },
  { id: 'item7', title: 'ストレッチ', baseCalories: 1, calories: 10, repsOrDuration: 10, showRefreshIcon: false },
];


const AddFitnessScreen: React.FC = () => {
  const navigation = useNavigation();

  const { playlists, addPlaylist, updatePlaylist } = usePlaylists();

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const [selectedPlaylistIdInModal, setSelectedPlaylistIdInModal] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');

  const [currentSelectedPlaylistName, setCurrentSelectedPlaylistName] = useState<string | null>(null);

  const handleItemPress = (id: string) => {
    setSelectedItemIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(itemId => itemId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleSave = () => {
    if (selectedItemIds.length === 0) {
      Alert.alert('選択されていません', '保存するアイテムを選択してください。');
      return;
    }
    setSaveModalVisible(true);
  };

  const handleConfirmSave = () => {
    if (selectedPlaylistIdInModal === null && newPlaylistName.trim() === '') {
      Alert.alert('保存先を選択してください', '既存のプレイリストを選択するか、新しいプレイリスト名を入力してください。');
      return;
    }

    if (newPlaylistName.trim() !== '') {
      addPlaylist(newPlaylistName.trim(), selectedItemIds);
      Alert.alert(
        '保存完了',
        `新しいプレイリスト「${newPlaylistName.trim()}」に${selectedItemIds.length}個のアイテムを保存しました。`
      );
    } else if (selectedPlaylistIdInModal !== null) {
      updatePlaylist(selectedPlaylistIdInModal, selectedItemIds);
      const savedPlaylistName = playlists.find(p => p.id === selectedPlaylistIdInModal)?.name || '不明なプレイリスト';
      Alert.alert(
        '保存完了',
        `「${savedPlaylistName}」に${selectedItemIds.length}個のアイテムを保存しました。`
      );
    }

    setSaveModalVisible(false);
    setNewPlaylistName('');
    setSelectedPlaylistIdInModal(null);
    setSelectedItemIds([]);
    setCurrentSelectedPlaylistName(null);

    // ★ ここで親画面に戻る
    navigation.goBack(); // add-fitness.tsx の画面自体を閉じる
  };

  const handleClearSelectedPlaylist = () => {
    setCurrentSelectedPlaylistName(null);
    Alert.alert('選択解除', 'プレイリストの選択が解除されました。');
  };


  return (
    // ★ SafeAreaView の直下に PlaylistProvider を配置します
    <SafeAreaView style={addFitnessScreenStyles.safeArea}>
      <PlaylistProvider> {/* AddFitnessScreen が usePlaylists() を呼び出すので、その内容全体をラップ */}
        <View style={addFitnessScreenStyles.container}>

          <ScrollView style={addFitnessScreenStyles.scrollViewContent}>
            <View style={addFitnessScreenStyles.sectionHeader}>
              <Text style={addFitnessScreenStyles.sectionTitle}>フィットネス項目</Text>
            </View>
            {initialListData.map(item => (
              <ListItem
                key={item.id}
                id={item.id}
                title={item.title}
                calories={item.calories}
                showRefreshIcon={item.showRefreshIcon}
                isSelected={selectedItemIds.includes(item.id)}
                onPress={handleItemPress}
              />
            ))}

            {currentSelectedPlaylistName && (
              <View style={addFitnessScreenStyles.currentPlaylistContainer}>
                <Text style={addFitnessScreenStyles.currentPlaylistText}>
                  選択中のプレイリスト: {currentSelectedPlaylistName}
                </Text>
                <TouchableOpacity onPress={handleClearSelectedPlaylist} style={addFitnessScreenStyles.clearPlaylistButton}>
                  <AntDesign name="closecircle" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={addFitnessScreenStyles.saveButton} onPress={handleSave}>
              <Text style={addFitnessScreenStyles.saveButtonText}>選択したものを保存</Text>
            </TouchableOpacity>

          </ScrollView>


          <Modal
            animationType="slide"
            transparent={true}
            visible={saveModalVisible}
            onRequestClose={() => {
              setSaveModalVisible(!saveModalVisible);
            }}
          >
            <View style={addFitnessScreenStyles.centeredView}>
              <View style={addFitnessScreenStyles.modalView}>
                <Text style={addFitnessScreenStyles.modalTitle}>保存先を選択</Text>

                <ScrollView style={addFitnessScreenStyles.playlistScroll}>
                  {playlists.map(playlist => (
                    <TouchableOpacity
                      key={playlist.id}
                      style={[
                        addFitnessScreenStyles.playlistItem,
                        selectedPlaylistIdInModal === playlist.id && addFitnessScreenStyles.selectedPlaylistItem,
                      ]}
                      onPress={() => {
                        setSelectedPlaylistIdInModal(playlist.id);
                        setNewPlaylistName('');
                      }}
                    >
                      <Text style={addFitnessScreenStyles.playlistItemText}>{playlist.name} ({playlist.items.length})</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={addFitnessScreenStyles.orText}>または</Text>

                <TextInput
                  style={addFitnessScreenStyles.newPlaylistInput}
                  placeholder="新しいプレイリスト名を入力"
                  value={newPlaylistName}
                  onChangeText={text => {
                    setNewPlaylistName(text);
                    setSelectedPlaylistIdInModal(null);
                  }}
                />

                <View style={addFitnessScreenStyles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[addFitnessScreenStyles.modalButton, addFitnessScreenStyles.buttonClose]}
                    onPress={() => setSaveModalVisible(!saveModalVisible)}
                  >
                    <Text style={addFitnessScreenStyles.textStyle}>キャンセル</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[addFitnessScreenStyles.modalButton, addFitnessScreenStyles.buttonSave]}
                    onPress={handleConfirmSave}
                  >
                    <Text style={addFitnessScreenStyles.textStyle}>保存</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </PlaylistProvider>
    </SafeAreaView>
  );
};

export default AddFitnessScreen;

const addFitnessScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight ?? 0) + 20) : 20,
    paddingBottom: 20,
  } as ViewStyle,

  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  } as ViewStyle,
  selectedListItemContainer: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  } as ViewStyle,
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  } as TextStyle,
  calorieText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  } as TextStyle,
  refreshIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  } as ViewStyle,
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 0,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  } as ViewStyle,
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,

  currentPlaylistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  } as ViewStyle,
  currentPlaylistText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 10,
  } as TextStyle,
  clearPlaylistButton: {
    padding: 5,
  } as ViewStyle,

  sectionHeader: {
    marginTop: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  } as TextStyle,
  playlistListContainer: {
  } as ViewStyle,
  playlistItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  selectedPlaylistItem: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  } as ViewStyle,
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  } as TextStyle,
  playlistItemText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  } as TextStyle,
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  } as TextStyle,
  emptyPlaylistText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  } as TextStyle,

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as ViewStyle,
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    maxHeight: '70%',
  } as ViewStyle,
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  } as TextStyle,
  playlistScroll: {
    maxHeight: 150,
    width: '100%',
    marginBottom: 15,
  } as ViewStyle,
  orText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#666',
  } as TextStyle,
  newPlaylistInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  } as TextStyle,
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  } as ViewStyle,
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  } as ViewStyle,
  buttonClose: {
    backgroundColor: '#DDDDDD',
  } as ViewStyle,
  buttonSave: {
    backgroundColor: '#2196F3',
  } as ViewStyle,
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
});