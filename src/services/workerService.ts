
import { findJobs } from "@/data/findJobs";

// Store matched worker data for reference
const matchedWorkers: Record<string, any> = {};

// Function to get worker by ID
export const getWorkerById = (workerId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find worker in matchedWorkers data based on workerId
      if (matchedWorkers[workerId]) {
        resolve(matchedWorkers[workerId]);
        return;
      }
      
      // If not found in our cache, find worker in findJobs data based on workerId
      const worker = findJobs.find(w => w.findjob_id === workerId);
      
      if (worker) {
        const workerData = {
          name: `${worker.first_name} ${worker.last_name}`,
          gender: worker.gender,
          skills: worker.skills,
          jobType: worker.job_type
        };
        
        // Cache the worker data for future reference
        matchedWorkers[workerId] = workerData;
        resolve(workerData);
      } else {
        // Mock data if worker not found (fallback)
        resolve({
          name: "สมชาย ใจดี",
          gender: "Male",
          skills: "ทำความสะอาด, ซักผ้า",
          jobType: "แม่บ้าน"
        });
      }
    }, 300);
  });
};

// Export the matchedWorkers for use in other services
export { matchedWorkers };
