import { getModuleById } from "@mathning/shared";

export function isLessonUnlocked(
  moduleId: string,
  lessonId: string,
  completedLessonIds: string[],
): boolean {
  const mod = getModuleById(moduleId);
  if (!mod?.available) return false;
  const idx = mod.lessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  const prev = mod.lessons[idx - 1];
  return completedLessonIds.includes(prev.id);
}
