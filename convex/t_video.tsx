import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しいトレーニング動画の記録を追加する
export const add = mutation({
    args: {
        traning_name: v.string(),
        video_url: v.string(),
        count: v.number(),
        kcal_cons: v.number(),
    },
    handler: async (ctx, args) => {
        // ログイン中のユーザー情報を取得
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
        throw new Error("ユーザーが認証されていません。");
        }

        // データベースに新しい記録を挿入
        await ctx.db.insert("t_video", {
        userId: identity.subject, // ログインユーザーのIDを紐付ける
        ...args,
        });
    },
    });

    // ログイン中のユーザーのトレーニング動画記録を一覧で取得する
    export const list = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
        // ログインしていなければ空の配列を返す
        return [];
        }
        // ユーザーIDに紐づく記録をインデックスを使って効率的に取得し、新しい順に並べる
        return await ctx.db
        .query("t_video")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .order("desc")
        .collect();
    },
});