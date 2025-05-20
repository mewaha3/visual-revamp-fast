
import { MatchResult, StatusResult } from "@/types/types";
import { getJobById, getUserJobs } from "./jobService";
import { getWorkerById, matchedWorkers } from "./workerService";
import { matchJobWithWorkers } from "./matchingService";
// Import findJobs directly to avoid the require statement
import { findJobs } from "@/data/findJobs";

// Store confirmed matches by jobId
const confirmedMatches: Record<string, boolean> = {};

// Function to confirm matches for a job
export const confirmMatches = (jobId: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      confirmedMatches[jobId] = true;
      
      // Once confirmed, save the matches to our matchedWorkers cache
      const matches = matchJobWithWorkers(jobId);
      matches.forEach((match, index) => {
        // Map corresponding worker ID from findJobs based on index+1
        const workerId = `FJ${index + 1}`;
        
        // Find the worker in the findJobs data using ES6 import
        const worker = findJobs.find(w => w.findjob_id === workerId);
        
        if (worker) {
          matchedWorkers[workerId] = {
            name: `${worker.first_name} ${worker.last_name}`,
            gender: worker.gender,
            skills: worker.skills,
            jobType: worker.job_type
          };
        }
      });
      
      resolve({ success: true });
    }, 300);
  });
};

// Function to check if matches are confirmed for a job
export const isMatchesConfirmed = (jobId: string): boolean => {
  return !!confirmedMatches[jobId];
};

export const getMatchingResults = (jobId: string): Promise<{ matches: MatchResult[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches = matchJobWithWorkers(jobId);
      resolve({ matches: matches as unknown as MatchResult[] });
    }, 500);
  });
};

export const getStatusResults = (jobId: string): Promise<{ status: StatusResult[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // If matches aren't confirmed yet, return an empty array
      if (!confirmedMatches[jobId]) {
        resolve({ status: [] });
        return;
      }
      
      // ใช้ผลลัพธ์จากการจับคู่ AI แล้วเพิ่มสถานะ
      const matches = matchJobWithWorkers(jobId);
      
      // กำหนดสถานะจำลอง - แค่ 5 อันดับแรก
      const statusResults = matches.map((match, index) => {
        // Map corresponding worker ID from findJobs based on index+1
        const workerId = `FJ${index + 1}`;
        
        // Assign status based on index
        let status: 'on_queue' | 'accepted' | 'declined' | 'job_done' = 'job_done';
        if (index === 0) {
          status = 'on_queue';
        } else if (index === 1) {
          status = 'accepted';
        } else if (index === 2) {
          status = 'declined';
        }
        
        // Create StatusResult with required properties
        return {
          id: `status_${index}`,
          job_id: jobId,
          findjob_id: workerId,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          workerId,
          name: match.name,
          gender: match.gender,
          jobType: match.jobType,
          date: match.date,
          time: match.time,
          location: match.location,
          salary: `${match.salary} บาท`
        };
      });
      
      resolve({ status: statusResults as StatusResult[] });
    }, 500);
  });
};

// Re-export functions from other services for backward compatibility
export { getJobById, getUserJobs, getWorkerById };
