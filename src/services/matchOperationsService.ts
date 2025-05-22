
import { FindMatch, MatchResult } from "@/types/types";
import { mockMatches } from "@/data/mocks/matchMocks";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";

// Fetch user's job matches
export const getUserMatches = async (userEmail: string): Promise<FindMatch[]> => {
  // In a real implementation, you would fetch from an API with userEmail as parameter
  console.log(`Fetching matches for user: ${userEmail}`);
  
  try {
    // Try to fetch from Firestore
    const matchesRef = collection(db, "match_results");
    const q = query(matchesRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    
    const matches: FindMatch[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      matches.push({
        id: doc.id,
        findjob_id: data.findjob_id,
        job_id: data.job_id,
        name: userEmail,
        job_type: data.job_type,
        detail: data.job_detail || "",
        job_date: data.job_date,
        start_time: data.start_time,
        end_time: data.end_time,
        province: data.province,
        district: data.district,
        subdistrict: data.subdistrict,
        salary: data.job_salary
      });
    });
    
    if (matches.length > 0) {
      return matches;
    }
    
    // If no matches found in Firestore, use mock data as fallback
    return mockMatches.filter(match => match.name === userEmail);
  } catch (error) {
    console.error("Error fetching user matches:", error);
    // Use mock data as fallback
    return mockMatches.filter(match => match.name === userEmail);
  }
};

// Accept a job match
export const acceptJobMatch = async (matchId: string): Promise<void> => {
  console.log(`Accepting job match: ${matchId}`);
  
  try {
    // Update the match status in Firestore
    const matchRef = doc(db, "match_results", matchId);
    await updateDoc(matchRef, {
      status: "accepted",
      updated_at: serverTimestamp()
    });
    
    // Get the match details to update the corresponding job
    const matchSnapshot = await getDoc(matchRef);
    if (matchSnapshot.exists()) {
      const matchData = matchSnapshot.data();
      
      // Optionally update the job status
      if (matchData.job_id) {
        try {
          // Get the job reference by job_id
          const jobsRef = collection(db, "post_jobs");
          const q = query(jobsRef, where("job_id", "==", matchData.job_id));
          const jobSnapshot = await getDocs(q);
          
          if (!jobSnapshot.empty) {
            const jobDoc = jobSnapshot.docs[0];
            await updateDoc(doc(db, "post_jobs", jobDoc.id), {
              status: "matched",
              matched_worker_id: matchData.workerId,
              updated_at: serverTimestamp()
            });
          }
        } catch (jobError) {
          console.error("Error updating job status:", jobError);
        }
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error accepting match:", error);
    return Promise.reject(error);
  }
};

// Decline a job match
export const declineJobMatch = async (matchId: string): Promise<void> => {
  console.log(`Declining job match: ${matchId}`);
  
  try {
    // Update the match status in Firestore
    const matchRef = doc(db, "match_results", matchId);
    await updateDoc(matchRef, {
      status: "declined",
      updated_at: serverTimestamp()
    });
    
    // Get the match details to update the queue
    const matchSnapshot = await getDoc(matchRef);
    if (matchSnapshot.exists()) {
      const matchData = matchSnapshot.data();
      
      // Find the next match in queue for the same job
      if (matchData.job_id) {
        try {
          const matchesRef = collection(db, "match_results");
          const q = query(
            matchesRef, 
            where("job_id", "==", matchData.job_id),
            where("status", "==", "on_queue")
          );
          const matchesSnapshot = await getDocs(q);
          
          // Optionally, you could automatically move the next person in queue to "active" status
        } catch (queueError) {
          console.error("Error processing match queue:", queueError);
        }
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error declining match:", error);
    return Promise.reject(error);
  }
};

// Get all matches for a specific job
export const getMatchesForJob = async (jobId: string): Promise<MatchResult[]> => {
  try {
    const matchesRef = collection(db, "match_results");
    const q = query(matchesRef, where("job_id", "==", jobId));
    const querySnapshot = await getDocs(q);
    
    const matches: MatchResult[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      matches.push({
        id: doc.id,
        job_id: data.job_id,
        findjob_id: data.findjob_id,
        name: `${data.first_name} ${data.last_name}`,
        gender: data.gender,
        jobType: data.job_type,
        date: data.job_date,
        time: `${data.start_time} - ${data.end_time}`,
        start_time: data.start_time,
        end_time: data.end_time,
        location: `${data.province}/${data.district}/${data.subdistrict}`,
        salary: data.job_salary,
        status: data.status,
        priority: data.priority,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        workerId: data.workerId
      });
    });
    
    // Sort by priority
    matches.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    
    return matches;
  } catch (error) {
    console.error("Error getting matches for job:", error);
    return [];
  }
};

// Create a new match directly
export const createJobMatch = async (matchData: Partial<MatchResult>): Promise<string> => {
  try {
    const result = await addDoc(collection(db, "match_results"), {
      ...matchData,
      status: matchData.status || "on_queue",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    console.log("Created new match with ID:", result.id);
    return result.id;
  } catch (error) {
    console.error("Error creating job match:", error);
    throw error;
  }
};
