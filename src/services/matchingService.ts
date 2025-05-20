
import { v4 as uuidv4 } from 'uuid';
import { findJobs } from '@/data/findJobs';
import { postJobs } from '@/data/postJobs';
import { MatchResult } from '@/types/types';
import { mockMatches, calculateMatchScore } from '@/utils/matchingUtils';

const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
};

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
        job_id: job.job_id || '',
        findjob_id: findJobId,
        job_type: job.job_type,
        job_detail: job.job_detail,
        findjob_name: `${findJob.first_name || ''} ${findJob.last_name || ''}`.trim() || findJob.name || 'Unknown',
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
    const formattedMatches = mockMatches.map((match, index) => ({
      id: uuidv4(),
      score: match.aiScore,
      job_id: `job-${index + 1}`,
      findjob_id: findJobId,
      job_type: match.jobType,
      job_detail: `Job description for ${match.jobType}`,
      findjob_name: findJob.name || `${findJob.first_name || ''} ${findJob.last_name || ''}`.trim(),
      findjob_gender: findJob.gender || 'Unknown',
      job_date: match.date,
      day_match: true,
      time_match: true,
      location_match: true,
      province_match: true,
      province: match.location.split(',')[1]?.trim() || 'Unknown',
      // Add additional fields for compatibility
      name: match.name,
      gender: match.gender,
      jobType: match.jobType,
      date: match.date,
      time: match.time,
      location: match.location,
      salary: match.salary.toString(),
    }));

    return simulateApiCall(formattedMatches);
  } catch (error) {
    console.error('Error getting mock matches:', error);
    return simulateApiCall([]);
  }
};
