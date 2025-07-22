import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        user_name: v.string(),
        email: v.string(),
        password: v.string(),
    }).index("by_user_name", ["user_name"]),

    p_data: defineTable({
        userId: v.id("users"),
        gender: v.union(
            v.literal("男性"),
            v.literal("女性"),
            v.literal("その他")
        ),
        age: v.number(),
        height: v.number(),
        weight: v.number(),
        move_level: v.union(
            v.literal(0),
            v.literal(1),
            v.literal(2),
            v.literal(3),
            v.literal(4),
            v.literal(5)
        ),
    }).index("by_userId", ["userId"]).unique(),

    t_data: defineTable({
        userId: v.id("users"),
        date: v.number(),
        menu: v.string(),
        time_or_count: v.string(),
        kcal_cons: v.number(),
    }).index("by_userId", ["userId"]),

    f_data: defineTable({
        userId: v.id("users"),
        date: v.number(),
        time: v.string(),
        menu: v.string(),
        kcal: v.number(),
    }).index("by_userId", ["userId"]),
});