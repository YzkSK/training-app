// convex/playlists.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ログインユーザー用に新しい空のプレイリストを作成
export const createPlaylist = mutation({
    args: { title: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated"); // 認証されていない場合はエラー
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) throw new Error("User not found"); // ユーザーが見つからない場合はエラー

        return await ctx.db.insert("t_playlist", {
        userId: user._id,
        title: args.title,
        items: [], // 最初は空のアイテムリストとして作成
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
        if (!playlist) throw new Error("Playlist not found"); // プレイリストが見つからない場合はエラー

        // **本人確認の追加**: プレイリストの所有者かを確認する
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) throw new Error("User not found");
        if (playlist.userId !== user._id) throw new Error("Unauthorized: You do not own this playlist"); // 所有者でなければ権限エラー

        await ctx.db.patch(args.playlistId, {
        items: [...playlist.items, args.masterMenuItemId], // 既存のアイテムリストに新しいアイテムを追加
        });
    },
    });

    // ログインユーザーの全プレイリストを取得
    export const getMyPlaylists = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return []; // 認証されていない場合は空のリストを返す
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) return []; // ユーザーが見つからない場合は空のリストを返す

        return await ctx.db
        .query("t_playlist")
        .withIndex("by_userId", q => q.eq("userId", user._id)) // ユーザーIDでフィルタリング
        .collect(); // 全てのプレイリストを取得
    },
    });

    // 指定したプレイリストの詳細情報を取得
    export const getPlaylistDetails = query({
    args: { playlistId: v.id("t_playlist") },
    handler: async (ctx, args) => {
        const playlist = await ctx.db.get(args.playlistId);
        if (!playlist) return null; // プレイリストが見つからない場合はnullを返す

        // **本人確認の追加**: このプレイリストがログインユーザーのものであるか確認する
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        if (!user) throw new Error("User not found");
        if (playlist.userId !== user._id) throw new Error("Unauthorized: You do not own this playlist"); // 所有者でなければ権限エラー

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