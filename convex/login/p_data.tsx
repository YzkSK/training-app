import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 身体データを登録または更新する
export const addOrUpdate = mutation({
    args: {
        gender: v.union(v.literal("男性"), v.literal("女性"), v.literal("その他")),
        age: v.number(),
        height: v.number(),
        weight: v.number(),
        move_level: v.union(v.literal(0),v.literal(1),v.literal(2),v.literal(3),v.literal(4),v.literal(5)),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
        throw new Error("ユーザーが認証されていません。");
        }

        // 既存の身体データがあるか確認
        const existingPData = await ctx.db
        .query("p_data")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .first();

        if (existingPData) {
        // あれば更新
        await ctx.db.patch(existingPData._id, args);
        } else {
        // なければ新規作成
        await ctx.db.insert("p_data", {
            userId: identity.subject,
            ...args,
        });
        }
    },
    });

    // ログインユーザーの身体データを取得する
    export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
        return null;
        }
        return await ctx.db
        .query("p_data")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .first();
    },
});