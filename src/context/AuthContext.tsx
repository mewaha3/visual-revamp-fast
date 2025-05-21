
import React, { createContext, useContext, useEffect, useState } from "react";
import { findUserByCredentials, User, getAllUsers } from "../data/users";

interface AuthContextType {
  userEmail: string | null;
  userFullName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  // restore from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("fastlabor_user");
    const savedFullName = localStorage.getItem("fastlabor_user_fullname");
    
    if (savedEmail) setUserEmail(savedEmail);
    if (savedFullName) setUserFullName(savedFullName);
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      console.log("Attempting to login with:", email);
      
      // Try to find user in both hard-coded array and localStorage
      const user = findUserByCredentials(email, password);
      
      // If not found in hard-coded array, check localStorage
      if (!user) {
        const allUsers = getAllUsers();
        const localUser = allUsers.find(u => u.email === email && u.password === password);
        
        if (localUser) {
          setUserEmail(email);
          const fullName = localUser.fullName || `${localUser.first_name} ${localUser.last_name}` || email;
          setUserFullName(fullName);
          
          localStorage.setItem("fastlabor_user", email);
          localStorage.setItem("fastlabor_user_fullname", fullName);
          return true;
        }
        return false;
      }
      
      console.log("Login match found:", user ? "Yes" : "No");
      
      if (user) {
        setUserEmail(email);
        
        // ดึงชื่อเต็มจากข้อมูลผู้ใช้
        const fullName = user.fullName || `${user.first_name} ${user.last_name}` || email;
        setUserFullName(fullName);
        
        localStorage.setItem("fastlabor_user", email);
        localStorage.setItem("fastlabor_user_fullname", fullName);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  function logout(): void {
    setUserEmail(null);
    setUserFullName(null);
    localStorage.removeItem("fastlabor_user");
    localStorage.removeItem("fastlabor_user_fullname");
    // Redirect to homepage after logout
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{ userEmail, userFullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
