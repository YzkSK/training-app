import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        user_name: v.string(),
        email: v.string(),
        password: v.string(),
    }).index("by_user_name", ["user_name"]),
})