// components/ThemedText.tsx

import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// ThemedTextが受け取るPropsの型を定義
// Textの標準Propsに、lightColorとdarkColorを追加（今回は使いませんが一般例として）
export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
    };

    export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
    }: ThemedTextProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const color = Colors[colorScheme].text;

    return (
        <Text
        style={[
            { color }, // デフォルトの色をテーマに応じて設定
            type === 'default' ? styles.default : undefined,
            type === 'title' ? styles.title : undefined,
            type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
            type === 'subtitle' ? styles.subtitle : undefined,
            type === 'link' ? styles.link : undefined,
            style, // 個別で指定されたスタイルを上書き適用
        ]}
        {...rest} // その他のPropsをすべてTextコンポーネントに渡す
        />
    );
    }

    const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
    });