import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * 実行したトレーニングを記録し、消費カロリーを計算します。
 * @param masterMenuItemId - 実行したお手本メニューのID
 * @param performanceValue - 実行した回数または秒数
 */
export const logWorkout = mutation({
    args: {
    masterMenuItemId: v.id("master_training_menu"),
    performanceValue: v.number(),
    },
    handler: async (ctx, args) => {
        // 1. ユーザー情報と、元となるお手本メニューの情報を取得します
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();
    if (!user) throw new Error("User not found");

    const masterItem = await ctx.db.get(args.masterMenuItemId);
    if (!masterItem) throw new Error("Master menu item not found");

    // 2. 取得した情報をもとに消費カロリーを計算します
    let calculatedCalories = 0;
    if (masterItem.unit === "reps") {
      calculatedCalories = masterItem.baseCalories * args.performanceValue;
    } else if (masterItem.unit === "time") {
      // 例: 基準カロリーが10秒あたりの場合
      calculatedCalories = masterItem.baseCalories * (args.performanceValue / 10);
    }

    // 3. スキーマ定義に合わせて、正しい形のオブジェクトを作成してinsertします
    await ctx.db.insert("t_menu", {
        userId: user._id,
        masterMenuItemId: args.masterMenuItemId,
        date: new Date().toISOString(),
        exercise: masterItem.exerciseName,
        performanceValue: args.performanceValue,
        caloriesBurned: Math.round(calculatedCalories),
    });

    // 計算結果をフロントエンドに返します
    return { caloriesBurned: Math.round(calculatedCalories) };
    },
});

/**
 * ログイン中のユーザーのトレーニング記録を一覧で取得します。
 */
export const getMyRecords = query({
    handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();

    if (!user) return [];

    return await ctx.db
        .query("t_menu")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .order("desc")
        .collect();
    },
});