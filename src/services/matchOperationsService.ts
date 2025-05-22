
import { FindMatch, MatchResult } from "@/types/types";
import { mockMatches } from "@/data/mocks/matchMocks";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";

// Fetch user's job matches
export const getUserMatches = async (userEmail: string): Promise<FindMatch[]> => {
  // In a real implementation, you would fetch from an API with userEmail as parameter
  console.log(`Fetching matches for user: ${userEmail}`);
  
  // Filter matches for the current user only
  // Using the name field which contains the email
  const userMatches = mockMatches.filter(match => match.name === userEmail);
  
  return Promise.resolve(userMatches);
};

// Accept a job match
export const acceptJobMatch = async (matchId: string): Promise<void> => {
  console.log(`Accepting job match: ${matchId}`);
  
  try {
    // In a real implementation, you would update the match status in Firestore
    const matchRef = doc(db, "match_results", matchId);
    await updateDoc(matchRef, {
      status: "accepted"
    });
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
    // In a real implementation, you would update the match status in Firestore
    const matchRef = doc(db, "match_results", matchId);
    await updateDoc(matchRef, {
      status: "declined"
    });
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
