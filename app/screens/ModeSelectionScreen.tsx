// app/screens/ModeSelectionScreen.tsx
import { Ionicons } from '@expo/vector-icons'; // ★ここを追加・修正
import { useRouter } from 'expo-router'; // ★ここを追加・修正
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // ★ここを追加・修正
import { useMode } from '../drawer/contexts/ModeContext'; // ★ここを追加・修正 (パスは app/screens から app/contexts への相対パス)

export default function ModeSelectionScreen() {
    const { setAndStoreMode } = useMode();
    const router = useRouter();

    const selectMode = async (mode: 'trainer' | 'dieter') => {
        await setAndStoreMode(mode);
        Alert.alert("モード選択", `${mode === 'trainer' ? 'トレーニー' : 'ダイエッター'}モードが選択されました！`);
        router.replace('/home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>あなたのフィットネス目標は？</Text>
            <Text style={styles.subtitle}>最も近いモードを選んでください。</Text>

            <View style={styles.modeOptions}>
                {/* トレーニーモードのカード */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => selectMode('trainer')}
                >
                    <Ionicons name="barbell-outline" size={80} color="#007AFF" />
                    <Text style={styles.optionTitle}>トレーニーモード</Text>
                </TouchableOpacity>

                {/* ダイエッターモードのカード */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => selectMode('dieter')}
                >
                    <Ionicons name="leaf-outline" size={80} color="#4CD964" />
                    <Text style={styles.optionTitle}>ダイエッターモード</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F4F4F6',
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    modeOptions: {
        width: '100%',
        alignItems: 'center',
    },
    option: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 40,
        paddingHorizontal: 30,
        marginBottom: 20,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
    },
});