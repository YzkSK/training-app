// convex/recipe.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// 新しい食事記録を追加する
export const add = mutation({
    args: {
        name: v.string(), // レシピ名
        ingredients: v.array(v.string()), // 材料のリスト (配列型)
        instructions: v.array(v.string()), // 調理手順 (配列型)
        notes: v.optional(v.string()), // メモ（オプション）
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

        await ctx.db.insert("recipe", {
            userId: user._id,
            ...args,
            instructions: args.instructions.join("\n"),
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

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            return [];
        }

        return await ctx.db
            .query("recipe")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});

// 特定のレシピをIDで取得する
export const get = query({
    args: {
        recipeId: v.id("recipe"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            return null;
        }

        const recipe = await ctx.db.get(args.recipeId);

        if (!recipe || recipe.userId !== user._id) {
            return null;
        }

        return recipe;
    },
});