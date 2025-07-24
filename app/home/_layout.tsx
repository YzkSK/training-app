// app/home/_layout.tsx (既存ファイルを更新)
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useMode } from '../contexts/ModeContext'; // パスが変更になりました: ../src/contexts -> ../contexts
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// モード読み込み中の画面
function LoadingScreen() {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={loadingStyles.text}>アプリのモードを読み込み中...</Text>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
});

export default function HomeLayout() {
  const { currentMode, isLoading } = useMode();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentMode) {
    return <Redirect href="/mode-selection" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="drawer" options={{ headerShown: false }} />
    </Stack>
  );
}