import { collection, getDocs, query, where, addDoc, serverTimestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MatchResult, MatchResultFirestore, FindJob, StatusResult } from "@/types/types";
import { 
  calculateStringSimilarity, 
  calculateLocationSimilarity, 
  calculateTimeOverlap, 
  calculateDateMatch, 
  calculateSalaryMatch 
} from '@/utils/matchingUtils';
import { getPostJobById, getFindJobById } from './firestoreService';

// Function to calculate matching score between job and worker
export const calculateMatchingScore = (job: any, worker: any): number => {
  // Weights for each criterion
  const weights = {
    jobType: 0.2,    // Same job type
    skills: 0.2,     // Matching skills
    location: 0.2,   // Location proximity
    time: 0.1,       // Working time overlap
    date: 0.1,       // Working date match
    salary: 0.2      // Salary compatibility
  };
  
  // Calculate scores for each aspect
  const jobTypeScore = job.job_type.toLowerCase() === worker.job_type.toLowerCase() ? 1.0 : 0.0;
  
  // Skills similarity score
  let skillsScore = 0;
  if (job.job_detail && worker.skills) {
    skillsScore = calculateStringSimilarity(job.job_detail, worker.skills);
  }
  
  // Location score
  const locationScore = calculateLocationSimilarity(
    job.province, job.district, job.subdistrict,
    worker.province, worker.district, worker.subdistrict
  );
  
  // Working time score
  const timeScore = calculateTimeOverlap(job.start_time, job.end_time, worker.start_time, worker.end_time);
  
  // Working date score
  const dateScore = calculateDateMatch(job.job_date, worker.job_date);
  
  // Salary score
  const salaryScore = calculateSalaryMatch(job.salary, worker.start_salary, worker.range_salary);
  
  // Calculate final score
  const finalScore = 
    weights.jobType * jobTypeScore +
    weights.skills * skillsScore +
    weights.location * locationScore +
    weights.time * timeScore +
    weights.date * dateScore +
    weights.salary * salaryScore;
  
  return finalScore;
};

// Function to match jobs with workers from Firestore
export const matchJobWithWorkers = async (jobId: string): Promise<MatchResult[]> => {
  try {
    // Get job from Firestore by ID
    const job = await getPostJobById(jobId);
    if (!job) {
      console.error("Job not found with ID:", jobId);
      return [];
    }
    
    console.log("Found job:", job);
    
    // Get all workers (find_jobs) from Firestore
    const findJobsRef = collection(db, "find_jobs");
    const findJobsSnapshot = await getDocs(findJobsRef);
    
    if (findJobsSnapshot.empty) {
      console.log("No find_jobs documents found");
      return [];
    }
    
    const findJobs: FindJob[] = [];
    findJobsSnapshot.forEach((doc) => {
      findJobs.push({
        id: doc.id,
        ...doc.data()
      } as FindJob);
    });
    
    console.log("Found find_jobs:", findJobs.length);
    
    // Calculate scores for each worker
    const matchResults: MatchResult[] = findJobs.map((worker, index) => {
      const score = calculateMatchingScore(job, worker);
      
      // Create full name from first_name and last_name
      const fullName = `${worker.first_name || ''} ${worker.last_name || ''}`.trim() || 'ไม่ระบุชื่อ';
      
      return {
        id: worker.id,
        name: fullName,
        gender: worker.gender || 'ไม่ระบุ',
        jobType: worker.job_type || 'ไม่ระบุ',
        job_type: worker.job_type || 'ไม่ระบุ',
        date: worker.job_date || 'ไม่ระบุ',
        time: `${worker.start_time || '00:00'} - ${worker.end_time || '00:00'}`,
        location: `${worker.province || ''}/${worker.district || ''}/${worker.subdistrict || ''}`,
        salary: worker.start_salary || 0,
        aiScore: score,
        workerId: worker.findjob_id || worker.id, // Use findjob_id if available, otherwise use doc ID
        findjob_id: worker.findjob_id || worker.id,
        job_id: jobId,
        first_name: worker.first_name || '',
        last_name: worker.last_name || '',
        email: worker.email || '',
        priority: index + 1 // Default priority based on index (1-5)
      };
    });
    
    console.log("Calculated match results:", matchResults);
    
    // Sort by score (highest to lowest) and limit to top 5
    return matchResults
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
      .slice(0, 5);
  } catch (error) {
    console.error("Error in matchJobWithWorkers:", error);
    return [];
  }
};

