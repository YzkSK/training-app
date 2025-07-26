import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { usePlaylists } from '../app/drawer/contexts/PlaylistContext'; // Contextをインポート

// ListItemコンポーネントのPropsの型定義（変更なし）
interface ListItemProps {
  id: string;
  title: string;
  calories: string;
  showRefreshIcon?: boolean;
  isSelected: boolean;
  onPress: (id: string) => void;
}

// リストアイテムのコンポーネント（変更なし）
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
        styles.listItemContainer,
        isSelected && styles.selectedListItemContainer,
      ]}
      onPress={() => onPress(id)}
    >
      <Text style={styles.titleText}>{title}</Text>
      {showRefreshIcon && (
        <View style={styles.refreshIcon}>
        </View>
      )}
      <Text style={styles.calorieText}>{calories}</Text>
    </TouchableOpacity>
  );
};

// リストデータ（変更なし）
interface ItemData {
  id: string;
  title: string;
  calories: string;
  showRefreshIcon?: boolean;
}

const initialListData: ItemData[] = [
  { id: 'item1', title: '足やせ', calories: '150kcal', showRefreshIcon: false },
  { id: 'item2', title: '火曜日', calories: '150kcal', showRefreshIcon: true },
  { id: 'item3', title: 'ランニング', calories: '400kcal', showRefreshIcon: false },
  { id: 'item4', title: 'ヨガ', calories: '100kcal', showRefreshIcon: false },
  { id: 'item5', title: '腕立て伏せ', calories: '80kcal', showRefreshIcon: false },
  { id: 'item6', title: 'スクワット', calories: '120kcal', showRefreshIcon: false },
  { id: 'item7', title: 'ストレッチ', calories: '50kcal', showRefreshIcon: false },
];


