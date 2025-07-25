// components/ThemedView.tsx

import { View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// ThemedViewが受け取るPropsの型を定義
export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    };

    export function ThemedView({ style, lightColor, darkColor, ...rest }: ThemedViewProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const backgroundColor = Colors[colorScheme].background;

    return (
        <View
        style={[
            { backgroundColor }, // デフォルトの背景色をテーマに応じて設定
            style, // 個別で指定されたスタイルを上書き適用
        ]}
        {...rest} // その他のPropsをすべてViewコンポーネントに渡す
        />
    );
}