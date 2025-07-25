import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ModeProvider } from '../contexts/ModeContext';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Failed to get token from SecureStore", err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Failed to save token to SecureStore", err);
      return;
    }
  },
};

function ClerkLoadingScreen() {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={loadingStyles.text}>認証情報を読み込み中...</Text>
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

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <InitialLayout />
    </ClerkProvider>
  );
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <ClerkLoadingScreen />;
  }

  return (
    <ModeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="add-fitness" options={{ presentation: 'modal' }} />
            <Stack.Screen name="add-recipe" options={{ presentation: 'modal' }} />
            <Stack.Screen name="mode-selection" options={{ presentation: 'modal' }} />
          </>
        ) : (
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        )}
      </Stack>
    </ModeProvider>
  );
}