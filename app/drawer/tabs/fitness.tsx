// app/PlaylistList.tsx
import { useNavigation } from '@react-navigation/native'; // useNavigation をインポート
import React from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { usePlaylists } from '../../drawer/contexts/PlaylistContext'; // app から contexts への相対パス

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  PlaylistDetail: { playlistId: string; playlistName: string };
  // 他の画面があればここに追加
};

const PlaylistListScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { playlists } = usePlaylists(); // Contextからプレイリストデータを取得

  const handlePlaylistPress = (playlistId: string, playlistName: string) => {
    // プレイリスト詳細画面へ遷移
    navigation.navigate('PlaylistDetail', { playlistId, playlistName }); // 型エラー回避不要
  };

  return (
    <View style={playlistListStyles.container}>
      <Text style={playlistListStyles.title}>あなたの再生リスト</Text>
      {playlists.length === 0 ? (
        <Text style={playlistListStyles.emptyText}>まだ再生リストがありません。</Text>
      ) : (
        <ScrollView style={playlistListStyles.scrollView}>
          {playlists.map(playlist => (
            <TouchableOpacity
              key={playlist.id}
              style={playlistListStyles.playlistItem}
              onPress={() => handlePlaylistPress(playlist.id, playlist.name)}
            >
              <Text style={playlistListStyles.playlistName}>{playlist.name}</Text>
              <Text style={playlistListStyles.itemCount}>{playlist.items.length} 個のアイテム</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const playlistListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  } as TextStyle,
  scrollView: {
    flex: 1,
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
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  } as TextStyle,
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  } as TextStyle,
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  } as TextStyle,
});

export default PlaylistListScreen;