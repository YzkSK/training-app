// components/Button.tsx

import { Text, Pressable, StyleSheet, type PressableProps } from 'react-native';
import React from 'react';

// ボタンコンポーネントが受け取るpropsの型を定義
interface ButtonProps extends PressableProps {
    children: React.ReactNode;
    }

    export default function Button({ children, ...props }: ButtonProps) {
    return (
        <Pressable {...props} style={styles.button}>
        {/* ボタンのテキストは子要素として受け取る */}
        <Text style={styles.buttonText}>{children}</Text>
        </Pressable>
    );
    }

    // ボタンのスタイルを定義
    const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007AFF', // ボタンの背景色（iOSの標準的な青）
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white', // テキストの色
        fontSize: 16,
        fontWeight: 'bold',
    },
});