// app/drawer/contexts/PlaylistContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

// プレイリストの型定義
interface Playlist {
  id: string;
  name: string;
  items: string[]; // プレイリストに含まれるアイテムのID
}

// Contextの型定義
interface PlaylistContextType {
  playlists: Playlist[];
  addPlaylist: (name: string, itemIds: string[]) => void;
  updatePlaylist: (id: string, itemIds: string[]) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
}

// 初期データ（テスト用）
const initialPlaylists: Playlist[] = [
  { id: 'p1', name: '今日の運動', items: ['item1', 'item3'] },
  { id: 'p2', name: '週ごとの目標', items: ['item2', 'item4'] },
];

// Contextの作成
const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

// Providerコンポーネント
interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);

  const addPlaylist = (name: string, itemIds: string[]) => {
    const newPlaylistId = `p${playlists.length + 1}`;
    const newPlaylist: Playlist = {
      id: newPlaylistId,
      name: name.trim(),
      items: itemIds,
    };
    setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
  };

  const updatePlaylist = (id: string, itemIds: string[]) => {
    setPlaylists(prevPlaylists =>
      prevPlaylists.map(playlist =>
        playlist.id === id
          ? { ...playlist, items: [...new Set([...playlist.items, ...itemIds])] } // 重複を除いて追加
          : playlist
      )
    );
  };

  const getPlaylistById = (id: string) => {
    return playlists.find(playlist => playlist.id === id);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, addPlaylist, updatePlaylist, getPlaylistById }}>
      {children}
    </PlaylistContext.Provider>
  );
};

// Custom Hook
export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};