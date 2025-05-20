
import { Employer } from "@/types/types";
import { mockEmployers } from "@/data/mocks/matchMocks";
import { getJobById } from './jobService';

// Get employer details for a specific job ID
export const getEmployerDetails = async (jobId: string): Promise<Employer> => {
  try {
    // Get the job data first to access employer info
    const jobData = getJobById(jobId);
    
    if (!jobData) {
      throw new Error(`Employer details not found for job ID: ${jobId}`);
    }
    
    // Construct employer information from job data
    const employer: Employer = {
      name: `${jobData.first_name} ${jobData.last_name}`,
      phone: "099-999-9999", // Mock phone number as it's not in the Job interface
      email: jobData.email,
    };
    
    return employer;
  } catch (error) {
    console.error("Error fetching employer details:", error);
    throw error;
  }
};
