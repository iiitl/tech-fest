"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";
import { auth, signInWithGoogle, signOut } from "@/lib/firebase";

const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "iiitl.ac.in";

const AuthContext = createContext(null);

async function fetchRole(email) {
  try {
    const res = await fetch(`/api/role?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.role || "student";
  } catch {
    return "student";
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // enforce domain restriction at the state level too
        if (!u.email.endsWith("@" + ALLOWED_DOMAIN)) {
          await fbSignOut(auth);
          setUser(null);
          setRole(null);
          setError(`Access restricted to @${ALLOWED_DOMAIN} accounts.`);
          setLoading(false);
          return;
        }
        const r = await fetchRole(u.email);
        setUser(u);
        setRole(r);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      // onAuthStateChanged handles the rest
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function logout() {
    await signOut();
    setUser(null);
    setRole(null);
  }

  async function refreshRole() {
    if (!user) return;
    const r = await fetchRole(user.email);
    setRole(r);
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, refreshRole, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