// Function to save match results to Firestore
export const saveMatchResults = async (jobId: string, matchResults: MatchResult[]): Promise<boolean> => {
  try {
    // Get job details to include salary
    const job = await getPostJobById(jobId);
    if (!job) {
      console.error("Job not found for saving match results:", jobId);
      return false;
    }
    
    // Delete any existing match results for this job
    // For simplicity, we're just adding new ones without checking for duplicates
    
    // Create match_results collection if it doesn't exist
    const matchResultsRef = collection(db, "match_results");
    
    // Save each match result to Firestore
    for (const match of matchResults) {
      // Create the match result object with all required fields
      const matchResult: MatchResultFirestore = {
        first_name: match.first_name || '',
        last_name: match.last_name || '',
        gender: match.gender || '',
        email: match.email || '',
        job_type: match.job_type || '',
        job_date: job.job_date || '',
        start_time: job.start_time || '',
        end_time: job.end_time || '',
        job_address: job.job_address || '',
        province: job.province || '',
        district: job.district || '',
        subdistrict: job.subdistrict || '',
        zip_code: job.zip_code || '',
        priority: match.priority || 99, // Use provided priority or default to 99
        status: "on_queue", // Default status
        findjob_id: match.findjob_id || '',
        job_id: jobId,
        job_salary: job.salary || 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      
      await addDoc(matchResultsRef, matchResult);
    }
    
    console.log(`Saved ${matchResults.length} match results to Firestore for job ${jobId}`);
    return true;
  } catch (error) {
    console.error("Error saving match results:", error);
    return false;
  }
};

// Function to get match results for a specific job
export const getMatchResultsForJob = async (jobId: string): Promise<StatusResult[]> => {
  try {
    const matchResultsRef = collection(db, "match_results");
    const q = query(matchResultsRef, where("job_id", "==", jobId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No match results found for job ${jobId}`);
      return [];
    }
    
    const results: StatusResult[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as MatchResultFirestore;
      results.push({
        id: doc.id,
        job_id: data.job_id,
        findjob_id: data.findjob_id,
        status: data.status,
        created_at: data.created_at?.toDate()?.toISOString() || new Date().toISOString(),
        updated_at: data.updated_at?.toDate()?.toISOString() || new Date().toISOString(),
        name: `${data.first_name} ${data.last_name}`,
        gender: data.gender,
        jobType: data.job_type,
        date: data.job_date,
        time: `${data.start_time} - ${data.end_time}`,
        location: `${data.province}/${data.district}/${data.subdistrict}`,
        salary: data.job_salary,
        workerId: data.findjob_id,
        priority: data.priority,
        first_name: data.first_name,
        last_name: data.last_name
      });
    });
    
    // Sort by priority
    return results.sort((a, b) => (a.priority || 99) - (b.priority || 99));
  } catch (error) {
    console.error("Error getting match results:", error);
    return [];
  }
};

// Function to get match results for a specific worker
export const getMatchResultsForWorker = async (findJobId: string): Promise<StatusResult[]> => {
  try {
    const matchResultsRef = collection(db, "match_results");
    const q = query(matchResultsRef, where("findjob_id", "==", findJobId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No match results found for worker ${findJobId}`);
      return [];
    }
    
    const results: StatusResult[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as MatchResultFirestore;
      results.push({
        id: doc.id,
        job_id: data.job_id,
        findjob_id: data.findjob_id,
        status: data.status,
        created_at: data.created_at?.toDate()?.toISOString() || new Date().toISOString(),
        updated_at: data.updated_at?.toDate()?.toISOString() || new Date().toISOString(),
        name: `${data.first_name} ${data.last_name}`,
        gender: data.gender,
        jobType: data.job_type,
        date: data.job_date,
        time: `${data.start_time} - ${data.end_time}`,
        location: `${data.province}/${data.district}/${data.subdistrict}`,
        salary: data.job_salary,
        workerId: data.findjob_id,
        priority: data.priority
      });
    });
    
    return results;
  } catch (error) {
    console.error("Error getting worker match results:", error);
    return [];
  }
};

// Function to update match result status
export const updateMatchResultStatus = async (matchId: string, status: "on_queue" | "accepted" | "declined"): Promise<boolean> => {
  try {
    const docRef = doc(db, "match_results", matchId);
    await updateDoc(docRef, { 
      status,
      updated_at: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating match result status:", error);
    return false;
  }
};

// Function to update match priorities
export const updateMatchPriorities = async (matchPriorities: {id: string, priority: number}[]): Promise<boolean> => {
  try {
    // Create a batch to update multiple documents at once
    const batch = require('firebase/firestore').writeBatch(db);
    
    for (const {id, priority} of matchPriorities) {
      const docRef = doc(db, "match_results", id);
      batch.update(docRef, { 
        priority,
        updated_at: serverTimestamp()
      });
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error updating match priorities:", error);
    return false;
  }
};
