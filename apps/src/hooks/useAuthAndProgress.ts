import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { UserProgressDoc } from "@mathning/shared";
import { ensureUserProgress, touchDailyStreak } from "@mathning/shared";
import { getDb, getFirebaseAuth, isFirebaseConfigured } from "../lib/firebase";
import { loadDemoProgress, saveDemoProgress } from "../lib/demoStorage";

export function useAuthAndProgress() {
  const [uid, setUid] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgressDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const demo = !isFirebaseConfigured();

  const db = useMemo<Firestore | null>(() => {
    if (demo) return null;
    return getDb() as Firestore;
  }, [demo]);

  const refreshProgress = useCallback(async () => {
    if (demo) {
      setProgress(await loadDemoProgress());
      return;
    }
    if (!uid || !db) return;
    try {
      await ensureUserProgress(db, uid);
      await touchDailyStreak(db, uid);
      setProgress(await ensureUserProgress(db, uid));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar progresso");
    }
  }, [demo, uid, db]);

  useEffect(() => {
    if (demo) {
      void (async () => {
        setUid("demo");
        setProgress(await loadDemoProgress());
        setLoading(false);
      })();
      return;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      setError(null);
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Falha no login anônimo");
          setLoading(false);
        }
        return;
      }
      setUid(user.uid);
      try {
        const database = getDb() as Firestore;
        await ensureUserProgress(database, user.uid);
        await touchDailyStreak(database, user.uid);
        const p = await ensureUserProgress(database, user.uid);
        setProgress(p);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar progresso");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [demo]);

  const updateLocalDemo = useCallback(async (next: UserProgressDoc) => {
    await saveDemoProgress(next);
    setProgress(next);
  }, []);

  return {
    uid,
    progress,
    loading,
    error,
    demo,
    refreshProgress,
    updateLocalDemo,
    db,
  };
}
