
import { postJobs } from "@/data/postJobs";
import { Job } from "@/types/types";

// Get a job by ID
export const getJobById = (jobId: string): Job | null => {
  return postJobs.find(job => job.job_id === jobId) || null;
};

// Get all jobs from a specific user
export const getUserJobs = (email: string | null): Job[] => {
  if (!email) return [];
  return postJobs.filter(job => job.email === email);
};

// Add a new job post
export const addNewJob = (jobData: Partial<Job>): Job => {
  // Generate a new job ID - in a real app this would be handled by the backend
  const newJobId = `PJ${postJobs.length + 1}`;
  
  const newJob: Job = {
    job_id: newJobId,
    job_type: jobData.job_type || "ไม่ระบุ",
    job_detail: jobData.job_detail || "",
    job_date: jobData.job_date || new Date().toISOString().split('T')[0],
    start_time: jobData.start_time || "00:00",
    end_time: jobData.end_time || "00:00",
    job_address: jobData.job_address || "",
    salary: jobData.salary || 0,
    email: jobData.email || "",
    first_name: jobData.first_name || "",
    last_name: jobData.last_name || "",
    gender: jobData.gender,
    province: jobData.province,
    district: jobData.district,
    subdistrict: jobData.subdistrict,
    zip_code: jobData.zip_code,
  };
  
  // Add the new job to the array - in a real app this would save to a database
  postJobs.unshift(newJob);
  
  return newJob;
};
