// app/drawer/contexts/PlaylistContext.tsx (修正後)
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
  addPlaylist: (name:string, itemIds: string[]) => void;
  updatePlaylist: (id: string, itemIds: string[]) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  updateItemData: (updatedItem: ItemDetailData) => void;
  getItemDataById: (id: string) => ItemDetailData | undefined;
}

// ★ 1. 初期プレイリストを空の配列に変更
// これにより、アプリ起動時はプレイリストが何もなく、ユーザーが能動的に作成する形になります。
const initialPlaylists: Playlist[] = [];

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
    // ★ 2. ID生成方法を改善
    // プレイリストの数に依存しない、より一意性の高いIDを生成します。
    const newPlaylist: Playlist = {
      id: `p_${Date.now()}`, // 現在時刻のタイムスタンプをIDにする
      name: name.trim(),
      items: itemIds,
    };
    setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
  };

  const updatePlaylist = (id: string, newItemIds: string[]) => {
    // ★ 3. プレイリストの更新ロジックを「上書き」に変更
    // 既存のアイテムに追加するのではなく、選択された新しいアイテムリストで完全に置き換えます。
    setPlaylists(prevPlaylists =>
      prevPlaylists.map(playlist =>
        playlist.id === id
          ? { ...playlist, items: newItemIds } // 項目を新しいリストで上書き
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