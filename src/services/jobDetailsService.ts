
import { JobDetail } from "@/types/types";
import { mockJobDetails } from "@/data/mocks/matchMocks";
import { getPostJobById } from "./firestoreService";

/**
 * Get job details by job ID
 * @param jobId The job ID to fetch details for
 * @returns Promise with job details
 */
export const getJobDetails = async (jobId: string): Promise<JobDetail> => {
  try {
    console.log("Getting job details for:", jobId);
    
    // First try to get job from Firestore
    const firestoreJob = await getPostJobById(jobId);
    if (firestoreJob) {
      console.log("Found job in Firestore:", firestoreJob);
      
      // Create a JobDetail object from the Firestore data
      const jobDetail: JobDetail = {
        id: firestoreJob.id || jobId,
        job_id: firestoreJob.job_id || jobId,
        job_type: firestoreJob.job_type || '',
        job_detail: firestoreJob.job_detail || '',
        detail: firestoreJob.job_detail || '',
        job_date: firestoreJob.job_date || '',
        start_time: firestoreJob.start_time || '',
        end_time: firestoreJob.end_time || '',
        province: firestoreJob.province || '',
        district: firestoreJob.district || '', 
        subdistrict: firestoreJob.subdistrict || '',
        salary: firestoreJob.salary || 0,
        job_address: firestoreJob.job_address || '',
        phone: firestoreJob.phone || '', // Make sure to include the phone field
      };
      
      return jobDetail;
    }
    
    // If not found in Firestore, try mock data (fallback)
    if (mockJobDetails && mockJobDetails[jobId]) {
      console.log("Found job in mock data:", mockJobDetails[jobId]);
      return mockJobDetails[jobId];
    }
    
    throw new Error("ไม่พบรายละเอียดงาน");
  } catch (error) {
    console.error("Error getting job details:", error);
    throw error;
  }
};
