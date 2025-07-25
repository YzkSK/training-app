import { useRouter } from 'expo-router'; // useRouterをインポート
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    // PortalとProviderは、FABが他の要素の上に正しく表示されるために必要です。
    // 通常はアプリのルートレベルにProviderを配置しますが、ここではFABの表示範囲に合わせて配置します。
    <View style={styles.container}>
      <FAB.Group
        open={open} // FABの開閉状態
        visible={true} // FABの表示/非表示
        icon={open ? 'minus' : 'plus'} // 開閉時のアイコン
        actions={[
          // 各アクションボタンの定義
          {
            icon: 'run', // フィットネス系のアイコン
            label: 'トレーニング追加',
            labelStyle: { color: 'black' },
            onPress: () => {
              console.log('運動項目追加を押しました');
              router.push('/add-fitness'); // 新しい運動項目追加画面へ遷移
            },
          },
          {
            icon: 'silverware-fork-knife', // レシピ系のアイコンに変更
            label: '栄養素計算、食事提案',
            labelStyle: { color: 'black' }, // ラベルの色を黒に設定
            onPress: () => {
              console.log('栄養素計算、食事提案を押しました');
              router.push('/nutrition-plan'); // 新しい栄養プラン画面へ遷移
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // FABを画面の右下に固定するためのスタイル
    position: 'absolute',
    bottom: 16, // 下からのマージン
    right: 16, // 右からのマージン
    zIndex: 100, // 他の要素の上に表示されるようにz-indexを設定
  },
});

export default FloatingActionButton;
