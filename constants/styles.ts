// constants/styles.ts

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 画面全体の基本的なコンテナ
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    // 画面のタイトル用
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    // テキスト入力フォーム用
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    // 区切り線
    separator: {
        height: 1,
        width: '80%',
        backgroundColor: '#ccc',
        marginVertical: 20,
        alignSelf: 'center',
    },
});