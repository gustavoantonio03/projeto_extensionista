import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { FirebaseRole, UserDoc } from "./types";

export interface SeedUserDefinition {
  email: string;
  password: string;
  displayName: string;
  shortName: string;
  role: FirebaseRole;
  relation?: string;
  patientId?: string;
}

export const INITIAL_SEED_USERS: SeedUserDefinition[] = [
  {
    email: "medico@siglo.com",
    password: "siglo123",
    displayName: "Dr. Roberto Silva",
    shortName: "Dr. Roberto",
    role: "doctor",
  },
  {
    email: "mae@siglo.com",
    password: "siglo123",
    displayName: "Ana Paula Ferreira",
    shortName: "Ana",
    role: "caregiver",
    relation: "Mãe",
    patientId: "pac-001",
  },
  {
    email: "clarinha@siglo.com",
    password: "siglo123",
    displayName: "Clara Ferreira",
    shortName: "Clarinha",
    role: "patient",
    patientId: "pac-001",
  },
];

export interface SeedResultItem {
  email: string;
  role: FirebaseRole;
  uid: string;
  status: "created" | "updated" | "error";
  message?: string;
}

/**
 * Cria ou atualiza os 3 usuários de teste no Firebase Auth e Firestore collection `users/{uid}`.
 */
export async function seedInitialUsers(): Promise<{
  success: boolean;
  results: SeedResultItem[];
}> {
  const results: SeedResultItem[] = [];

  for (const def of INITIAL_SEED_USERS) {
    try {
      let uid = "";
      let status: "created" | "updated" = "created";

      try {
        // Tenta criar novo usuário no Auth
        const cred = await createUserWithEmailAndPassword(auth, def.email, def.password);
        uid = cred.user.uid;
        await updateProfile(cred.user, { displayName: def.displayName });
      } catch (authErr: any) {
        if (authErr?.code === "auth/email-already-in-use") {
          // Se já existe, autentica para recuperar o UID
          const cred = await signInWithEmailAndPassword(auth, def.email, def.password);
          uid = cred.user.uid;
          status = "updated";
        } else {
          throw authErr;
        }
      }

      // Garante/atualiza o documento na coleção `users/{uid}`
      const userDocData: Partial<UserDoc> & Record<string, any> = {
        uid,
        email: def.email,
        displayName: def.displayName,
        shortName: def.shortName,
        role: def.role,
        updatedAt: new Date().toISOString(),
      };

      if (def.relation) userDocData.relation = def.relation;
      if (def.patientId) userDocData.patientId = def.patientId;

      await setDoc(doc(db, "users", uid), userDocData, { merge: true });

      results.push({
        email: def.email,
        role: def.role,
        uid,
        status,
        message: status === "created" ? "Usuário e perfil criados com sucesso." : "Usuário já existia; perfil sincronizado no Firestore.",
      });
    } catch (err: any) {
      console.error(`Erro ao seedar usuário ${def.email}:`, err);
      results.push({
        email: def.email,
        role: def.role,
        uid: "",
        status: "error",
        message: err?.message || String(err),
      });
    }
  }

  // Faz logout ao final para não manter a sessão no último usuário seedado
  try {
    await signOut(auth);
  } catch {
    // ignora
  }

  const hasErrors = results.some((r) => r.status === "error");
  return {
    success: !hasErrors,
    results,
  };
}
