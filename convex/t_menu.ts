import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しいトレーニング動画の記録を追加する
export const add = mutation({
    args: {
        date: v.string(), // トレーニング日
        exercise: v.string(), // 例: "ランニング", "サイクリング"
        duration: v.optional(v.number()), // 時間（分単位）
        reps: v.optional(v.number()), // 回数
        caloriesBurned: v.number(), // 消費カロリー
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("ユーザーが認証されていません。");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            throw new Error("ユーザーがデータベースに見つかりません。");
        }

        // データベースに新しいリストを挿入
        await ctx.db.insert("t_menu", {
            userId: user._id, // ログインユーザーのIDを紐付ける
            ...args, // argsをそのまま展開する
        });
    },
});

// ログイン中のユーザーのトレーニング記録を一覧で取得する
export const list = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            return [];
        }

        return await ctx.db
            .query("t_menu")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});