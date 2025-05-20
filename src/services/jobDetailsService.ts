
import { JobDetail } from "@/types/types";
import { mockMatches } from "@/data/mocks/matchMocks";

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
        // Find the job in our mock data
        const match = mockMatches.find(match => match.job_id === jobId);
        
        if (match) {
          const jobDetail: JobDetail = {
            findjob_id: match.findjob_id,
            job_id: match.job_id,
            name: match.name,  // Make sure this exists in the mock data
            job_type: match.job_type,
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
        } else {
          reject(new Error("ไม่พบรายละเอียดงาน"));
        }
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};
