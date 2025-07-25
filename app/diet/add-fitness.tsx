// app/diet/add-fitness.tsx (SelectableListScreen が使用されていると思われる場所)
import React from 'react';
import { SelectableListScreen } from '../../components/SelectableListScreen'; // 必要に応じてパスを調整
import { PlaylistProvider } from '../drawer/contexts/PlaylistContext'; // 必要に応じてパスを調整

// このコンポーネントは、Expo Router の設定における画面の一つであると思われます。
// PlaylistProvider で SelectableListScreen をラップする必要があります。
const AddFitnessScreen: React.FC = () => {
  return (
    <PlaylistProvider>
      {/* SelectableListScreen はすでに SafeAreaView を処理しています */}
      <SelectableListScreen />
    </PlaylistProvider>
  );
};

export default AddFitnessScreen;