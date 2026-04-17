/** XP base por acerto */
export const XP_PER_CORRECT = 10;
/** Bônus quando há sequência de acertos na sessão */
export const XP_STREAK_BONUS = 2;
/** XP necessário para subir um nível (curva simples no MVP) */
export const XP_PER_LEVEL = 100;

export function levelFromXp(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(xp: number): { currentLevel: number; xpIntoLevel: number; xpForNext: number } {
  const currentLevel = levelFromXp(xp);
  const xpIntoLevel = xp % XP_PER_LEVEL;
  return {
    currentLevel,
    xpIntoLevel,
    xpForNext: XP_PER_LEVEL,
  };
}

export function xpForCorrectAnswer(streakInSession: number): number {
  const bonus = streakInSession >= 2 ? XP_STREAK_BONUS : 0;
  return XP_PER_CORRECT + bonus;
}

/** Meta diária simples: quantidade de exercícios */
export const DAILY_GOAL_EXERCISES = 5;
