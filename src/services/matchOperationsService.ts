
import { FindMatch } from "@/types/types";
import { mockMatches } from "@/data/mocks/matchMocks";

// Fetch user's job matches
export const getUserMatches = async (userEmail: string): Promise<FindMatch[]> => {
  // In a real implementation, you would fetch from an API with userEmail as parameter
  console.log(`Fetching matches for user: ${userEmail}`);
  
  // Filter matches for the current user only
  // Using the name field which contains the email
  const userMatches = mockMatches.filter(match => match.name === userEmail);
  
  return Promise.resolve(userMatches);
};

// Accept a job match
export const acceptJobMatch = async (findjobId: string): Promise<void> => {
  // In a real implementation, you would call an API
  console.log(`Accepting job match: ${findjobId}`);
  return Promise.resolve();
};

// Decline a job match
export const declineJobMatch = async (findjobId: string): Promise<void> => {
  // In a real implementation, you would call an API
  console.log(`Declining job match: ${findjobId}`);
  return Promise.resolve();
};
