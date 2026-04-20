import type { UserProgressDoc } from "@mathning/shared";
import { levelFromXp, xpForCorrectAnswer } from "@mathning/shared";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function recordDemoExercise(
  data: UserProgressDoc,
  correct: boolean,
  streakInSession: number,
  lessonId: string,
): UserProgressDoc {
  const today = todayIso();
  let streak = data.streak ?? 0;
  if (data.lastActiveDate !== today) {
    if (data.lastActiveDate === yesterdayIso()) streak += 1;
    else streak = data.lastActiveDate ? 1 : 1;
  }

  const xpGain = correct ? xpForCorrectAnswer(streakInSession) : 0;
  const newXp = (data.xp ?? 0) + xpGain;
  const newLevel = levelFromXp(newXp);
  const stats = {
    correct: (data.stats?.correct ?? 0) + (correct ? 1 : 0),
    wrong: (data.stats?.wrong ?? 0) + (correct ? 0 : 1),
  };

  let dailyExerciseDate = data.dailyExerciseDate ?? "";
  let dailyExerciseCount = data.dailyExerciseCount ?? 0;
  if (dailyExerciseDate !== today) {
    dailyExerciseDate = today;
    dailyExerciseCount = 0;
  }
  dailyExerciseCount += 1;

  return {
    ...data,
    xp: newXp,
    level: newLevel,
    stats,
    lastActiveDate: today,
    streak,
    currentLessonId: lessonId,
    dailyExerciseDate,
    dailyExerciseCount,
  };
}

export function markDemoLessonDone(
  data: UserProgressDoc,
  lessonId: string,
): UserProgressDoc {
  const completed = new Set(data.completedLessonIds ?? []);
  completed.add(lessonId);
  return {
    ...data,
    completedLessonIds: Array.from(completed),
  };
}
