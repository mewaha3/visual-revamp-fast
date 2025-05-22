
import { getUnmatchedFindJobs } from "./findJobService";
import { getJobMatches } from "./matchService";
import { getMatchesForJob } from "./matchOperationsService"; // Add this import
import type { JobMatch } from "./matchService";
import { FindJob } from "@/types/types";

// Function to get unmatched find jobs for backward compatibility
export async function fetchUnmatchedFindJobs(userId: string): Promise<FindJob[]> {
  return await getUnmatchedFindJobs(userId);
}

// Re-export functions for backward compatibility
export { getJobMatches, getMatchesForJob };
export type { JobMatch };

// Add a mock function for isJobMatched since it's referenced but doesn't exist
export const isJobMatched = async (jobId: string): Promise<boolean> => {
  // Check if the job has at least one accepted match
  try {
    const matches = await getMatchesForJob(jobId);
    return matches.some(match => match.status === "accepted");
  } catch (error) {
    console.error(`Error checking if job ${jobId} is matched:`, error);
    return false;
  }
};
