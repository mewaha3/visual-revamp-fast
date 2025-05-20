
import { v4 as uuidv4 } from 'uuid';
import { StatusResult } from '@/types/types';

// Generate dummy data for user matches
export const getUserMatches = async (userId: string): Promise<StatusResult[]> => {
  // In a real app, this would be an API call to get match data for this user
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some dummy match data
      const matches: StatusResult[] = Array(3).fill(0).map((_, index) => ({
        id: uuidv4(),
        job_id: `job-${index + 1}`,
        findjob_id: userId,
        status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)], 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: `Worker ${index + 1}`,
        gender: index % 2 === 0 ? 'Male' : 'Female',
        jobType: ['housekeeping', 'cooking', 'eldercare'][Math.floor(Math.random() * 3)],
        date: '2023-06-15',
        time: '09:00 - 17:00',
        location: 'Bangkok',
        salary: `${15000 + (index * 1000)}`,
        workerId: `worker-${index + 1}`,
      }));
      
      resolve(matches);
    }, 1000);
  });
};

// Accept a job match
export const acceptJobMatch = async (matchId: string): Promise<boolean> => {
  // In a real app, this would send an API request to accept the match
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Match ${matchId} accepted`);
      resolve(true);
    }, 500);
  });
};

// Decline a job match
export const declineJobMatch = async (matchId: string): Promise<boolean> => {
  // In a real app, this would send an API request to decline the match
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Match ${matchId} declined`);
      resolve(true);
    }, 500);
  });
};
