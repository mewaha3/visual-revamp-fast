
import { JobDetail, Job } from "@/types/types";
import { mockJobDetails } from "@/data/mocks/matchMocks";
import { getJobById } from './jobService';

// Get job details for a specific job ID
export const getJobDetails = async (jobId: string): Promise<JobDetail> => {
  try {
    console.log("Fetching job details for job:", jobId);
    
    // First check if this is a job from postJobs array
    const jobData = getJobById(jobId);
    
    if (!jobData) {
      throw new Error(`Job details not found for job ID: ${jobId}`);
    }
    
    // Convert Job to JobDetail format
    const jobDetail: JobDetail = {
      findjob_id: "", // Not applicable for posted jobs
      job_id: jobData.job_id,
      job_type: jobData.job_type,
      detail: jobData.job_detail,
      job_date: jobData.job_date,
      start_time: jobData.start_time,
      end_time: jobData.end_time,
      province: jobData.province,
      district: jobData.district,
      subdistrict: jobData.subdistrict,
      salary: jobData.salary,
      job_address: jobData.job_address,
    };
    
    console.log("Job details fetched:", jobDetail);
    return jobDetail;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
};
