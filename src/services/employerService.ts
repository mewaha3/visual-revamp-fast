
import { Employer } from "@/types/types";
import { mockEmployers } from "@/data/mocks/matchMocks";
import { getPostJobById } from "./firestoreService";
import { getJobById } from './jobService';

// Get employer details for a specific job ID
export const getEmployerDetails = async (jobId: string): Promise<Employer> => {
  try {
    // First try to get from Firestore
    const firestoreJob = await getPostJobById(jobId);
    
    if (firestoreJob) {
      // Construct employer information from Firestore job data
      const employer: Employer = {
        id: jobId,
        first_name: firestoreJob.first_name || "",
        last_name: firestoreJob.last_name || "",
        name: `${firestoreJob.first_name || ""} ${firestoreJob.last_name || ""}`.trim() || "ไม่ระบุชื่อ",
        email: firestoreJob.email || "",
        phone: firestoreJob.phone || "", // Add phone from Firestore
      };
      
      return employer;
    }
    
    // If not in Firestore, try mock data
    const jobData = getJobById(jobId);
    
    if (!jobData) {
      throw new Error(`Employer details not found for job ID: ${jobId}`);
    }
    
    // Construct employer information from job data
    const employer: Employer = {
      id: jobData.job_id || jobData.id, // Use job_id or id as employer id
      first_name: jobData.first_name || "",
      last_name: jobData.last_name || "",
      name: `${jobData.first_name || ""} ${jobData.last_name || ""}`.trim() || "ไม่ระบุชื่อ",
      email: jobData.email || "",
      phone: jobData.phone || "", // Add phone from job data
    };
    
    return employer;
  } catch (error) {
    console.error("Error fetching employer details:", error);
    throw error;
  }
};
