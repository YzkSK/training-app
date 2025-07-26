import { useMode } from '../contexts/ModeContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

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
            <Text style={styles.title}>どちらのモードで利用しますか？</Text>
            <View style={styles.buttonContainer}>
                <Button title="トレーニーモード" onPress={() => selectMode('trainer')} />
                <Button title="ダイエッターモード" onPress={() => selectMode('dieter')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
});