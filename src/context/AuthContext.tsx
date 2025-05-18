import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fastlabor_user");
    if (saved) setUserEmail(saved);
  }, []);

  async function login(email: string, password: string) {
    // fetch users from your API
    const resp = await fetch("/api/sheets");
    if (!resp.ok) return false;
    const { users } = await resp.json() as { users: Array<{email:string,password:string}> };
    const match = users.find((u) => u.email === email && u.password === password);
    if (match) {
      setUserEmail(email);
      localStorage.setItem("fastlabor_user", email);
      return true;
    }
    return false;
  }

  function logout() {
    setUserEmail(null);
    localStorage.removeItem("fastlabor_user");
  }

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
