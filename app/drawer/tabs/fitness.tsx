// app/drawer/tabs/fitness.tsx (修正後 - PlaylistProvider をコンポーネント内部でラップ)

import FloatingActionButton from '@/components/Fitnessfab';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

// PlaylistContext.tsx から usePlaylists と Playlist 型をインポート
import { router } from 'expo-router';
import { Playlist, PlaylistProvider, usePlaylists } from '../contexts/PlaylistContext';

// 型定義: ルートパラメータ型
type FitnessStackParamList = {
  PlaylistDetail: { playlistId: string; playlistName: string };
};

const FitnessScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<FitnessStackParamList>>();

  const { playlists } = usePlaylists(); // ここで usePlaylists を呼び出す

  const handlePlaylistPress = (playlistId: string, playlistName: string) => {
    router.push({ pathname: '../../diet/PlaylistDetail', params: { playlistId, playlistName } });
  };


  return (
    // ★ SafeAreaView の直下に PlaylistProvider を配置します
    <SafeAreaView style={fitnessScreenStyles.safeArea}>
      <PlaylistProvider> {/* FitnessScreen が usePlaylists() を呼び出すので、FitnessScreen の内容全体をラップ */}
        <View style={fitnessScreenStyles.container}>

          <ScrollView style={fitnessScreenStyles.scrollViewContent}>

            <View style={fitnessScreenStyles.sectionHeader}>
              <Text style={fitnessScreenStyles.sectionTitle}>あなたの再生リスト</Text>
            </View>

            {playlists.length === 0 ? (
              <Text style={fitnessScreenStyles.emptyPlaylistText}>まだ再生リストがありません。</Text>
            ) : (
              <View style={fitnessScreenStyles.playlistListContainer}>
                {playlists.map((playlist: Playlist) => (
                  <TouchableOpacity
                    key={playlist.id}
                    style={fitnessScreenStyles.playlistItem}
                    onPress={() => handlePlaylistPress(playlist.id, playlist.name)}
                  >
                    <Text style={fitnessScreenStyles.playlistName}>{playlist.name}</Text>
                    <Text style={fitnessScreenStyles.itemCount}>{playlist.items.length} 個のアイテム</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
             <FloatingActionButton />
        </View>
      </PlaylistProvider>
    </SafeAreaView>
  );
};

export default FitnessScreen;

// スタイルシート
const fitnessScreenStyles = StyleSheet.create({
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
  emptyPlaylistText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  } as TextStyle,
});