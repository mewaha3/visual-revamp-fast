
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Use API URL based on environment
const API_URL = import.meta.env.PROD 
  ? "https://your-production-api.com" 
  : "http://localhost:4000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fastlabor_user");
    if (saved) setUserEmail(saved);
  }, []);

  async function login(email: string, password: string) {
    try {
      console.log("Attempting to login with:", email);
      
      // ดึงข้อมูลผู้ใช้จาก Google Sheet
      const response = await fetch(`${API_URL}/api/users`);
      
      if (!response.ok) {
        console.error("Failed to fetch users:", response.statusText);
        return false;
      }
      
      const data = await response.json();
      console.log("Users data received:", data);
      
      // ตรวจสอบรูปแบบข้อมูลที่ได้รับ
      if (!data.users || !Array.isArray(data.users)) {
        console.error("Invalid users data format:", data);
        return false;
      }

      // ตรวจสอบว่ามี user ที่ตรงกับ email และ password หรือไม่
      const match = data.users.find(
        (user) => user.email === email && user.password === password
      );

      console.log("Login match found:", match ? "Yes" : "No");
      
      if (match) {
        setUserEmail(email);
        localStorage.setItem("fastlabor_user", email);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  function logout() {
    setUserEmail(null);
    localStorage.removeItem("fastlabor_user");
    // Redirect to homepage after logout
    window.location.href = '/';
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
