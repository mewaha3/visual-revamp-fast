
// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  DocumentData
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfgHWEJjpI5J5vvXRlpBtvp7xk8mF2HOc",
  authDomain: "fastlabor-4b8d5.firebaseapp.com",
  projectId: "fastlabor-4b8d5",
  storageBucket: "fastlabor-4b8d5.firebasestorage.app",
  messagingSenderId: "274887841093",
  appId: "1:274887841093:web:60da2ce23cb9bc754c1a2c",
  measurementId: "G-8W9EYTHYWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper function to get user profile data
export async function getUserProfile(userId: string): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Helper function to update user profile data
export async function updateUserProfile(userId: string, data: Partial<DocumentData>): Promise<boolean> {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}

// Export auth functions for easier use
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  // Firestore exports
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  // Storage exports
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};
