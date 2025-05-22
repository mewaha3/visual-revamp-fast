
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Get user profile by userId
export async function getUserProfile(userId: string): Promise<any | null> {
  try {
    if (!userId) return null;
    
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// No need for the re-export here since we're already exporting the function above
// Removing: export { getUserProfile };
