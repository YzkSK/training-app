// convex/users.ts

import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// ユーザー情報をClerkから取得してConvexのusersテーブルに保存する
export const create = internalMutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        username: v.optional(v.string()),
        mode: v.union(v.literal("trainer"), v.literal("dieter")), // トレーニングモード
    },
    handler: async (ctx, args) => {
        // 既存のユーザーがいないか確認（念のため）
        const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .unique();

        if (existingUser) {
        console.warn("User already exists, skipping creation.");
        return;
        }

        // usersテーブルに新しいドキュメントを挿入
        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            username: args.username ?? "",
        });
        return userId;
    },
});

    /**
     * ログイン中のユーザー情報を取得するクエリ。
     * フロントエンドから呼び出して、ユーザー名などを表示するのに使います。
     */
    export const getCurrent = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
        // ユーザーが認証されていない場合
        return null;
        }

        // ClerkのIDを使って、DBから対応するユーザー情報を探す
        const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();

        return user;
    },
});