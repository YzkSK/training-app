import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しいトレーニング記録を追加する
export const add = mutation({
    args: {
        date: v.number(),
        menu: v.string(),
        time_or_count: v.string(),
        kcal_cons: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("ユーザーが認証されていません。");
        }

        // ▼▼▼▼ ここから追加 ▼▼▼▼
        // Clerk IDを使って、usersテーブルからユーザー情報を検索
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // ユーザーがDBに存在しない場合はエラー
        if (!user) {
            throw new Error("ユーザーがデータベースに見つかりません。");
        }
        // ▲▲▲▲ ここまで追加 ▲▲▲▲

        await ctx.db.insert("t_data", {
            // ▼▼▼▼ ここを修正 ▼▼▼▼
            userId: user._id, // 取得したConvexのユーザーIDを使う
            // ▲▲▲▲ ここを修正 ▲▲▲▲
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

        // ▼▼▼▼ ここから追加 ▼▼▼▼
        // Clerk IDを使って、usersテーブルからユーザー情報を検索
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // ユーザーがDBに存在しない場合は空の配列を返す
        if (!user) {
            return [];
        }
        // ▲▲▲▲ ここまで追加 ▲▲▲▲

        return await ctx.db
            .query("t_data")
            // ▼▼▼▼ ここを修正 ▼▼▼▼
            .withIndex("by_userId", (q) => q.eq("userId", user._id)) // 取得したConvexのユーザーIDで絞り込む
            // ▲▲▲▲ ここを修正 ▲▲▲▲
            .order("desc") // 新しい順に並び替え
            .collect();
    },
});