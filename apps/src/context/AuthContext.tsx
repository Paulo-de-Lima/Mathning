import { createContext, useContext, type ReactNode } from "react";
import type { Firestore } from "firebase/firestore";
import type { UserProgressDoc } from "@mathning/shared";
import { useAuthAndProgress } from "../hooks/useAuthAndProgress";

export interface AuthContextValue {
  uid: string | null;
  progress: UserProgressDoc | null;
  loading: boolean;
  error: string | null;
  demo: boolean;
  refreshProgress: () => Promise<void>;
  updateLocalDemo: (next: UserProgressDoc) => Promise<void>;
  db: Firestore | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthAndProgress();
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext dentro de AuthProvider");
  }
  return ctx;
}
