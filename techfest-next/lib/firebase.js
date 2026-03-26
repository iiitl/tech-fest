import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "iiiitl.ac.in";

const hasConfig =
  typeof firebaseConfig.apiKey === "string" &&
  firebaseConfig.apiKey.length > 0 &&
  !firebaseConfig.apiKey.startsWith("your_");

let auth = null;
let provider = null;

if (hasConfig) {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
}

export { auth };

const ROLES = {
  "lcs2024016@iiitl.ac.in": "admin",
  "lci2024010@iiitl.ac.in":"admin",
  "lit2023030@iiitl.ac.in":"admin",
  "lit2024045@iiitl.ac.in":"admin"
};

const ALLOW_ALL_EDIT = false; 

export function getRole(email) {
  if (ALLOW_ALL_EDIT) return "admin";
  return ROLES[email] || "student";
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not configured. Add keys to .env.local");
  const result = await signInWithPopup(auth, provider);
  const email = result.user.email;
  if (!email.endsWith("@" + ALLOWED_DOMAIN)) {
    await fbSignOut(auth);
    throw new Error("Access restricted to @" + ALLOWED_DOMAIN + " accounts.");
  }
  return { user: result.user, role: getRole(email) };
}

export async function signOut() {
  if (!auth) return;
  await fbSignOut(auth);
}
