
import { postJobs } from "@/data/postJobs";
import { Job } from "@/types/types";

export const getJobById = (jobId: string): Job | null => {
  return postJobs.find(job => job.job_id === jobId) || null;
};

export const getUserJobs = (email: string | null): Job[] => {
  if (!email) return [];
  return postJobs.filter(job => job.email === email);
};
