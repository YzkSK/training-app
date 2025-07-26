import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

//新しいお手本メニューをDBに追加。
export const addMasterItem = internalMutation({
    args: {
        exerciseName: v.string(),
        baseCalories: v.number(),
        unit: v.union(v.literal("reps"), v.literal("time")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("master_training_menu", args);
    },
});

// 全てのお手本メニューの一覧を取得
export const getAll = query({
    handler: async (ctx) => {
        return await ctx.db.query("master_training_menu").collect();
    },
});