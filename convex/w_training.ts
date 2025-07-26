import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しいトレーニング記録を追加する
export const add = mutation({
    args: {
        date: v.string(),
        exercise: v.string(), // 例: "ベンチプレス", "デッドリフト"
        weight: v.number(), // 使用した重量
        reps: v.number(), // 繰り返し回数
        sets: v.number(), // セット数
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("ユーザーが認証されていません。");
        }

        // Clerk IDを使って、usersテーブルからユーザー情報を検索
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // ユーザーがDBに存在しない場合はエラー
        if (!user) {
            throw new Error("ユーザーがデータベースに見つかりません。");
        }

        await ctx.db.insert("w_training", {
            userId: user._id, // 取得したConvexのユーザーIDを使う
            ...args,
        });
    },
});

// ログインユーザーのトレーニング記録を一覧取得する
export const list = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        // Clerk IDを使って、usersテーブルからユーザー情報を検索
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // ユーザーがDBに存在しない場合は空の配列を返す
        if (!user) {
            return [];
        }

        return await ctx.db
            .query("w_training")
            .withIndex("by_userId", (q) => q.eq("userId", user._id)) // 取得したConvexのユーザーIDで絞り込む
            .order("desc") // 新しい順に並び替え
            .collect();
    },
});