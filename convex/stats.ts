import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return stats ?? {
      totalWorkouts: 0,
      totalCalories: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
    };
  },
});

export const getWeeklyStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("completedAt"), weekAgo))
      .collect();

    // Group by day
    const dayStats: Record<string, { calories: number; duration: number; count: number }> = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize all days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dayKey = days[date.getDay()];
      dayStats[dayKey] = { calories: 0, duration: 0, count: 0 };
    }

    workouts.forEach((workout) => {
      const date = new Date(workout.completedAt);
      const dayKey = days[date.getDay()];
      if (dayStats[dayKey]) {
        dayStats[dayKey].calories += workout.calories;
        dayStats[dayKey].duration += workout.duration;
        dayStats[dayKey].count += 1;
      }
    });

    return Object.entries(dayStats).map(([day, stats]) => ({
      day,
      ...stats,
    }));
  },
});
