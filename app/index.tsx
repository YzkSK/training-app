import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
    // 1. ログイン中のユーザー「一人」の情報を取得する
    // 変数名を「currentUser」に統一します
    const currentUser = useQuery(api.users.getCurrent);

    // 2. ローディング状態のハンドリング (変更なし)
    if (currentUser === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // 3. データが「null」の場合のハンドリング
    // `getCurrent`はユーザーが見つからない場合、配列ではなく `null` を返します
    if (currentUser === null) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>User not found.</Text>
            </View>
        );
    }

    // 4. データが存在する場合の表示
    // 配列ではないため、`.map` は使わずに直接表示します
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Welcome, {currentUser.username ?? 'No name'}</Text>
        </View>
    );
}