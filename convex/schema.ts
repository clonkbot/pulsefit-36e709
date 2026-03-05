import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  workouts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.string(), // "strength", "cardio", "flexibility", "hiit"
    duration: v.number(), // in minutes
    calories: v.number(),
    exercises: v.array(v.object({
      name: v.string(),
      sets: v.optional(v.number()),
      reps: v.optional(v.number()),
      weight: v.optional(v.number()),
      duration: v.optional(v.number()),
    })),
    completedAt: v.number(),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "completedAt"]),

  goals: defineTable({
    userId: v.id("users"),
    type: v.string(), // "workouts_per_week", "calories_burned", "workout_streak"
    target: v.number(),
    current: v.number(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    isActive: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  userStats: defineTable({
    userId: v.id("users"),
    totalWorkouts: v.number(),
    totalCalories: v.number(),
    totalMinutes: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastWorkoutDate: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});
