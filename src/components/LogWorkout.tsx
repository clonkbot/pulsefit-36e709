import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

const workoutTypes = [
  { id: "strength", label: "Strength", icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4", color: "from-[#ff3366] to-[#ff6b8a]" },
  { id: "cardio", label: "Cardio", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "from-[#00ff88] to-[#00cc6a]" },
  { id: "flexibility", label: "Flexibility", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z", color: "from-[#8b5cf6] to-[#a78bfa]" },
  { id: "hiit", label: "HIIT", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "from-[#f59e0b] to-[#fbbf24]" },
];

const presetExercises: Record<string, string[]> = {
  strength: ["Bench Press", "Squats", "Deadlift", "Pull-ups", "Rows", "Shoulder Press"],
  cardio: ["Running", "Cycling", "Swimming", "Rowing", "Jump Rope", "Elliptical"],
  flexibility: ["Yoga", "Stretching", "Pilates", "Foam Rolling", "Dynamic Stretches"],
  hiit: ["Burpees", "Mountain Climbers", "Box Jumps", "Kettlebell Swings", "Sprints"],
};

export function LogWorkout({ onClose }: { onClose: () => void }) {
  const createWorkout = useMutation(api.workouts.create);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "strength",
    duration: 30,
    calories: 200,
    exercises: [] as Exercise[],
    notes: "",
  });

  const [newExercise, setNewExercise] = useState<Exercise>({ name: "" });

  const handleAddExercise = () => {
    if (newExercise.name.trim()) {
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...newExercise }],
      }));
      setNewExercise({ name: "" });
    }
  };

  const handleRemoveExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await createWorkout({
        name: formData.name,
        type: formData.type,
        duration: formData.duration,
        calories: formData.calories,
        exercises: formData.exercises,
        notes: formData.notes || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0f0f14] border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f0f14] border-b border-white/10 p-4 sm:p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Log Workout</h2>
            <p className="text-sm text-white/50">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-4 sm:p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Workout Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Morning Run, Leg Day, etc."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-3">Workout Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {workoutTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        formData.type === type.id
                          ? `bg-gradient-to-br ${type.color} border-transparent text-black`
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
                      </svg>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00ff88]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Calories</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    min="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00ff88]/50 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Exercises */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Add Exercise</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Exercise name"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddExercise()}
                  />
                  <button
                    onClick={handleAddExercise}
                    className="px-4 py-3 bg-[#00ff88] text-black font-semibold rounded-xl hover:bg-[#00cc6a] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Quick add */}
              <div>
                <p className="text-xs text-white/40 mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {presetExercises[formData.type]?.slice(0, 4).map((exercise) => (
                    <button
                      key={exercise}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        exercises: [...prev.exercises, { name: exercise }]
                      }))}
                      className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    >
                      + {exercise}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.exercises.length === 0 ? (
                  <p className="text-center text-white/40 py-8">No exercises added yet</p>
                ) : (
                  formData.exercises.map((exercise, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white">{exercise.name}</span>
                      <button
                        onClick={() => handleRemoveExercise(i)}
                        className="text-white/40 hover:text-[#ff3366] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Workout</span>
                  <span className="text-white font-medium">{formData.name || "Untitled"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Type</span>
                  <span className="text-white font-medium capitalize">{formData.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Duration</span>
                  <span className="text-white font-medium">{formData.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Calories</span>
                  <span className="text-white font-medium">{formData.calories}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Exercises</span>
                  <span className="text-white font-medium">{formData.exercises.length}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How did it go?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-all resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0f0f14] border-t border-white/10 p-4 sm:p-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.name.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Complete Workout"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
