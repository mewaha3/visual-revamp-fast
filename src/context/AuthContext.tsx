
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  auth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut
} from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/services/userService";

interface AuthContextType {
  userEmail: string | null;
  userFullName: string | null;
  userId: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  fullName: string;
  email: string;
  national_id?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  zip_code?: string;
  certificate?: string;
  passport?: string;
  visa?: string;
  work_permit?: string;
  role?: string;
  createdAt?: string;
  [key: string]: any; // For any additional fields
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      try {
        if (user) {
          console.log("User is signed in:", user.uid);
          setUserEmail(user.email);
          setUserId(user.uid);
          
          // Get user data from Firestore
          const userData = await getUserProfile(user.uid);
          
          if (userData) {
            console.log("User data retrieved from Firestore:", userData);
            const fullName = userData.fullName || `${userData.first_name} ${userData.last_name}`;
            setUserFullName(fullName);
            setUserProfile(userData);
          } else {
            console.warn("No user document found in Firestore for:", user.uid);
            // Fallback to displayName from Auth if available
            setUserFullName(user.displayName || null);
            setUserProfile(null);
          }
        } else {
          console.log("User signed out");
          setUserEmail(null);
          setUserFullName(null);
          setUserId(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    try {
      console.log("Attempting to login with:", email);
      
      // Sign in with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Login successful:", user.uid);
      
      // Get user data from Firestore using our service function
      const userData = await getUserProfile(user.uid);
      
      if (userData) {
        console.log("User profile retrieved from Firestore:", userData);
        const fullName = userData.fullName || `${userData.first_name} ${userData.last_name}`;
        setUserFullName(fullName);
        setUserProfile(userData);
      } else {
        console.warn("No user document found in Firestore");
        // Fallback to displayName from Auth if available
        setUserFullName(user.displayName || null);
      }
      
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับกลับมา",
      });
      
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "คุณพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในภายหลัง";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "บัญชีนี้ถูกระงับการใช้งาน";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง";
      }
      
      toast({
        title: "เกิดข้อผิดพลาด",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      setUserEmail(null);
      setUserFullName(null);
      setUserId(null);
      setUserProfile(null);
      
      toast({
        title: "ออกจากระบบสำเร็จ",
        description: "คุณได้ออกจากระบบแล้ว",
      });
      
      // Redirect to homepage after logout
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  }

  return (
    <AuthContext.Provider value={{ 
      userEmail, 
      userFullName, 
      userId, 
      userProfile,
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
