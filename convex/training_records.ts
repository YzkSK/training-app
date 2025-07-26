import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 実行したトレーニングを記録し、消費カロリーを計算
export const logWorkout = mutation({
    args: {
        masterMenuItemId: v.id("master_training_menu"),
        performanceValue: v.number(),
    },
    handler: async (ctx, args) => {
        // 1. ユーザー情報とお手本メニュー情報を取得
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) throw new Error("User not found");

        const masterItem = await ctx.db.get(args.masterMenuItemId);
        if (!masterItem) throw new Error("Master menu item not found");

        // 2. 消費カロリーを計算
        let calculatedCalories = 0;
        if (masterItem.unit === "reps") {
            // 回数ベースの計算
            calculatedCalories = masterItem.baseCalories * args.performanceValue;
        } else if (masterItem.unit === "time") {
            // 時間ベースの計算（例: 基準カロリーが10秒あたりの場合）
            calculatedCalories = masterItem.baseCalories * (args.performanceValue / 10);
        }

        // 3. トレーニング実績（t_menu）に記録
        await ctx.db.insert("t_menu", {
            userId: user._id,
            masterMenuItemId: args.masterMenuItemId,
            date: new Date().toISOString(),
            exercise: masterItem.exerciseName,
            performanceValue: args.performanceValue,
            caloriesBurned: Math.round(calculatedCalories), // 四捨五入して整数に
        });

        // 計算結果をフロントエンドに返す
        return { caloriesBurned: Math.round(calculatedCalories) };
    },
});
// ログインユーザーの全トレーニング記録を取得
export const getMyRecords = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) return [];

        return await ctx.db
            .query("t_menu")
            .withIndex("by_userId", q => q.eq("userId", user._id))
            .order("desc") // 新しい順に並べる
            .collect();
    }
});