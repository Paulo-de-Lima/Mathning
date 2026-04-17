import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
import type { UserProgressDoc } from "../types.js";
import { levelFromXp, xpForCorrectAnswer } from "../gamification.js";

export const USERS_COLLECTION = "users";

function todayIsoDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function yesterdayIsoDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function defaultUserProgress(uid: string): UserProgressDoc {
  return {
    xp: 0,
    level: 1,
    currentModuleId: "basic-ops",
    currentLessonId: "add",
    stats: { correct: 0, wrong: 0 },
    lastActiveDate: "",
    streak: 0,
    completedLessonIds: [],
    dailyExerciseDate: "",
    dailyExerciseCount: 0,
  };
}

export async function getUserProgress(
  db: Firestore,
  uid: string,
): Promise<UserProgressDoc | null> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProgressDoc;
}

export async function ensureUserProgress(
  db: Firestore,
  uid: string,
): Promise<UserProgressDoc> {
  const existing = await getUserProgress(db, uid);
  if (existing) return existing;
  const initial = defaultUserProgress(uid);
  await setDoc(doc(db, USERS_COLLECTION, uid), initial);
  return initial;
}

/** Atualiza streak ao abrir o app / completar atividade */
export async function touchDailyStreak(db: Firestore, uid: string): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as UserProgressDoc;
  const today = todayIsoDate();
  if (data.lastActiveDate === today) return;

  let streak = data.streak ?? 0;
  if (data.lastActiveDate === yesterdayIsoDate()) streak += 1;
  else if (data.lastActiveDate && data.lastActiveDate !== today) streak = 1;
  else streak = data.lastActiveDate ? streak : 1;

  await updateDoc(ref, {
    lastActiveDate: today,
    streak,
  });
}

export async function recordExerciseOutcome(
  db: Firestore,
  uid: string,
  correct: boolean,
  streakInSession: number,
  lessonId: string,
): Promise<{ xpGained: number; newXp: number; newLevel: number }> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error("User document missing");
  }
  const data = snap.data() as UserProgressDoc;
  const today = todayIsoDate();
  let streak = data.streak ?? 0;
  if (data.lastActiveDate !== today) {
    if (data.lastActiveDate === yesterdayIsoDate()) streak += 1;
    else streak = 1;
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

  await updateDoc(ref, {
    xp: newXp,
    level: newLevel,
    stats,
    lastActiveDate: today,
    streak,
    currentLessonId: lessonId,
    dailyExerciseDate,
    dailyExerciseCount,
  });

  return { xpGained: xpGain, newXp, newLevel };
}

export async function setCurrentLesson(
  db: Firestore,
  uid: string,
  moduleId: string,
  lessonId: string,
): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    currentModuleId: moduleId,
    currentLessonId: lessonId,
  });
}

export async function markLessonCompleted(
  db: Firestore,
  uid: string,
  lessonId: string,
): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as UserProgressDoc;
  const completed = new Set(data.completedLessonIds ?? []);
  completed.add(lessonId);
  await updateDoc(ref, {
    completedLessonIds: Array.from(completed),
  });
}
