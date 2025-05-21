
import React, { createContext, useContext, useEffect, useState } from "react";
import { findUserByCredentials, User } from "../data/users";
import { getUsersFromSheet } from "@/services/sheetsService";
import { useToast } from "@/hooks/use-toast";

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
  const [sheetUsers, setSheetUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { toast } = useToast();

  // Fetch users from Google Sheets on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        console.log('Fetching users from Google Sheets');
        const users = await getUsersFromSheet();
        console.log(`Fetched ${users.length} users from sheets`);
        setSheetUsers(users);
      } catch (error) {
        console.error("Failed to fetch users from sheet:", error);
        toast({
          title: "ไม่สามารถเชื่อมต่อกับ Google Sheets ได้",
          description: "ระบบจะใช้ข้อมูลผู้ใช้ในแอปพลิเคชัน",
          variant: "destructive"
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);

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
      console.log("Sheet users count:", sheetUsers.length);
      
      // First try to find user in sheet data
      let user: User | undefined;
      
      if (sheetUsers.length > 0) {
        console.log("Checking sheet users for match");
        user = sheetUsers.find(u => {
          console.log(`Comparing: ${u.email} === ${email} && ${u.password} === ${password}`);
          return u.email === email && u.password === password;
        });
        
        if (user) {
          console.log("Found user in sheets:", user);
        }
      }
      
      // If not found in sheets, try local user data as fallback
      if (!user) {
        console.log("User not found in sheets, trying local data");
        user = findUserByCredentials(email, password);
      }
      
      console.log("Login match found:", user ? "Yes" : "No");
      
      if (user) {
        setUserEmail(email);
        
        // Get full name from user data
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
