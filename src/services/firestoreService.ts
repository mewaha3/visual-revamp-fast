
import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PostJob } from "@/data/types/jobTypes";

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
    // Add timestamp and user ID if available
    const dataWithMetadata = {
      ...jobData,
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
export async function getUserFindJobs(userId: string) {
  try {
    const q = query(collection(db, "find_jobs"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const jobs: any[] = [];
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
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
    // Add timestamp and user ID if available
    const dataWithMetadata = {
      ...jobData,
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
export async function getUserPostJobs(userId: string) {
  try {
    const q = query(collection(db, "post_jobs"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const jobs: any[] = [];
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return jobs;
  } catch (error) {
    console.error("Error getting user post jobs:", error);
    throw error;
  }
}

// Get a post job by ID
export async function getPostJobById(jobId: string) {
  try {
    // First try to find by job_id field
    const q = query(collection(db, "post_jobs"), where("job_id", "==", jobId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    // If not found, try to get by document ID
    const docRef = doc(db, "post_jobs", jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting post job:", error);
    throw error;
  }
}

// Get a find job by ID
export async function getFindJobById(jobId: string) {
  try {
    // First try to find by findjob_id field
    const q = query(collection(db, "find_jobs"), where("findjob_id", "==", jobId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    // If not found, try to get by document ID
    const docRef = doc(db, "find_jobs", jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting find job:", error);
    throw error;
  }
}
