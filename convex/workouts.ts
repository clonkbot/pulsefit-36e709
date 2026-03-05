import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const limit = args.limit ?? 7;
    return await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    duration: v.number(),
    calories: v.number(),
    exercises: v.array(v.object({
      name: v.string(),
      sets: v.optional(v.number()),
      reps: v.optional(v.number()),
      weight: v.optional(v.number()),
      duration: v.optional(v.number()),
    })),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const workoutId = await ctx.db.insert("workouts", {
      userId,
      name: args.name,
      type: args.type,
      duration: args.duration,
      calories: args.calories,
      exercises: args.exercises,
      completedAt: Date.now(),
      notes: args.notes,
    });

    // Update user stats
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    if (existingStats) {
      const lastWorkout = existingStats.lastWorkoutDate;
      let newStreak = existingStats.currentStreak;

      if (lastWorkout) {
        const lastDate = new Date(lastWorkout);
        lastDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((todayTimestamp - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          newStreak += 1;
        } else if (daysDiff > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      await ctx.db.patch(existingStats._id, {
        totalWorkouts: existingStats.totalWorkouts + 1,
        totalCalories: existingStats.totalCalories + args.calories,
        totalMinutes: existingStats.totalMinutes + args.duration,
        currentStreak: newStreak,
        longestStreak: Math.max(existingStats.longestStreak, newStreak),
        lastWorkoutDate: Date.now(),
      });
    } else {
      await ctx.db.insert("userStats", {
        userId,
        totalWorkouts: 1,
        totalCalories: args.calories,
        totalMinutes: args.duration,
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: Date.now(),
      });
    }

    return workoutId;
  },
});

export const remove = mutation({
  args: { id: v.id("workouts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const workout = await ctx.db.get(args.id);
    if (!workout || workout.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});
