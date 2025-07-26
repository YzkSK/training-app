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
    p_data: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        gender: v.union(v.literal("男性"), v.literal("女性"), v.literal("その他")),
        age: v.number(),
        height: v.number(),
        weight: v.number(),
        move_level: v.union(v.literal(0), v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    })
    // userIdをユニークにする（1ユーザーにつき1プロフィール）インデックス
    .index("by_userId", ["userId"]),

    // トレーニング記録
    t_data: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        date: v.number(),
        menu: v.string(),
        time_or_count: v.string(),
        kcal_cons: v.number(),
    }).index("by_userId", ["userId"]),

    // 食事記録
    f_data: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        date: v.number(),
        time: v.string(),
        menu: v.string(),
        kcal: v.number(),
    }).index("by_userId", ["userId"]),

    // トレーニング動画の記録
    t_video: defineTable({
        userId: v.id("users"), // ConvexのusersテーブルのIDを紐付ける
        training_name: v.string(),
        video_url: v.string(),
        count: v.number(),
        kcal_cons: v.number(),
    }).index("by_userId", ["userId"]),
});