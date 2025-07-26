import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel"; // ConvexのId型をインポート

// 新しいトレーニング記録を追加する
export const add = mutation({
    args: {
        date: v.string(),
        exercise: v.string(), // 例: "ベンチプレス", "デッドリフト"
        weight: v.number(), // 使用した重量
        reps: v.number(), // 繰り返し回数
        sets: v.number(), // セット数
        notes: v.optional(v.string()), // ★ notesフィールドをオプションとして追加
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

        await ctx.db.insert("w_training", {
            userId: user._id,
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

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            return [];
        }

        return await ctx.db
            .query("w_training")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc") // 新しい順に並び替え
            .collect();
    },
});

// 特定のトレーニング記録を削除する (新しいミューテーション関数)
export const remove = mutation({
    args: {
        id: v.id("w_training"), // 削除する記録のConvex ID
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

        const recordToDelete = await ctx.db.get(args.id);

        // 記録が存在し、かつ現在のユーザーに紐付いていることを確認する
        if (!recordToDelete || recordToDelete.userId !== user._id) {
            throw new Error("削除対象の記録が見つからないか、アクセス権がありません。");
        }

        await ctx.db.delete(args.id); // 記録を削除
    },
});