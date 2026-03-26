"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, signOut } from "@/lib/firebase";

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
      setUser(u || null);
      if (u) {
        const r = await fetchRole(u.email);
        setRole(r);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login() {
    setError("");
    try {
      const { user: u } = await signInWithGoogle();
      const r = await fetchRole(u.email);
      setUser(u);
      setRole(r);
    } catch (e) {
      setError(e.message);
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