// 選択可能なリスト全体を表示するメインコンポーネント
export const SelectableListScreen: React.FC = () => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false); // 保存用モーダルの表示状態
  // const [playlistSelectModalVisible, setPlaylistSelectModalVisible] = useState(false); // ★ 削除: プレイリスト選択用モーダルの表示状態

  const { playlists, addPlaylist, updatePlaylist } = usePlaylists(); // Contextから関数とデータを取得
  const [selectedPlaylistIdInModal, setSelectedPlaylistIdInModal] = useState<string | null>(null); // モーダルで選択中のプレイリストID
  const [newPlaylistName, setNewPlaylistName] = useState<string>(''); // 新規プレイリスト名

  const [currentSelectedPlaylistName, setCurrentSelectedPlaylistName] = useState<string | null>(null); // 現在画面に表示中の選択済みプレイリスト名


  const handleItemPress = (id: string) => {
    setSelectedItemIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(itemId => itemId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  // 「選択したものを保存」ボタンが押された時のハンドラ
  const handleSave = () => {
    if (selectedItemIds.length === 0) {
      Alert.alert('選択されていません', '保存するアイテムを選択してください。');
      return;
    }
    setSaveModalVisible(true); // 保存先選択モーダルを表示
  };

  // モーダル内の「保存」ボタンが押された時のハンドラ
  const handleConfirmSave = () => {
    if (selectedPlaylistIdInModal === null && newPlaylistName.trim() === '') {
      Alert.alert('保存先を選択してください', '既存のプレイリストを選択するか、新しいプレイリスト名を入力してください。');
      return;
    }

    if (newPlaylistName.trim() !== '') {
      // 新しいプレイリストを作成する場合、ContextのaddPlaylistを使用
      addPlaylist(newPlaylistName.trim(), selectedItemIds);
      Alert.alert(
        '保存完了',
        `新しいプレイリスト「${newPlaylistName.trim()}」に${selectedItemIds.length}個のアイテムを保存しました。`
      );
    } else if (selectedPlaylistIdInModal !== null) {
      // 既存のプレイリストに保存する場合、ContextのupdatePlaylistを使用
      updatePlaylist(selectedPlaylistIdInModal, selectedItemIds);
      const savedPlaylistName = playlists.find(p => p.id === selectedPlaylistIdInModal)?.name || '不明なプレイリスト';
      Alert.alert(
        '保存完了',
        `「${savedPlaylistName}」に${selectedItemIds.length}個のアイテムを保存しました。`
      );
    }

    setSaveModalVisible(false); // 保存モーダルを閉じる
    setNewPlaylistName('');
    setSelectedPlaylistIdInModal(null);
    setSelectedItemIds([]); // 保存後、選択状態を解除
    setCurrentSelectedPlaylistName(null); // 保存後、表示中のプレイリスト選択もクリア
  };

  // ★ 削除: 「再生リストを選択」ボタンが押された時のハンドラ
  // const handleOpenPlaylistSelect = () => {
  //   setPlaylistSelectModalVisible(true); // プレイリスト選択モーダルを表示
  // };

  // ★ 削除: プレイリスト選択モーダル内でプレイリストが選択された時のハンドラ
  // const handlePlaylistSelectedFromModal = (playlistId: string, playlistName: string) => {
  //   setCurrentSelectedPlaylistName(playlistName); // 画面に表示するプレイリスト名を更新
  //   setPlaylistSelectModalVisible(false); // モーダルを閉じる
  // };

  // 選択中のプレイリスト表示をクリアするハンドラ（これは残します）
  const handleClearSelectedPlaylist = () => {
    setCurrentSelectedPlaylistName(null); // 表示中のプレイリスト名をクリア
    Alert.alert('選択解除', 'プレイリストの選択が解除されました。');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
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
        </ScrollView>

        {/* 現在選択中のプレイリスト名を表示し、クリアボタンを追加（これは残します） */}
        {currentSelectedPlaylistName && (
          <View style={styles.currentPlaylistContainer}>
            <Text style={styles.currentPlaylistText}>
              選択中のプレイリスト: {currentSelectedPlaylistName}
            </Text>
            <TouchableOpacity onPress={handleClearSelectedPlaylist} style={styles.clearPlaylistButton}>
            </TouchableOpacity>
          </View>
        )}

        {/* ★ 削除: 再生リストを選択ボタン */}
        {/*
        <TouchableOpacity
          style={styles.selectPlaylistButton}
          onPress={handleOpenPlaylistSelect}
        >
          <Text style={styles.selectPlaylistButtonText}>再生リストを選択</Text>
        </TouchableOpacity>
        */}

        {/* 選択したものを保存ボタン（これは残します） */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>選択したものを保存</Text>
        </TouchableOpacity>


        {/* 保存先選択モーダル（既存プレイリストへの保存または新規作成） - これは残します */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={saveModalVisible}
          onRequestClose={() => {
            setSaveModalVisible(!saveModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>保存先を選択</Text>

              {/* 既存のプレイリストリスト */}
              <ScrollView style={styles.playlistScroll}>
                {playlists.map(playlist => (
                  <TouchableOpacity
                    key={playlist.id}
                    style={[
                      styles.playlistItem,
                      selectedPlaylistIdInModal === playlist.id && styles.selectedPlaylistItem,
                    ]}
                    onPress={() => {
                      setSelectedPlaylistIdInModal(playlist.id);
                      setNewPlaylistName('');
                    }}
                  >
                    <Text style={styles.playlistItemText}>{playlist.name} ({playlist.items.length})</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.orText}>または</Text>

              {/* 新しいプレイリスト作成 */}
              <TextInput
                style={styles.newPlaylistInput}
                placeholder="新しいプレイリスト名を入力"
                value={newPlaylistName}
                onChangeText={text => {
                  setNewPlaylistName(text);
                  setSelectedPlaylistIdInModal(null);
                }}
              />

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.buttonClose]}
                  onPress={() => setSaveModalVisible(!saveModalVisible)}
                >
                  <Text style={styles.textStyle}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.buttonSave]}
                  onPress={handleConfirmSave}
                >
                  <Text style={styles.textStyle}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ★ 削除: プレイリスト選択モーダル（プルダウンとして機能） */}
        {/*
        <Modal
          animationType="slide"
          transparent={true}
          visible={playlistSelectModalVisible}
          onRequestClose={() => {
            setPlaylistSelectModalVisible(!playlistSelectModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>プレイリストを選択</Text>

              <ScrollView style={styles.playlistScroll}>
                {playlists.map(playlist => (
                  <TouchableOpacity
                    key={playlist.id}
                    style={styles.playlistItem}
                    onPress={() => handlePlaylistSelectedFromModal(playlist.id, playlist.name)}
                  >
                    <Text style={styles.playlistItemText}>{playlist.name} ({playlist.items.length})</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setPlaylistSelectModalVisible(!playlistSelectModalVisible)}
              >
                <Text style={styles.textStyle}>閉じる</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        */}

      </View>
    </SafeAreaView>
  );
};

// スタイルシート（変更なし）
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  } as ViewStyle,
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginHorizontal: 20,
    marginTop: 10,
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

  // --- 再生リストを選択ボタンのスタイル（これは使用されなくなるため、削除しても良いですが、今回は残しています） ---
  selectPlaylistButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  } as ViewStyle,
  selectPlaylistButtonText: {
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
    marginHorizontal: 20,
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


  // --- モーダル関連のスタイル ---
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
  playlistItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  } as ViewStyle,
  selectedPlaylistItem: {
    backgroundColor: '#e6f2ff',
    borderColor: '#007AFF',
  } as ViewStyle,
  playlistItemText: {
    fontSize: 16,
  } as TextStyle,
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