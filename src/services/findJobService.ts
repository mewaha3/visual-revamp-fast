
import { findJobs } from "@/data/findJobs";
import { FindJob } from "@/types/types";

// Event to notify components about new find job data
export const findJobsUpdatedEvent = new CustomEvent('findJobsUpdated');

// Get all find jobs from a specific user
export const getUserFindJobs = (email: string | null): FindJob[] => {
  if (!email) return [];
  return findJobs.filter(job => job.email === email);
};

// Add a new find job request
export const addNewFindJob = (jobData: Partial<FindJob>): Promise<FindJob> => {
  return new Promise<FindJob>((resolve, reject) => {
    try {
      // Simulate API call with a small delay
      setTimeout(() => {
        // Generate a new find job ID - in a real app this would be handled by the backend
        const newFindJobId = `FND${findJobs.length + 1}`;
        
        const newJob: FindJob = {
          findjob_id: newFindJobId,
          job_type: jobData.job_type || "",
          skills: jobData.skills || "",
          job_date: jobData.job_date || new Date().toISOString().split('T')[0],
          start_time: jobData.start_time || "00:00",
          end_time: jobData.end_time || "00:00",
          province: jobData.province || "",
          district: jobData.district || "",
          subdistrict: jobData.subdistrict || "",
          start_salary: jobData.start_salary || 0,
          range_salary: jobData.range_salary || 0,
          email: jobData.email || "",
          first_name: jobData.first_name || "",
          last_name: jobData.last_name || "",
          job_address: jobData.job_address || "",
          zip_code: jobData.zip_code || "",
          gender: jobData.gender || "",  // Changed from enum to string type
        };
        
        // Add the new find job to the array - in a real app this would save to a database
        findJobs.unshift(newJob);
        
        // Dispatch event to notify components that find jobs data has changed
        document.dispatchEvent(findJobsUpdatedEvent);
        
        resolve(newJob);
      }, 1000); // Simulate network delay
    } catch (error) {
      reject(error);
    }
  });
};
