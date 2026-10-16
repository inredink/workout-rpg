export const BASE_XP_PER_SET = 5;
export const REPS_WEIGHT_FACTOR = 0.25;
export const MAX_XP_PER_SET = 40;
export const WORKOUT_COMPLETION_BONUS = 20;

export function calculateWorkoutXp(
  setCount: number,
  totalReps: number,
  totalWeight: number,
): number {
  const perSet = Math.min(
    BASE_XP_PER_SET + totalReps * REPS_WEIGHT_FACTOR + totalWeight * 0.03,
    MAX_XP_PER_SET,
  );

  const baseXp = setCount * perSet;
  return Math.round(baseXp + WORKOUT_COMPLETION_BONUS);
}
