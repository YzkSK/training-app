import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Clerkのトークンを安全に保存するための設定
const tokenCache = {
    async getToken(key: string) {
        try {
        return SecureStore.getItemAsync(key);
        } catch (err) {
        return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
        return SecureStore.setItemAsync(key, value);
        } catch (err) {
        return;
        }
    },
    };

    // Convexクライアントのインスタンスを作成
    // .envファイルにCONVEX_URLを設定してください
    const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

    // ClerkのPublishable Key
    // .envファイルにCLERK_PUBLISHABLE_KEYを設定してください
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

    // 認証状態に基づいて画面遷移を管理するコンポーネント
    const InitialLayout = () => {
    const { isLoaded, isSignedIn } = useUser();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Clerkの認証情報が読み込まれるまで何もしない
        if (!isLoaded) {
        return;
        }

        const inAuthGroup = segments[0] === 'auth';

        // サインイン済みで、認証画面にいる場合、ホーム画面にリダイレクト
        if (isSignedIn && inAuthGroup) {
        router.replace('/(drawer)');
        } 
        // サインインしておらず、認証画面以外にいる場合、サインイン画面にリダイレクト
        else if (!isSignedIn && !inAuthGroup) {
        router.replace('/auth/signIn');
        }
    }, [isLoaded, isSignedIn]);

    // Clerkが読み込み中の場合はローディングインジケーターを表示
    if (!isLoaded) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        );
    }

    return (
        <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
    );
    };


    export default function RootLayout() {
    return (
        // ClerkProviderでアプリ全体を囲み、認証機能を提供
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        {/* ConvexProviderWithClerkでさらに囲み、データベース機能を提供 */}
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <InitialLayout />
        </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}