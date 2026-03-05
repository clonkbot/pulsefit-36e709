import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Could not sign in as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Hero section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs text-[#00ff88] tracking-wider uppercase">Real-time Sync</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            <span className="block text-white">Unlock Your</span>
            <span className="block bg-gradient-to-r from-[#00ff88] via-[#00cc6a] to-[#00ff88] bg-clip-text text-transparent">
              Full Potential
            </span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-sm mx-auto">
            Track workouts, crush goals, and watch your progress in real-time.
          </p>
        </div>

        {/* Auth card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/20 to-[#ff3366]/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
              <button
                onClick={() => setFlow("signIn")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  flow === "signIn"
                    ? "bg-[#00ff88] text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setFlow("signUp")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  flow === "signUp"
                    ? "bg-[#00ff88] text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="p-3 bg-[#ff3366]/10 border border-[#ff3366]/20 rounded-lg">
                  <p className="text-sm text-[#ff3366]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  flow === "signIn" ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-transparent text-white/40">or</span>
              </div>
            </div>

            <button
              onClick={handleAnonymous}
              disabled={isLoading}
              className="w-full py-3.5 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 hover:border-white/30 transition-all disabled:opacity-50"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Real-time" },
            { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Track Goals" },
            { icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", label: "Analytics" },
          ].map((feature, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
              <svg className="w-5 h-5 mx-auto mb-2 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
              </svg>
              <span className="text-xs text-white/50">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
