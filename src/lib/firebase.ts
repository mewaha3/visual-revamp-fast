
// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Export auth functions for easier use
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};
