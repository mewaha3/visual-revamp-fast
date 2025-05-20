
import { JobDetail } from "@/types/types";
import { mockMatches } from "@/data/mocks/matchMocks";
import { postJobs } from "@/data/jobs"; // Import postJobs for direct job lookup

/**
 * Get job details by job ID
 * @param jobId The job ID to fetch details for
 * @returns Promise with job details
 */
export const getJobDetails = async (jobId: string): Promise<JobDetail> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // First, try to find the job in our mock data
        const match = mockMatches.find(match => match.job_id === jobId);
        
        if (match) {
          const jobDetail: JobDetail = {
            id: match.job_id,
            job_id: match.job_id, // Add job_id to fix type errors
            job_type: match.job_type,
            job_detail: match.detail,
            detail: "รายละเอียดงาน: " + match.job_type,
            job_date: match.job_date,
            start_time: match.start_time,
            end_time: match.end_time,
            province: match.province,
            district: match.district,
            subdistrict: match.subdistrict,
            salary: match.salary,
            job_address: `${match.district}, ${match.province}`
          };
          
          resolve(jobDetail);
          return;
        }
        
        // If not found in mock data, look in the postJobs array
        const job = postJobs.find(job => job.job_id === jobId);
        
        if (job) {
          // Create a JobDetail object from the PostJob data
          const jobDetail: JobDetail = {
            id: job.job_id || job.id,
            job_id: job.job_id,
            job_type: job.job_type,
            job_detail: job.job_detail,
            detail: job.job_detail,
            job_date: job.job_date,
            start_time: job.start_time,
            end_time: job.end_time,
            province: job.province,
            district: job.district, 
            subdistrict: job.subdistrict,
            salary: job.salary,
            job_address: job.job_address
          };
          
          resolve(jobDetail);
          return;
        }
        
        // If not found anywhere, reject with error
        reject(new Error("ไม่พบรายละเอียดงาน"));
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};
