import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc, doc, getDoc, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PostJob, FindJob } from "@/types/types";

// Interface for FindJob submissions to Firestore
export interface FindJobSubmission {
  first_name: string;
  last_name: string;
  email: string;
  job_type: string;
  skills: string;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
  start_salary: number;
  range_salary: number;
  gender: string;
  // Additional metadata
  created_at?: any;
  updated_at?: any;
  user_id?: string;
}

// Add a new "find job" entry to Firestore
export async function addFindJob(jobData: FindJobSubmission, userId?: string): Promise<string> {
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
    const docRef = await addDoc(collection(db, "find_jobs"), dataWithMetadata);
    
    // Generate a findjob_id based on the document ID
    const findjobId = `FJ${docRef.id.substring(0, 8)}`;
    
    // Update the document with the generated findjob_id
    await updateDoc(docRef, {
      findjob_id: findjobId
    });

    console.log("FindJob saved successfully with ID:", findjobId);
    return findjobId;
  } catch (error) {
    console.error("Error adding find job:", error);
    throw error;
  }
}

// Get find job entries for a specific user
export async function getUserFindJobs(userId: string): Promise<FindJob[]> {
  try {
    // Query jobs that belong to this user
    const q = query(collection(db, "find_jobs"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const jobs: FindJob[] = [];
    querySnapshot.forEach((doc) => {
      // Get jobs that are not already matched in match_results
      jobs.push({
        id: doc.id,
        ...doc.data()
      } as FindJob);
    });
    
    return jobs;
  } catch (error) {
    console.error("Error getting user find jobs:", error);
    throw error;
  }
}

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

// Get a find job by ID
export async function getFindJobById(jobId: string): Promise<FindJob | null> {
  try {
    // First try to find by findjob_id field
    const q = query(collection(db, "find_jobs"), where("findjob_id", "==", jobId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FindJob;
    }
    
    // If not found, try to get by document ID
    const docRef = doc(db, "find_jobs", jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FindJob;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting find job:", error);
    throw error;
  }
}

// Update a match result status
export async function updateMatchStatus(matchId: string, status: "accepted" | "declined" | "on_queue"): Promise<boolean> {
  try {
    const docRef = doc(db, "match_results", matchId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        status: status,
        updated_at: serverTimestamp()
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error updating match status to ${status}:`, error);
    return false;
  }
}

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

// Get find jobs that have not been matched yet
export async function getUnmatchedFindJobs(userId: string): Promise<FindJob[]> {
  try {
    if (!userId) return [];
    
    // Get all find jobs for this user
    const findJobsQuery = query(collection(db, "find_jobs"), where("user_id", "==", userId));
    const findJobsSnapshot = await getDocs(findJobsQuery);
    
    const findJobs: FindJob[] = [];
    const findJobIds: string[] = [];
    
    // Collect all find job ids for this user
    findJobsSnapshot.forEach((doc) => {
      const data = doc.data();
      const findJob = { id: doc.id, ...data } as FindJob;
      findJobs.push(findJob);
      
      if (data.findjob_id) {
        findJobIds.push(data.findjob_id);
      } else {
        findJobIds.push(doc.id);
      }
    });
    
    if (findJobIds.length === 0) {
      return findJobs; // No find jobs to check for matches
    }
    
    // Find matches that use these find job ids
    const matchResults: { [key: string]: boolean } = {};
    
    // Check match_results to find any matched find jobs
    for (const findJobId of findJobIds) {
      const matchesQuery = query(
        collection(db, "match_results"),
        where("findjob_id", "==", findJobId)
      );
      
      const matchesSnapshot = await getDocs(matchesQuery);
      
      if (!matchesSnapshot.empty) {
        // This find job has been matched
        matchResults[findJobId] = true;
      }
    }
    
    // Filter out matched find jobs
    return findJobs.filter(job => {
      const id = job.findjob_id || job.id;
      return !matchResults[id];
    });
  } catch (error) {
    console.error("Error getting unmatched find jobs:", error);
    return [];
  }
}
