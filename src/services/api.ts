
import { getUnmatchedFindJobs } from "./findJobService";
import { getJobMatches } from "./matchService";
import type { JobMatch } from "./matchService";
import { FindJob } from "@/types/types";

// Function to get unmatched find jobs for backward compatibility
export async function fetchUnmatchedFindJobs(userId: string): Promise<FindJob[]> {
  return await getUnmatchedFindJobs(userId);
}

// Re-export functions for backward compatibility
export { getJobMatches };
export type { JobMatch };

// Add a mock function for isJobMatched since it's referenced but doesn't exist
export const isJobMatched = async (jobId: string): Promise<boolean> => {
  console.log(`Checking if job ${jobId} is matched`);
  // In a real implementation, this would check if the job is matched
  return Promise.resolve(false);
};
