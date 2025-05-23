
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MatchResult } from "@/types/types";

// Interface for match result submission
export interface MatchResultSubmission {
  job_id: string;
  findjob_id: string;
  priority: number;
  status: 'on_queue' | 'accepted' | 'declined' | 'no_candidates';
  // Job details fields
  job_type: string;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
  job_salary: number;
  // Worker details fields
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  user_id?: string;
  workerId?: string;
  // Employer details
  first_name_post_jobs?: string;
  last_name_post_jobs?: string;
  gender_post_jobs?: string;
  // Worker details
  first_name_find_jobs?: string;
  last_name_find_jobs?: string;
  gender_find_jobs?: string;
  // Additional fields
  skills?: string;
  embedding_model?: string;
}

// Add a match result to Firestore
export async function addMatchResult(matchData: MatchResultSubmission): Promise<string> {
  try {
    // Add timestamp, set default status if not provided, and add embedding model info
    const dataWithMetadata = {
      ...matchData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: matchData.status || 'on_queue',
      embedding_model: 'airesearch/wangchanberta-base-att-spm-uncased'
    };

    // First, try to get the post job to include employer info
    try {
      let postJobData: Record<string, any> = { id: '' };
      
      // Try to find by job_id field
      const postJobQuery = query(collection(db, "post_jobs"), 
        where("job_id", "==", matchData.job_id));
      const postJobSnapshot = await getDocs(postJobQuery);
      
      if (!postJobSnapshot.empty) {
        postJobData = {
          id: postJobSnapshot.docs[0].id,
          ...postJobSnapshot.docs[0].data()
        };
        
        // Add employer info
        if (postJobData.user_id) {
          const employerRef = doc(db, "users", postJobData.user_id);
          const employerSnap = await getDoc(employerRef);
          
          if (employerSnap.exists()) {
            const employerData = employerSnap.data();
            dataWithMetadata.first_name_post_jobs = employerData.first_name;
            dataWithMetadata.last_name_post_jobs = employerData.last_name;
            dataWithMetadata.gender_post_jobs = employerData.gender;
          }
        }
      }
    } catch (error) {
      console.error("Error getting post job data:", error);
    }
    
    // Then, try to get the find job to include worker info
    try {
      let findJobData: Record<string, any> = { id: '' };
      
      // Try to find by findjob_id field
      const findJobQuery = query(collection(db, "find_jobs"), 
        where("findjob_id", "==", matchData.findjob_id));
      const findJobSnapshot = await getDocs(findJobQuery);
      
      if (!findJobSnapshot.empty) {
        findJobData = {
          id: findJobSnapshot.docs[0].id,
          ...findJobSnapshot.docs[0].data()
        };
        
        // Add worker info
        if (findJobData.user_id) {
          const workerRef = doc(db, "users", findJobData.user_id);
          const workerSnap = await getDoc(workerRef);
          
          if (workerSnap.exists()) {
            const workerData = workerSnap.data();
            dataWithMetadata.first_name_find_jobs = workerData.first_name;
            dataWithMetadata.last_name_find_jobs = workerData.last_name;
            dataWithMetadata.gender_find_jobs = workerData.gender;
            dataWithMetadata.workerId = findJobData.user_id;
          }
        }
        
        // Add skills info if available
        if (findJobData.skills) {
          dataWithMetadata.skills = findJobData.skills;
        }
      }
    } catch (error) {
      console.error("Error getting find job data:", error);
    }

    // Add the document to Firestore
    const docRef = await addDoc(collection(db, "match_results"), dataWithMetadata);
    console.log("Match result saved successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding match result:", error);
    throw error;
  }
}

// Update match result status
export async function updateMatchResultStatus(
  matchId: string, 
  status: 'accepted' | 'declined' | 'on_queue' | 'no_candidates'
): Promise<boolean> {
  try {
    const docRef = doc(db, "match_results", matchId);
    await updateDoc(docRef, {
      status: status,
      updated_at: serverTimestamp()
    });
    console.log(`Match status updated to ${status} for ID: ${matchId}`);
    return true;
  } catch (error) {
    console.error(`Error updating match status to ${status}:`, error);
    return false;
  }
}

// Create a simple match record when no matches are found
export async function createSimpleMatch(jobData: {
  job_id: string, 
  job_type: string,
  job_date: string,
  start_time: string,
  end_time: string,
  job_address: string,
  province: string,
  district: string,
  subdistrict: string,
  zip_code: string,
  job_salary: number,
  user_id?: string
}): Promise<string> {
  try {
    // Create a placeholder match result with status no_candidates
    const matchData: MatchResultSubmission = {
      job_id: jobData.job_id,
      findjob_id: 'no_candidates',
      priority: 1,
      status: 'no_candidates',
      job_type: jobData.job_type,
      job_date: jobData.job_date,
      start_time: jobData.start_time,
      end_time: jobData.end_time,
      job_address: jobData.job_address,
      province: jobData.province,
      district: jobData.district,
      subdistrict: jobData.subdistrict,
      zip_code: jobData.zip_code,
      job_salary: jobData.job_salary,
      first_name: '',
      last_name: '',
      gender: '',
      email: ''
    };
    
    // If user_id is provided, try to get employer info
    if (jobData.user_id) {
      try {
        const employerRef = doc(db, "users", jobData.user_id);
        const employerSnap = await getDoc(employerRef);
        
        if (employerSnap.exists()) {
          const employerData = employerSnap.data();
          matchData.first_name_post_jobs = employerData.first_name;
          matchData.last_name_post_jobs = employerData.last_name;
          matchData.gender_post_jobs = employerData.gender;
        }
      } catch (error) {
        console.error("Error getting employer data:", error);
      }
    }
    
    return await addMatchResult(matchData);
  } catch (error) {
    console.error("Error creating simple match:", error);
    throw error;
  }
}

// Get match results by job ID
export async function getMatchResultsByJobId(jobId: string) {
  try {
    const q = query(collection(db, "match_results"), where("job_id", "==", jobId));
    const querySnapshot = await getDocs(q);
    
    const matches: any[] = [];
    querySnapshot.forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return matches;
  } catch (error) {
    console.error("Error getting match results:", error);
    throw error;
  }
}

// Aliases for backward compatibility
export const getMatchResultsForJob = getMatchResultsByJobId;
export const saveMatchResults = addMatchResult;
export const matchJobWithWorkers = async () => {
  // This function was likely used elsewhere but is now deprecated
  console.warn("matchJobWithWorkers is deprecated, please update your code");
  return [];
};
