"use client";

import * as React from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { FirebaseRole, UserDoc } from "./types";
import { syncFirebaseSession, clearFirebaseSession } from "./data";

export interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  role: FirebaseRole | null;
  login: (
    email: string,
    pass: string
  ) => Promise<{ user: User; userDoc: UserDoc; redirectTo: string }>;
  logout: () => Promise<void>;
  refreshUserDoc: () => Promise<UserDoc | null>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function getRouteForRole(role: FirebaseRole): string {
  switch (role) {
    case "patient":
      return "/";
    case "caregiver":
      return "/clinico";
    case "doctor":
      return "/medico";
    default:
      return "/";
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [userDoc, setUserDoc] = React.useState<UserDoc | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchUserDoc = React.useCallback(async (uid: string, fallbackUser?: User | null) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        setUserDoc(data);
        syncFirebaseSession(data);
        return data;
      }

      // Se o documento no Firestore ainda não existir, cria fallback gracioso
      const fallbackRole: FirebaseRole = fallbackUser?.email?.includes("medico")
        ? "doctor"
        : fallbackUser?.email?.includes("clarinha")
        ? "patient"
        : "caregiver";

      const fallback: UserDoc = {
        uid,
        email: fallbackUser?.email || "",
        displayName: fallbackUser?.displayName || fallbackUser?.email?.split("@")[0] || "Usuário",
        role: fallbackRole,
        relation: fallbackRole === "caregiver" ? "Mãe" : undefined,
        shortName: fallbackUser?.displayName?.split(" ")[0],
      };
      setUserDoc(fallback);
      syncFirebaseSession(fallback);
      return fallback;
    } catch (err) {
      console.error("Erro ao buscar documento do usuário no Firestore:", err);
      return null;
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserDoc(currentUser.uid, currentUser);
      } else {
        setUserDoc(null);
        clearFirebaseSession();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserDoc]);

  const login = React.useCallback(
    async (email: string, pass: string) => {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const profile = await fetchUserDoc(cred.user.uid, cred.user);
      const role: FirebaseRole = profile?.role || "caregiver";
      const redirectTo = getRouteForRole(role);
      return {
        user: cred.user,
        userDoc: profile as UserDoc,
        redirectTo,
      };
    },
    [fetchUserDoc]
  );

  const logout = React.useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setUserDoc(null);
    clearFirebaseSession();
  }, []);

  const refreshUserDoc = React.useCallback(async () => {
    if (!auth.currentUser) return null;
    return await fetchUserDoc(auth.currentUser.uid, auth.currentUser);
  }, [fetchUserDoc]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      userDoc,
      loading,
      role: userDoc?.role ?? null,
      login,
      logout,
      refreshUserDoc,
    }),
    [user, userDoc, loading, login, logout, refreshUserDoc]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser utilizado dentro de um <AuthProvider />");
  }
  return ctx;
}
