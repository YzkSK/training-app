// app/drawer/contexts/PlaylistContext.tsx (変更なし)
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface ItemDetailData {
  id: string;
  title: string;
  baseCalories: number;
  calories: number;
  repsOrDuration?: number;
  showRefreshIcon?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  items: string[];
}

interface PlaylistContextType {
  playlists: Playlist[];
  allItems: ItemDetailData[];
  addPlaylist: (name: string, itemIds: string[]) => void;
  updatePlaylist: (id: string, itemIds: string[]) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  updateItemData: (updatedItem: ItemDetailData) => void;
  getItemDataById: (id: string) => ItemDetailData | undefined;
}

const initialPlaylists: Playlist[] = [
  { id: 'p1', name: '今日の運動', items: ['item1', 'item3'] },
  { id: 'p2', name: '週ごとの目標', items: ['item2', 'item4'] },
];

const initialAllItems: ItemDetailData[] = [
  { id: 'item1', title: '足やせ', baseCalories: 5, calories: 5 * 20, repsOrDuration: 20, showRefreshIcon: false },
  { id: 'item2', title: '火曜日', baseCalories: 20, calories: 20 * 30, repsOrDuration: 30, showRefreshIcon: false },
  { id: 'item3', title: 'ランニング', baseCalories: 7, calories: 7 * 60, repsOrDuration: 60, showRefreshIcon: false },
  { id: 'item4', title: 'ヨガ', baseCalories: 3, calories: 3 * 45, repsOrDuration: 45, showRefreshIcon: false },
  { id: 'item5', title: '腕立て伏せ', baseCalories: 6, calories: 6 * 15, repsOrDuration: 15, showRefreshIcon: false },
  { id: 'item6', title: 'スクワット', baseCalories: 8, calories: 8 * 20, repsOrDuration: 20, showRefreshIcon: false },
  { id: 'item7', title: 'ストレッチ', baseCalories: 1, calories: 1 * 10, repsOrDuration: 10, showRefreshIcon: false },
];

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [allItems, setAllItems] = useState<ItemDetailData[]>(initialAllItems);

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
          ? { ...playlist, items: [...new Set([...playlist.items, ...itemIds])] }
          : playlist
      )
    );
  };

  const getPlaylistById = (id: string) => {
    return playlists.find(playlist => playlist.id === id);
  };

  const updateItemData = (updatedItem: ItemDetailData) => {
    setAllItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const getItemDataById = (id: string) => {
    return allItems.find(item => item.id === id);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, allItems, addPlaylist, updatePlaylist, getPlaylistById, updateItemData, getItemDataById }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};