import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ログインユーザー用に新しい空のプレイリストを作成
export const createPlaylist = mutation({
    args: { title: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) throw new Error("User not found");

        return await ctx.db.insert("t_playlist", {
            userId: user._id,
            title: args.title,
            items: [], // 最初は空のアイテムリスト
        });
    },
});

// 既存のプレイリストにお手本メニューを追加
export const addItemToPlaylist = mutation({
    args: {
        playlistId: v.id("t_playlist"),
        masterMenuItemId: v.id("master_training_menu"),
    },
    handler: async (ctx, args) => {
        const playlist = await ctx.db.get(args.playlistId);
        if (!playlist) throw new Error("Playlist not found");
        // TODO: 本人確認（削除しようとしているユーザーがプレイリストの所有者か確認する）

        await ctx.db.patch(args.playlistId, {
            items: [...playlist.items, args.masterMenuItemId],
        });
    },
});

// ログインユーザーの全プレイリストを取得
export const getMyPlaylists = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) return [];

        return await ctx.db
            .query("t_playlist")
            .withIndex("by_userId", q => q.eq("userId", user._id))
            .collect();
    },
});

// 指定したプレイリストの詳細情報を取得
export const getPlaylistDetails = query({
    args: { playlistId: v.id("t_playlist") },
    handler: async (ctx, args) => {
        const playlist = await ctx.db.get(args.playlistId);
        if (!playlist) return null;

        // IDの配列から、Promise.allを使って各メニューの詳細を並行して取得
        const menuItems = await Promise.all(
            playlist.items.map(itemId => ctx.db.get(itemId))
        );

        return {
            ...playlist,
            // null（削除されたメニューなど）を除外して返す
            detailedItems: menuItems.filter(item => item !== null),
        };
    },
});