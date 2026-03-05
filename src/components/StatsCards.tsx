interface Stats {
  totalWorkouts: number;
  totalCalories: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

export function StatsCards({ stats }: { stats: Stats | null }) {
  const cards = [
    {
      label: "Total Workouts",
      value: stats?.totalWorkouts ?? 0,
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "from-[#00ff88] to-[#00cc6a]",
      bgColor: "bg-[#00ff88]/10",
    },
    {
      label: "Calories Burned",
      value: stats?.totalCalories?.toLocaleString() ?? 0,
      icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      color: "from-[#ff3366] to-[#ff6b8a]",
      bgColor: "bg-[#ff3366]/10",
    },
    {
      label: "Total Minutes",
      value: stats?.totalMinutes ?? 0,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-[#8b5cf6] to-[#a78bfa]",
      bgColor: "bg-[#8b5cf6]/10",
    },
    {
      label: "Current Streak",
      value: `${stats?.currentStreak ?? 0} days`,
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "from-[#f59e0b] to-[#fbbf24]",
      bgColor: "bg-[#f59e0b]/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="relative group overflow-hidden"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-white/20 transition-all">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.bgColor} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
              <svg className={`w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r ${card.color} bg-clip-text`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
            <p className="text-white/50 text-xs sm:text-sm mb-1">{card.label}</p>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
