
import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PostJob } from "@/types/types";

// Add a new "post job" entry to Firestore
export async function addPostJob(jobData: PostJob, userId?: string): Promise<string> {
  try {
    // If userId is provided, get the user profile first to add additional data
    let userProfileData = {};
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userProfileData = {
          first_name: userData.first_name || jobData.first_name,
          last_name: userData.last_name || jobData.last_name,
          gender: userData.gender || jobData.gender
        };
      }
    }

    // Add timestamp, user ID, and user profile data
    const dataWithMetadata = {
      ...jobData,
      ...userProfileData, // Override with user profile data if available
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      ...(userId && { user_id: userId })
    };

    // Add the document to Firestore
    const docRef = await addDoc(collection(db, "post_jobs"), dataWithMetadata);
    
    // Generate a job_id based on the document ID
    const jobId = `PJ${docRef.id.substring(0, 8)}`;
    
    // Update the document with the generated job_id
    await updateDoc(docRef, {
      job_id: jobId
    });

    console.log("PostJob saved successfully with ID:", jobId);
    return jobId;
  } catch (error) {
    console.error("Error adding post job:", error);
    throw error;
  }
}

// Get post job entries for a specific user
export async function getUserPostJobs(userId: string): Promise<PostJob[]> {
  try {
    const q = query(collection(db, "post_jobs"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const jobs: PostJob[] = [];
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      } as PostJob);
    });
    
    return jobs;
  } catch (error) {
    console.error("Error getting user post jobs:", error);
    throw error;
  }
}

// Get a post job by ID
export async function getPostJobById(jobId: string): Promise<PostJob | null> {
  try {
    // First try to find by job_id field
    const q = query(collection(db, "post_jobs"), where("job_id", "==", jobId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as PostJob;
    }
    
    // If not found, try to get by document ID
    const docRef = doc(db, "post_jobs", jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as PostJob;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting post job:", error);
    throw error;
  }
}
