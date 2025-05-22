
import { getUnmatchedFindJobs } from "./firestoreService";
import { FindJob } from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to get unmatched find jobs for backward compatibility
export async function fetchUnmatchedFindJobs(userId: string): Promise<FindJob[]> {
  return await getUnmatchedFindJobs(userId);
}

// Function to check if a find job is matched
export async function isJobMatched(jobId: string): Promise<boolean> {
  try {
    // Check if the job exists in match_results collection
    const matchesQuery = query(
      collection(db, "match_results"),
      where("findjob_id", "==", jobId)
    );
    
    const matchesSnapshot = await getDocs(matchesQuery);
    return !matchesSnapshot.empty;
  } catch (error) {
    console.error("Error checking if job is matched:", error);
    return false;
  }
}

// Interface for getting job matches
export interface JobMatch {
  id: string;
  status: string;
  jobId: string;
  matchScore: number;
}

// Function to get job matches for a specific job
export async function getJobMatches(jobId: string): Promise<JobMatch[]> {
  try {
    // Query match_results for the given job ID
    const matchesQuery = query(
      collection(db, "match_results"),
      where("findjob_id", "==", jobId)
    );
    
    const matchesSnapshot = await getDocs(matchesQuery);
    
    if (matchesSnapshot.empty) {
      return [];
    }
    
    const matches: JobMatch[] = [];
    matchesSnapshot.forEach((doc) => {
      const data = doc.data();
      matches.push({
        id: doc.id,
        status: data.status || "pending",
        jobId: jobId,
        matchScore: data.match_score || 0
      });
    });
    
    return matches;
  } catch (error) {
    console.error("Error getting job matches:", error);
    return [];
  }
}
