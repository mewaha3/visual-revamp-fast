
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getPostJobById } from "./firestoreService";
import { getFindJobById } from "./firestoreService";
import { getUserProfile } from "./firestoreService";
import { MatchResult } from "@/types/types";

/**
 * Match job with workers based on criteria
 * @param jobId 
 * @returns 
 */
export async function matchJobWithWorkers(jobId: string): Promise<MatchResult[]> {
  try {
    console.log("Matching job with workers:", jobId);
    
    // Get job details
    const job = await getPostJobById(jobId);
    if (!job) {
      console.error("Job not found:", jobId);
      return [];
    }
    
    // Query find_jobs collection for matching workers
    const findJobsRef = collection(db, "find_jobs");
    const querySnapshot = await getDocs(findJobsRef);
    
    const matches: MatchResult[] = [];
    
    // For each find job, check if it's a good match
    querySnapshot.forEach((doc) => {
      const findJob = { id: doc.id, ...doc.data() };
      
      // Basic matching criteria
      const jobTypeMatch = findJob.job_type === job.job_type;
      const dateMatch = !findJob.job_date || findJob.job_date === job.job_date;
      const provinceMatch = findJob.province === job.province;
      
      // Calculate match score (simple version)
      let score = 0;
      if (jobTypeMatch) score += 40;
      if (dateMatch) score += 30; 
      if (provinceMatch) score += 30;
      
      // If score is high enough, consider it a match
      if (score > 30) {
        matches.push({
          id: doc.id,
          name: `${findJob.first_name || ''} ${findJob.last_name || ''}`,
          gender: findJob.gender || '',
          jobType: job.job_type,
          date: job.job_date,
          time: `${job.start_time} - ${job.end_time}`,
          location: `${job.province}/${job.district}/${job.subdistrict}`,
          salary: job.salary,
          aiScore: score,
          job_id: jobId,
          findjob_id: findJob.findjob_id || doc.id,
          province: job.province,
          province_match: provinceMatch,
          day_match: dateMatch,
          score: score,
          workerId: findJob.user_id || '',
          // Add additional field for display
          first_name: findJob.first_name || '',
          last_name: findJob.last_name || '',
          email: findJob.email || ''
        });
      }
    });
    
    // Sort by score, highest first
    return matches.sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (error) {
    console.error("Error in matchJobWithWorkers:", error);
    return [];
  }
}

/**
 * Save match results to Firestore
 * @param jobId 
 * @param matchResults 
 * @returns 
 */
export async function saveMatchResults(jobId: string, matchResults: MatchResult[]): Promise<boolean> {
  try {
    if (!matchResults || matchResults.length === 0) {
      console.log("No matches to save");
      return false;
    }
    
    // Get job details to include in match records
    const job = await getPostJobById(jobId);
    if (!job) {
      console.error("Job not found when saving matches:", jobId);
      return false;
    }
    
    // Get job poster details
    const jobPoster = job.user_id ? await getUserProfile(job.user_id) : null;
    
    // For each match, create a record in the match_results collection
    for (let i = 0; i < matchResults.length; i++) {
      const match = matchResults[i];
      
      // Get worker details
      const worker = match.workerId ? await getUserProfile(match.workerId) : null;
      
      // Get find job details
      const findJob = await getFindJobById(match.findjob_id || '');
      
      // Create the match record with enhanced data
      await addDoc(collection(db, "match_results"), {
        job_id: jobId,
        findjob_id: match.findjob_id,
        first_name: match.first_name || findJob?.first_name || "",
        last_name: match.last_name || findJob?.last_name || "",
        gender: match.gender || findJob?.gender || "",
        email: match.email || findJob?.email || "",
        job_type: job.job_type || "",
        job_date: job.job_date || "",
        start_time: job.start_time || "",
        end_time: job.end_time || "",
        job_address: job.job_address || "",
        province: job.province || "",
        district: job.district || "",
        subdistrict: job.subdistrict || "",
        zip_code: job.zip_code || "",
        job_salary: job.salary || 0,
        priority: match.priority || (i + 1), // Use provided priority or default to position in array
        status: "on_queue",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        // Additional fields for first name, last name, gender for both parties
        first_name_post_jobs: jobPoster?.first_name || job.first_name || "",
        last_name_post_jobs: jobPoster?.last_name || job.last_name || "",
        gender_post_jobs: jobPoster?.gender || job.gender || "",
        first_name_find_jobs: worker?.first_name || findJob?.first_name || match.first_name || "",
        last_name_find_jobs: worker?.last_name || findJob?.last_name || match.last_name || "",
        gender_find_jobs: worker?.gender || findJob?.gender || match.gender || ""
      });
    }
    
    console.log(`Saved ${matchResults.length} match results for job ${jobId}`);
    return true;
  } catch (error) {
    console.error("Error saving match results:", error);
    return false;
  }
}

/**
 * Get match results for a job
 * @param jobId 
 * @returns 
 */
export async function getMatchResultsForJob(jobId: string) {
  try {
    const matchResultsRef = collection(db, "match_results");
    const q = query(matchResultsRef, where("job_id", "==", jobId));
    
    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate()?.toISOString() || new Date().toISOString(),
        updated_at: data.updated_at?.toDate()?.toISOString() || new Date().toISOString(),
      });
    });
    
    return results;
  } catch (error) {
    console.error("Error getting match results:", error);
    return [];
  }
}

/**
 * Update match result status
 * @param matchId 
 * @param status 
 * @returns 
 */
export async function updateMatchResultStatus(matchId: string, status: "accepted" | "declined" | "on_queue"): Promise<boolean> {
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
