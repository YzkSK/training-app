import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

if (!publishableKey) {
    throw new Error('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
}

if (!convex) {
    throw new Error('EXPO_PUBLIC_CONVEX_URL is not set');
}

const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key)
            if (item) {
                console.log(`${key} was used \n`)
            } else {
                console.log('No values stored under key: ' + key)
            }
        } catch (error) {
            console.error('SecureStore get item error: ', error)
            await SecureStore.deleteItemAsync(key)
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value)
        } catch (error) {
            console.error('SecureStore save item error: ', error)
            return
        }
    },
}

export default function RootLayout() {
    const insets = useSafeAreaInsets();

    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ClerkLoaded>
                <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                    <TamaguiProvider config={tamaguiConfig}>
                        <SafeAreaView style={{ flex: 1, paddingTop: insets.top - 60 }} edges={['right', 'left', 'top']}>
                            <Slot />
                        </SafeAreaView>
                    </TamaguiProvider>
                </ConvexProviderWithClerk>
            </ClerkLoaded>
        </ClerkProvider>
    )
}

