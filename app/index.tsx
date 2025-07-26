import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from 'expo-router';
import { ActivityIndicator } from "react-native";
import { Button, Text, YStack } from 'tamagui';
import { SignOutButton } from '../components/SignOutButton';

export default function Index() {
    // 1. ログイン中のユーザー「一人」の情報を取得する
    // 変数名を「currentUser」に統一します
    const currentUser = useQuery(api.users.getCurrent);

    // 2. ローディング状態のハンドリング (変更なし)
    if (currentUser === undefined) {
        return (
            <YStack style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </YStack>
        );
    }

    // 3. データが「null」の場合のハンドリング
    // `getCurrent`はユーザーが見つからない場合、配列ではなく `null` を返します
    if (currentUser === null) {
        return (
            <YStack style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>User not found.</Text>
                <Link href="/auth/signUp">
                    <Button>
                        <Text>Sign up</Text>
                    </Button>
                </Link>
                <Link href="/auth/signIn">
                    <Button>
                        <Text>Sign in</Text>
                    </Button>
                </Link>
            </YStack>
        );
    }

    // 4. データが存在する場合の表示
    // 配列ではないため、`.map` は使わずに直接表示します
    return (
        <YStack
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Welcome, {currentUser.username ?? 'No name'}</Text>
            <SignOutButton />
        </YStack>
    );
}