
import { collection, getDocs, query, where, serverTimestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MatchResult } from "@/types/types";

// Interface for match results
export interface JobMatch {
  id: string;
  status: string;
  jobId: string;
  matchScore: number;
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
