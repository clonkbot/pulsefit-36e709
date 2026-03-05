interface DayStats {
  day: string;
  calories: number;
  duration: number;
  count: number;
}

export function WeeklyChart({ data }: { data: DayStats[] }) {
  const maxCalories = Math.max(...data.map(d => d.calories), 1);
  const totalWeekCalories = data.reduce((sum, d) => sum + d.calories, 0);
  const totalWorkouts = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Weekly Activity</h3>
          <p className="text-white/50 text-sm">Last 7 days performance</p>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <div className="text-center sm:text-right">
            <p className="text-xs text-white/40 uppercase tracking-wider">Calories</p>
            <p className="text-lg sm:text-xl font-bold text-[#00ff88]">{totalWeekCalories.toLocaleString()}</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs text-white/40 uppercase tracking-wider">Workouts</p>
            <p className="text-lg sm:text-xl font-bold text-[#8b5cf6]">{totalWorkouts}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-40 sm:h-48">
        {data.map((day, i) => {
          const height = maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0;
          const hasWorkout = day.count > 0;

          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full h-32 sm:h-40 flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    hasWorkout
                      ? 'bg-gradient-to-t from-[#00ff88] to-[#00cc6a]'
                      : 'bg-white/10'
                  }`}
                  style={{
                    height: `${Math.max(height, 4)}%`,
                    animationDelay: `${i * 50}ms`
                  }}
                />
              </div>
              <span className={`text-xs font-medium ${hasWorkout ? 'text-[#00ff88]' : 'text-white/40'}`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a]" />
          <span className="text-xs text-white/50">Workout completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <span className="text-xs text-white/50">Rest day</span>
        </div>
      </div>
    </div>
  );
}
