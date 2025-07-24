import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Convexクライアントの初期化
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

// Clerkの公開鍵
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
    throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

// Clerkの認証情報を安全に保存するためのトークンキャッシュ
const tokenCache = {
    async getToken(key: string) {
        try {
        return await SecureStore.getItemAsync(key);
        } catch (err) {
        return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
        return await SecureStore.setItemAsync(key, value);
        } catch (err) {
        return;
        }
    },
};

// スプラッシュスクリーンが自動で消えないように設定
SplashScreen.preventAutoHideAsync();

// このコンポーネントがアプリの最上位のレイアウトを定義
function InitialLayout() {
    const { isLoaded, isSignedIn } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Clerkの認証状態の読み込みが終わったら…
        if (isLoaded) {
        const inAuthGroup = segments[0] === '(auth)';

        // 認証済みで、(auth)画面にいる場合は、ホームへリダイレクト
        if (isSignedIn && inAuthGroup) {
            router.replace('/(home)');
        }
        // 未認証で、(auth)画面以外にいる場合は、サインイン画面へリダイレクト
        else if (!isSignedIn && !inAuthGroup) {
            router.replace('/(auth)/signIn');
        }

        // リダイレクト処理が終わったらスプラッシュスクリーンを非表示
        SplashScreen.hideAsync();
        }
    }, [isLoaded, isSignedIn]);

    return <Stack screenOptions={{ headerShown: false }} />;
}

// --- 3. ルートレイアウトの最終定義 ---

export default function RootLayout() {
  // useFontsフックでフォントなどを読み込むことも可能
  // const [fontsLoaded] = useFonts({...});

    return (
        // ClerkProviderでアプリ全体を包み、認証機能を使えるようにする
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        {/* ConvexProviderWithClerkでClerkと連携したバックエンド機能を使えるようにする */}
        <ConvexProviderWithClerk client={convex}>
            {/* InitialLayoutコンポーネントでリダイレクト処理と画面の骨格を定義 */}
            <InitialLayout />
        </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}