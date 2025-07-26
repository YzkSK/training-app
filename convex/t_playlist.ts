import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
    args: {
        title: v.string(), // プレイリスト名
        menu: v.array(v.string()), // トレーニングの名前
        baseCalories: v.array(v.number()), // 基本消費カロリー
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

        await ctx.db.insert("t_playlist", {
            userId: user._id, // 取得したConvexのユーザーIDを使う
            ...args,
        });
    },
});

// ログイン中のユーザーのトレーニングリストを一覧で取得する
export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        // Clerk IDを使って、usersテーブルからConvexのユーザー情報を検索
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            return null; // ユーザーが見つからなければnullを返す
        }

        return await ctx.db
            .query("t_playlist")
            .withIndex("by_userId", (q) => q.eq("userId", user._id)) // 正しいユーザーIDで検索
            .first();
    },
});