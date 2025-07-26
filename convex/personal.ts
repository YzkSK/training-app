import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 身体データを登録または更新する
export const addOrUpdate = mutation({
    args: {
        gender: v.union(v.literal("男性"), v.literal("女性"), v.literal("その他")),
        age: v.number(),
        height: v.number(),
        weight: v.number(),
        move_level: v.union(v.literal(0), v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("ユーザーが認証されていません。");
        }

        // ▼▼▼▼ ここから追加 ▼▼▼▼
        // Clerk IDを使って、usersテーブルからConvexのユーザー情報を検索
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            throw new Error("ユーザーがデータベースに見つかりません。");
        }
        // ▲▲▲▲ ここまで追加 ▲▲▲▲

        // 既存の身体データがあるか確認
        const existingPData = await ctx.db
            .query("p_data")
            // ▼▼▼▼ ここを修正 ▼▼▼▼
            .withIndex("by_userId", (q) => q.eq("userId", user._id)) // 正しいユーザーIDで検索
            // ▲▲▲▲ ここを修正 ▲▲▲▲
            .first();

        if (existingPData) {
            // あれば更新
            await ctx.db.patch(existingPData._id, args);
        } else {
            // なければ新規作成
            await ctx.db.insert("p_data", {
                // ▼▼▼▼ ここを修正 ▼▼▼▼
                userId: user._id, // 正しいユーザーIDで作成
                // ▲▲▲▲ ここを修正 ▲▲▲▲
                ...args,
            });
        }
    },
});

// ログインユーザーの身体データを取得する
export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        // ▼▼▼▼ ここから追加 ▼▼▼▼
        // Clerk IDを使って、usersテーブルからConvexのユーザー情報を検索
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            return null; // ユーザーが見つからなければnullを返す
        }
        // ▲▲▲▲ ここまで追加 ▲▲▲▲

        return await ctx.db
            .query("p_data")
            // ▼▼▼▼ ここを修正 ▼▼▼▼
            .withIndex("by_userId", (q) => q.eq("userId", user._id)) // 正しいユーザーIDで検索
            // ▲▲▲▲ ここを修正 ▲▲▲▲
            .first();
    },
});