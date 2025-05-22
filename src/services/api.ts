
import { getUnmatchedFindJobs } from "./findJobService";
import { isJobMatched, getJobMatches } from "./matchService";
import type { JobMatch } from "./matchService";
import { FindJob } from "@/types/types";

// Function to get unmatched find jobs for backward compatibility
export async function fetchUnmatchedFindJobs(userId: string): Promise<FindJob[]> {
  return await getUnmatchedFindJobs(userId);
}

// Re-export functions for backward compatibility
export { isJobMatched, getJobMatches };
export type { JobMatch };
