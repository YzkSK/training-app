import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // ユーザー情報 (Clerkと連携)
    users: defineTable({
        username: v.string(),
        email: v.string(),
        clerkId: v.optional(v.string()), // ClerkのユーザーIDを保存
    })
    // clerkIdで検索し、その値が重複しないようにするインデックス
    .index("by_clerk_id", ["clerkId"])
    // emailで検索するためのインデックス
    .index("by_email", ["email"]),

    // ユーザーのプロフィール情報
    personal: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        gender: v.union(v.literal("男性"), v.literal("女性"), v.literal("その他")),
        age: v.number(),
        height: v.number(),
        weight: v.number(),
        move_level: v.union(v.literal(0), v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    })
    // userIdをユニークにする（1ユーザーにつき1プロフィール）インデックス
    .index("by_userId", ["userId"]),

    //自重トレーニングの記録
    bw_training: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        date: v.string(),
        exercise: v.string(), // 例: "プッシュアップ", "スクワット"
        reps: v.number(), // 繰り返し回数
        sets: v.number(), // セット数
    })
    .index("by_userId", ["userId"]),

    //器具トレーニング
    w_training: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        date: v.string(),
        exercise: v.string(), // 例: "ベンチプレス", "デッドリフト"
        weight: v.number(), // 使用した重量
        reps: v.number(), // 繰り返し回数
        sets: v.number(), // セット数
    })
    .index("by_userId", ["userId"]),

    // レシピ情報
    recipe: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        name: v.string(), // レシピ名
        ingredients: v.array(v.string()), // 材料のリスト
        instructions: v.string(), // 調理手順
        memo: v.optional(v.string()), // メモ（オプション）
    })
    .index("by_userId", ["userId"]),

    //ダイエッター向けトレーニング
    t_menu: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        date: v.string(), // トレーニング日
        exercise: v.string(), // 例: "ランニング", "サイクリング"
        duration: v.optional(v.number()), // 時間（分単位）
        reps: v.optional(v.number()), // 回数
        caloriesBurned: v.number(), // 消費カロリー
    })
    .index("by_userId", ["userId"]),

    //トレーニングリスト
    t_playlist: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        title: v.string(), // プレイリスト名
        menu: v.array(v.string()), // トレーニングの名前
        baseCalories: v.array(v.number()), // 基本消費カロリー
    })
    .index("by_userId", ["userId"]),
});