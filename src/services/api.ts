import { MatchResult } from "@/types/types";
import { mockMatchResults } from "@/data/mocks/matchMocks";
import { saveMatchResults, matchJobWithWorkers, getMatchResultsForJob, updateMatchResultStatus } from "@/services/matchingService";

/**
 * Get AI suggested matches for a job
 * @param jobId The job ID to match
 * @returns Promise with match results
 */
export const getAIMatches = async (jobId: string): Promise<MatchResult[]> => {
  try {
    // Get matches from Firestore
    const matches = await matchJobWithWorkers(jobId);
    
    if (matches && matches.length > 0) {
      return matches;
    }
    
    // Fallback to mock data if no matches found
    return mockMatchResults[jobId] || [];
  } catch (error) {
    console.error("Error getting AI matches:", error);
    // Fallback to mock data on error
    return mockMatchResults[jobId] || [];
  }
};

/**
 * Confirm matches for a job
 * @param jobId The job ID to confirm matches for
 * @returns Promise with success status
 */
export const confirmMatches = async (jobId: string, matchResults?: MatchResult[]): Promise<boolean> => {
  try {
    // If match results are provided, use them
    // Otherwise, fetch matches first
    let matches = matchResults;
    if (!matches) {
      matches = await matchJobWithWorkers(jobId);
    }
    
    // Save matches to Firestore
    return await saveMatchResults(jobId, matches);
  } catch (error) {
    console.error("Error confirming matches:", error);
    return false;
  }
};

/**
 * Accept a job match
 * @param matchId The match ID to accept
 * @returns Promise with success status
 */
export const acceptJobMatch = async (matchId: string): Promise<boolean> => {
  try {
    return await updateMatchResultStatus(matchId, "accepted");
  } catch (error) {
    console.error("Error accepting job match:", error);
    return false;
  }
};

/**
 * Decline a job match
 * @param matchId The match ID to decline
 * @returns Promise with success status
 */
export const declineJobMatch = async (matchId: string): Promise<boolean> => {
  try {
    return await updateMatchResultStatus(matchId, "declined");
  } catch (error) {
    console.error("Error declining job match:", error);
    return false;
  }
};

/**
 * Get match status results for a job
 * @param jobId The job ID to get match status for
 * @returns Promise with status results
 */
export const getJobMatchStatus = async (jobId: string) => {
  try {
    // Get match results from Firestore
    return await getMatchResultsForJob(jobId);
  } catch (error) {
    console.error("Error getting job match status:", error);
    return [];
  }
};
