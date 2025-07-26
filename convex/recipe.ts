import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しい食事記録を追加する
export const add = mutation({
    args: {
        name: v.string(), // レシピ名
        ingredients: v.array(v.string()), // 材料のリスト
        instructions: v.string(), // 調理手順
        memo: v.optional(v.string()), // メモ（オプション）
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

        await ctx.db.insert("recipe", {
            userId: user._id, // 取得したConvexのユーザーIDを使う
            ...args,
        });
    },
});

// ログインユーザーの食事記録を一覧取得する
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
            .query("recipe")
            .withIndex("by_userId", (q) => q.eq("userId", user._id)) // 取得したConvexのユーザーIDで絞り込む
            .order("desc") // 新しい順に並び替え
            .collect();
    },
});