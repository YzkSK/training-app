import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しいトレーニング記録を追加する
export const add = mutation({
    args: {
        date: v.string(), // 日付
        intakeCalories: v.number(), // 摂取カロリー
        burnedCalories: v.number(), // 消費カロリー
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

        await ctx.db.insert("kcal_record", {
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
            .query("kcal_record")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc") // 新しい順に並び替え
            .collect();
    },
});