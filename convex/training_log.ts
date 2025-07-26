// convex/fitness_logs.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel"; // Id型をインポート

// 新しいウエイトトレーニング記録を追加する
export const addWeightTraining = mutation({
    args: {
        date: v.string(),
        exercise: v.string(), // 例: "ベンチプレス", "デッドリフト"
        weight: v.number(), // 使用した重量
        reps: v.number(), // 繰り返し回数
        sets: v.number(), // セット数
        notes: v.optional(v.string()), // メモ (オプション)
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

        await ctx.db.insert("w_training", { // w_training テーブルに挿入
            userId: user._id,
            ...args,
        });
    },
});

// 新しい自重トレーニング記録を追加する
export const addBodyweightTraining = mutation({
    args: {
        date: v.string(),
        exercise: v.string(), // 例: "プッシュアップ", "スクワット"
        reps: v.number(), // 繰り返し回数
        sets: v.number(), // セット数
        notes: v.optional(v.string()), // メモ (オプション)
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

        await ctx.db.insert("bw_training", { // bw_training テーブルに挿入
            userId: user._id,
            ...args,
        });
    },
});

// ログインユーザーのすべてのウエイトトレーニング記録を一覧取得する
export const listWeightTrainings = query({
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
            .order("desc")
            .collect();
    },
});

// ログインユーザーのすべての自重トレーニング記録を一覧取得する
export const listBodyweightTrainings = query({
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
            .query("bw_training")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});

// 特定のウエイトトレーニング記録を削除する
export const removeWeightTraining = mutation({
    args: {
        id: v.id("w_training"),
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
        if (!recordToDelete || recordToDelete.userId !== user._id) {
            throw new Error("削除対象の記録が見つからないか、アクセス権がありません。");
        }
        await ctx.db.delete(args.id);
    },
});

// 特定の自重トレーニング記録を削除する
export const removeBodyweightTraining = mutation({
    args: {
        id: v.id("bw_training"),
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
        if (!recordToDelete || recordToDelete.userId !== user._id) {
            throw new Error("削除対象の記録が見つからないか、アクセス権がありません。");
        }
        await ctx.db.delete(args.id);
    },
});