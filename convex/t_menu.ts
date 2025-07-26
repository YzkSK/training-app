import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しいトレーニング動画の記録を追加する
export const add = mutation({
    args: {
        // ▼▼▼▼ ここを修正 ▼▼▼▼
        training_name: v.string(), // "traning_name" -> "training_name" に修正
        // ▲▲▲▲ ここを修正 ▲▲▲▲
        video_url: v.string(),
        count: v.number(),
        kcal_cons: v.number(),
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

        // ▼▼▼▼ ここを修正 ▼▼▼▼
        // データベースに新しい記録を挿入
        // 構文エラーを修正し、シンプルな形にしました
        await ctx.db.insert("t_video", {
            userId: user._id, // ログインユーザーのIDを紐付ける
            ...args, // argsをそのまま展開する
        });
        // ▲▲▲▲ ここを修正 ▲▲▲▲
    },
}); // ← add ミューテーションはここで正しく閉じる

// ログイン中のユーザーのトレーニング動画記録を一覧で取得する
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
            .query("t_video")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});