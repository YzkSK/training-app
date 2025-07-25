// convex/users.ts

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 新しいユーザーを追加するmutation
export const add = mutation({
    args: {
        user_name: v.string(),
        email: v.string(),
        password: v.string(),
    },
    // 👇 ctxとargsから型定義を削除
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
        user_name: args.user_name,
        email: args.email,
        password: args.password, // 本来はハッシュ化されたパスワードを保存
        });
    },
    });

    // ユーザーの一覧を取得するquery
    export const list = query({
    // 👇 ctxから型定義を削除し、返り値の型定義も削除
    handler: async (ctx) => {
        // 最新のユーザーから順に取得
        return await ctx.db.query("users").order("desc").collect();
    },
});