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
        await ctx.db.insert("t_data", {
        userId: identity.subject,
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
        return await ctx.db
        .query("t_data")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .order("desc") // 新しい順に並び替え
        .collect();
    },
});