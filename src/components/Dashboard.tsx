import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StatsCards } from "./StatsCards";
import { WeeklyChart } from "./WeeklyChart";
import { RecentWorkouts } from "./RecentWorkouts";
import { LogWorkout } from "./LogWorkout";
import { useState } from "react";

export function Dashboard() {
  const stats = useQuery(api.stats.getUserStats);
  const recentWorkouts = useQuery(api.workouts.getRecent, { limit: 5 });
  const weeklyStats = useQuery(api.stats.getWeeklyStats);
  const [showLogModal, setShowLogModal] = useState(false);

  const isLoading = stats === undefined || recentWorkouts === undefined;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Your Dashboard</h2>
          <p className="text-white/50">Track your fitness journey in real-time</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all sm:w-auto w-full"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Log Workout
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-transparent border-t-[#00ff88] rounded-full animate-spin" />
          </div>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts and Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeeklyChart data={weeklyStats ?? []} />
            </div>
            <div className="lg:col-span-1">
              <RecentWorkouts workouts={recentWorkouts ?? []} />
            </div>
          </div>
        </div>
      )}

      {/* Log Workout Modal */}
      {showLogModal && <LogWorkout onClose={() => setShowLogModal(false)} />}
    </div>
  );
}
