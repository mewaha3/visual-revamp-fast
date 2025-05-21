
import { postJobs } from "@/data/postJobs";
import { PostJob, Job } from "@/types/types";
import { addPostJob, getUserPostJobs as getFirestoreUserPostJobs } from "./firestoreService";

// Get a job by ID from mock data (for compatibility with existing code)
export const getJobById = (jobId: string) => {
  return postJobs.find(job => job.job_id === jobId) || null;
};

// Get all jobs from a specific user from mock data (for compatibility)
export const getUserJobs = (email: string | null): Job[] => {
  if (!email) return [];
  return postJobs.filter(job => job.email === email) as Job[];
};

// Get all jobs from a specific user from Firestore
export const getUserPostJobs = async (userId: string): Promise<PostJob[]> => {
  if (!userId) return [];
  try {
    return await getFirestoreUserPostJobs(userId);
  } catch (error) {
    console.error("Error in getUserPostJobs:", error);
    return [];
  }
};

// Add a new job post
export const addNewJob = async (jobData: Partial<PostJob>, userId?: string): Promise<PostJob> => {
  try {
    // Create a new job object
    const newJob: PostJob = {
      job_type: jobData.job_type || "",
      job_detail: jobData.job_detail || "",
      job_date: jobData.job_date || new Date().toISOString().split('T')[0],
      start_time: jobData.start_time || "00:00",
      end_time: jobData.end_time || "00:00",
      job_address: jobData.job_address || "",
      salary: jobData.salary || 0,
      email: jobData.email || "",
      first_name: jobData.first_name || "",
      last_name: jobData.last_name || "",
      gender: jobData.gender || "",
      province: jobData.province || "",
      district: jobData.district || "",
      subdistrict: jobData.subdistrict || "",
      zip_code: jobData.zip_code || "",
    };
    
    // Add to Firestore and get the job_id
    const jobId = await addPostJob(newJob, userId);
    newJob.job_id = jobId;
    
    // Also add to local array for immediate use
    postJobs.unshift(newJob as any);
    
    return newJob;
  } catch (error) {
    console.error("Error in addNewJob:", error);
    throw error;
  }
};
