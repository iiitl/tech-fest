"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getRole, signInWithGoogle, signOut } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setRole(u ? getRole(u.email) : null);
    });
    return unsub;
  }, []);

  async function login() {
    setError("");
    try {
      const { user: u, role: r } = await signInWithGoogle();
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

  return (
    <AuthContext.Provider value={{ user, role, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
