import { Doc } from "../../convex/_generated/dataModel";

const workoutTypeIcons: Record<string, string> = {
  strength: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
  cardio: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  flexibility: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
  hiit: "M13 10V3L4 14h7v7l9-11h-7z",
};

const workoutTypeColors: Record<string, string> = {
  strength: "text-[#ff3366]",
  cardio: "text-[#00ff88]",
  flexibility: "text-[#8b5cf6]",
  hiit: "text-[#f59e0b]",
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function RecentWorkouts({ workouts }: { workouts: Doc<"workouts">[] }) {
  if (workouts.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Recent Workouts</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-white/50 text-sm">No workouts yet</p>
          <p className="text-white/30 text-xs mt-1">Log your first workout to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">Recent Workouts</h3>
        <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">{workouts.length} total</span>
      </div>

      <div className="space-y-3">
        {workouts.map((workout, i) => (
          <div
            key={workout._id}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl p-3 sm:p-4 transition-all cursor-pointer"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 ${workoutTypeColors[workout.type] || 'text-white/50'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={workoutTypeIcons[workout.type] || workoutTypeIcons.strength} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-white truncate">{workout.name}</h4>
                  <span className="text-xs text-white/40 whitespace-nowrap">{formatTimeAgo(workout.completedAt)}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {workout.duration}min
                  </span>
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    {workout.calories} cal
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
