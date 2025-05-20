
import { v4 as uuidv4 } from 'uuid';
import { findJobs } from '@/data/findJobs';
import { postJobs } from '@/data/postJobs';
import { MatchResult, FindJob, PostJob } from '@/types/types';

// Helper function to simulate API calls
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
};

// Simple score calculation function for job matching
const calculateMatchScore = (findJob: any, postJob: any): number => {
  let score = 70; // Base score
  
  // Match location (province)
  if (findJob.province === postJob.province) {
    score += 10;
  }
  
  // Match job type
  if (findJob.job_type === postJob.job_type) {
    score += 10;
  }
  
  // Match time preference
  if (findJob.start_time === postJob.start_time && 
      findJob.end_time === postJob.end_time) {
    score += 5;
  }
  
  // Add randomness (±5%)
  score += Math.floor(Math.random() * 11) - 5;
  
  // Ensure score is within bounds
  return Math.min(100, Math.max(0, score));
};

// Mock matches data
const mockMatches: MatchResult[] = [
  {
    id: "match1",
    score: 95,
    job_id: "job1",
    findjob_id: "find1",
    job_type: "housekeeping",
    job_detail: "ทำความสะอาดบ้าน",
    findjob_name: "สมหญิง ใจดี",
    findjob_gender: "Female",
    job_date: "2023-05-20",
    day_match: true,
    time_match: true,
    location_match: true,
    province_match: true,
    province: "กรุงเทพมหานคร",
    name: "สมหญิง ใจดี",
    gender: "Female",
    jobType: "housekeeping",
    date: "2023-05-20",
    time: "09:00 - 17:00",
    location: "วัฒนา, กรุงเทพมหานคร",
    salary: "15000",
  },
  {
    id: "match2",
    score: 88,
    job_id: "job2",
    findjob_id: "find1",
    job_type: "driver",
    job_detail: "คนขับรถ",
    findjob_name: "สมชาย มีรถ",
    findjob_gender: "Male",
    job_date: "2023-05-22",
    day_match: true,
    time_match: false,
    location_match: true,
    province_match: true,
    province: "กรุงเทพมหานคร",
    name: "สมชาย มีรถ",
    gender: "Male",
    jobType: "driver",
    date: "2023-05-22",
    time: "08:00 - 18:00",
    location: "บางรัก, กรุงเทพมหานคร",
    salary: "18000",
  },
];

export const getAIMatches = async (findJobId: string): Promise<MatchResult[]> => {
  try {
    // Find the findJob entry
    const findJob = findJobs.find(job => job.id === findJobId);
    if (!findJob) {
      throw new Error('Find job not found');
    }

    // Map postJobs to match the MatchResult format required for the UI
    const matches: MatchResult[] = postJobs.map(job => {
      // Calculate a match score
      const score = calculateMatchScore(findJob, job);
      
      // Create a match result
      return {
        id: uuidv4(),
        score,
        job_id: job.job_id || job.id || '',
        findjob_id: findJobId,
        job_type: job.job_type,
        job_detail: job.job_detail,
        findjob_name: findJob.name || `${findJob.first_name || ''} ${findJob.last_name || ''}`.trim() || 'Unknown',
        findjob_gender: findJob.gender || 'Unknown',
        job_date: job.job_date,
        day_match: true, // Simplified for demo
        time_match: job.start_time === findJob.start_time && job.end_time === findJob.end_time,
        location_match: job.province === findJob.province,
        province_match: job.province === findJob.province,
        province: job.province,
        // Add additional fields for compatibility with API
        name: `${job.first_name} ${job.last_name}`,
        gender: job.gender,
        jobType: job.job_type,
        date: job.job_date,
        time: `${job.start_time} - ${job.end_time}`,
        location: `${job.district}, ${job.province}`,
        salary: job.salary.toString(),
      };
    });

    // Sort results by score (highest first)
    const sortedMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Return top 10 matches

    return simulateApiCall(sortedMatches);
  } catch (error) {
    console.error('Error getting AI matches:', error);
    return simulateApiCall([]);
  }
};

// Function to create mock matches for demonstration
export const getMockMatches = async (findJobId: string): Promise<MatchResult[]> => {
  try {
    const findJob = findJobs.find(job => job.id === findJobId);
    if (!findJob) {
      throw new Error('Find job not found');
    }
    
    // Convert the mock matches to the correct format with all fields
    const formattedMatches = mockMatches.map((match) => ({
      ...match,
      findjob_id: findJobId,
      findjob_name: findJob.name || `${findJob.first_name || ''} ${findJob.last_name || ''}`.trim() || 'Unknown',
      findjob_gender: findJob.gender || 'Unknown',
    }));

    return simulateApiCall(formattedMatches);
  } catch (error) {
    console.error('Error getting mock matches:', error);
    return simulateApiCall([]);
  }
};
