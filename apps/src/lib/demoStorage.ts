import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserProgressDoc } from "@mathning/shared";
import { defaultUserProgress } from "@mathning/shared";

const KEY = "mathning-demo-user";

export async function loadDemoProgress(): Promise<UserProgressDoc> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultUserProgress("demo");
    return JSON.parse(raw) as UserProgressDoc;
  } catch {
    return defaultUserProgress("demo");
  }
}

export async function saveDemoProgress(data: UserProgressDoc): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}
