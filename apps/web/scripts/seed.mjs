import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env.local");

// Carrega .env.local manualmente
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val;
    }
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Inicializando Firebase para provisionamento dos usuários de teste...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const USERS = [
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

async function seed() {
  for (const def of USERS) {
    try {
      let uid = "";
      let status = "created";

      try {
        const cred = await createUserWithEmailAndPassword(auth, def.email, def.password);
        uid = cred.user.uid;
        await updateProfile(cred.user, { displayName: def.displayName });
        console.log(`[SEED] Criado no Auth: ${def.email} (UID: ${uid})`);
      } catch (authErr) {
        if (authErr?.code === "auth/email-already-in-use") {
          const cred = await signInWithEmailAndPassword(auth, def.email, def.password);
          uid = cred.user.uid;
          status = "existing";
          console.log(`[SEED] Usuário já existia no Auth: ${def.email} (UID: ${uid})`);
        } else {
          throw authErr;
        }
      }

      const userDocData = {
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
      console.log(`[SEED] Perfil atualizado no Firestore users/${uid}: role=${def.role}`);
    } catch (err) {
      console.error(`[SEED ERRO] Falha ao provisionar ${def.email}:`, err.message);
    }
  }
  console.log("Provisionamento de usuários concluído com sucesso!");
}

seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
