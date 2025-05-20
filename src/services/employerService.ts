
import { Employer } from "@/types/types";
import { employerDetailsMock } from "@/data/mocks/matchMocks";
import { postJobs } from "@/data/postJobs";
import { v4 as uuidv4 } from "uuid";

// Get employer details for a specific job ID
export const getEmployerDetails = async (jobId: string): Promise<Employer> => {
  try {
    // First check in employerDetailsMock
    const employer = employerDetailsMock.find(emp => emp.id === jobId);
    
    // If found in mock data, return it
    if (employer) {
      return employer;
    }
    
    // If not found, create from postJobs
    const jobData = postJobs.find(job => job.job_id === jobId);
    
    if (!jobData) {
      throw new Error(`Employer details not found for job ID: ${jobId}`);
    }
    
    // Construct employer information from job data
    const newEmployer: Employer = {
      id: jobData.job_id || jobData.id || uuidv4(),
      first_name: jobData.first_name,
      last_name: jobData.last_name,
      name: `${jobData.first_name} ${jobData.last_name}`,
      phone: "099-999-9999", // Mock phone number as it's not in the Job interface
      email: jobData.email,
      rating: 4.5,  // Default rating
      reviews: 25   // Default reviews count
    };
    
    return newEmployer;
  } catch (error) {
    console.error("Error fetching employer details:", error);
    throw error;
  }
};
