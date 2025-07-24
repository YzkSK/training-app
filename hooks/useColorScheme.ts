// hooks/useColorScheme.ts

import { useColorScheme as useNativeColorScheme } from 'react-native';

// このフックは、カラーテーマ（配色）に対して信頼できる値を返すためのものです。
// React Native標準の`useColorScheme`を内部で利用しますが、`null`や
// `undefined`を返すことなく、必ず'light'をデフォルト値として返すようにします。
export function useColorScheme() {
    const colorScheme = useNativeColorScheme();
    return colorScheme ?? 'light';
}