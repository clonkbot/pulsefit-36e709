import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("goals")
      .withIndex("by_user_active", (q) => q.eq("userId", userId).eq("isActive", true))
      .collect();
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    target: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("goals", {
      userId,
      type: args.type,
      target: args.target,
      current: 0,
      startDate: Date.now(),
      isActive: true,
    });
  },
});

export const updateProgress = mutation({
  args: {
    id: v.id("goals"),
    current: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.id);
    if (!goal || goal.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.id, { current: args.current });
  },
});

export const complete = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.id);
    if (!goal || goal.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.id, { isActive: false, endDate: Date.now() });
  },
});
