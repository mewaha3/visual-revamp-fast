
import { doc, getDoc, setDoc, updateDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Get user profile by userId
export async function getUserProfile(userId: string): Promise<any | null> {
  try {
    if (!userId) {
      console.error("Cannot get user profile: No user ID provided");
      return null;
    }
    
    console.log(`Fetching user profile for user ID: ${userId}`);
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      console.log("User profile found:", userDoc.id);
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.warn(`No profile found for user ID: ${userId}`);
      return null;
    }
    
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Update user profile data
export async function updateUserProfile(userId: string, data: Partial<DocumentData>): Promise<boolean> {
  try {
    if (!userId) {
      console.error("Cannot update profile: User ID is missing");
      return false;
    }
    
    console.log(`Updating user profile for ${userId} with data:`, data);
    const userDocRef = doc(db, "users", userId);
    
    // First check if the document exists
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      console.log("User profile updated successfully");
    } else {
      // Create new document
      await setDoc(userDocRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log("User profile created successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}

// Create or update user profile
export async function setUserProfile(userId: string, userData: any): Promise<boolean> {
  try {
    if (!userId) {
      console.error("Cannot set profile: User ID is missing");
      return false;
    }
    
    console.log(`Setting user profile for ${userId} with data:`, userData);
    const userDocRef = doc(db, "users", userId);
    
    await setDoc(userDocRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log("User profile set successfully");
    return true;
  } catch (error) {
    console.error("Error setting user profile:", error);
    return false;
  }
}
