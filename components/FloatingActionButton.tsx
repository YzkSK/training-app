import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

interface FloatingActionButtonProps {
  // 必要に応じてプロパティを追加
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = () => {
  // FABの開閉状態を管理するstate
  const [state, setState] = React.useState({ open: false });
  const router = useRouter(); // useRouterフックを初期化

  // FABの状態が変更されたときのハンドラ
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  // 現在の開閉状態
  const { open } = state;

  return (
    // FAB.Group自体に絶対位置指定を適用し、親のViewがposition: 'relative'を持つことを前提とする
    <FAB.Group
      open={open} // FABの開閉状態
      visible={true} // FABの表示/非表示
      icon={open ? 'minus' : 'plus'} // 開閉時のアイコン
      actions={[
        // 各アクションボタンの定義
        {
          icon: 'run', // フィットネス系のアイコン
          label: '運動項目追加',
          onPress: () => {
            console.log('運動項目追加を押しました');
            router.push('../../diet/add-fitness');
          },
        },
        {
          icon: 'silverware-fork-knife', // レシピ系のアイコンに変更
          label: 'レシピ追加',
          onPress: () => {
            console.log('レシピ追加を押しました');
            router.push('../../diet/add-recipe');

          },
        },
      ]}
      onStateChange={onStateChange} // 状態変更時のハンドラ
      onPress={() => {
        if (open) {
          // FABが開いている場合のメインFAB押下時の処理
          console.log('メインFAB（開いている状態）を押しました');
        } else {
          // FABが閉じている場合のメインFAB押下時の処理
          console.log('メインFAB（閉じている状態）を押しました');
        }
      }}
      // FAB.Group自体に絶対位置指定を適用
      style={styles.fabGroupStyle}
    />
  );
};

const styles = StyleSheet.create({
  fabGroupStyle: {
    position: 'absolute', // このスタイルがFAB.Groupに直接適用される
    bottom: 16, // 下からのマージン
    right: 16, // 右からのマージン
    zIndex: 100, // 他の要素の上に表示されるようにz-indexを設定
  },
});

export default FloatingActionButton;