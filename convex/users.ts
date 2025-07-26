// convex/users.ts

import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// ユーザー情報をClerkから取得してConvexのusersテーブルに保存する
export const store = internalMutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        username: v.string(),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            // 更新時もスキーマに合わせて修正
            await ctx.db.patch(existingUser._id, {
                email: args.email,
                username: args.username,
            });
            return;
        }

        // 新規作成時もスキーマに合わせて修正
        await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            username: args.username, // 'name' -> 'username'
        });
    },
});

// getCurrentクエリは変更なしでOKです
export const getCurrent = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        return user;
    },
});