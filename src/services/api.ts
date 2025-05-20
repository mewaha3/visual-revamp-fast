
import { v4 as uuidv4 } from 'uuid';
import { FindJob, Job, JobDetail, PostJob, MatchResult, StatusResult, Employer } from '@/types/types';
import { findJobs } from '@/data/findJobs';
import { postJobs } from '@/data/postJobs';
import { driverJobs, housekeepingJobs, serviceJobs, teachingJobs } from '@/data/jobs';
import { jobDetailsMock, employerDetailsMock } from '@/data/mocks/matchMocks';

// Helper function to simulate async API calls
const simulateApiCall = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

// API functions for jobs
export const getJobs = (): Promise<Job[]> => {
  // Add job_id to each job that doesn't have one yet (backwards compatibility)
  const allJobs = [...driverJobs, ...housekeepingJobs, ...serviceJobs, ...teachingJobs];
  const jobsWithIds = allJobs.map(job => ({
    ...job,
    id: job.job_id || uuidv4() // Use existing job_id or generate a new id
  }));
  return simulateApiCall(jobsWithIds);
};

export const getPostJobs = (): Promise<PostJob[]> => {
  // Add ids to PostJobs to fix TypeScript errors
  const jobsWithIds = postJobs.map(job => ({
    ...job,
    id: job.job_id || uuidv4() // Use existing job_id as id or generate a new id
  }));
  return simulateApiCall(jobsWithIds);
};

export const getFindJobs = (): Promise<FindJob[]> => {
  return simulateApiCall(findJobs);
};

export const getJobById = (jobId: string): Promise<Job | undefined> => {
  const allJobs = [...driverJobs, ...housekeepingJobs, ...serviceJobs, ...teachingJobs];
  const job = allJobs.find(job => job.job_id === jobId);
  return simulateApiCall(job);
};

export const getPostJobById = (jobId: string): Promise<PostJob | undefined> => {
  const job = postJobs.find(job => job.job_id === jobId);
  // Add id to job to fix TypeScript errors
  const jobWithId = job ? { ...job, id: job.job_id || uuidv4() } : undefined;
  return simulateApiCall(jobWithId);
};

export const getFindJobById = (findJobId: string): Promise<FindJob | undefined> => {
  const findJob = findJobs.find(job => job.id === findJobId);
  return simulateApiCall(findJob);
};

export const getJobDetailById = (jobId: string): Promise<JobDetail | undefined> => {
  // First look in jobDetailsMock
  const jobDetail = jobDetailsMock.find(job => job.job_id === jobId);
  
  // If not found in mock data, try to create from postJobs
  if (!jobDetail) {
    const postJob = postJobs.find(job => job.job_id === jobId);
    if (postJob) {
      return simulateApiCall({
        id: uuidv4(),
        job_id: postJob.job_id,
        job_type: postJob.job_type,
        job_detail: postJob.job_detail,
        job_date: postJob.job_date,
        start_time: postJob.start_time,
        end_time: postJob.end_time,
        job_address: postJob.job_address,
        salary: postJob.salary,
        province: postJob.province,
        district: postJob.district,
        subdistrict: postJob.subdistrict,
        // Add a name field for compatibility
        name: `${postJob.first_name} ${postJob.last_name}`
      });
    }
  }
  
  return simulateApiCall(jobDetail);
};

export const getEmployerById = (jobId: string): Promise<Employer | undefined> => {
  // First check in employerDetailsMock
  const employer = employerDetailsMock.find(emp => emp.id === jobId);
  
  // If not found, create from postJobs
  if (!employer) {
    const postJob = postJobs.find(job => job.job_id === jobId);
    if (postJob) {
      return simulateApiCall({
        id: jobId || uuidv4(),
        first_name: postJob.first_name,
        last_name: postJob.last_name,
        email: postJob.email,
        // Optional fields
        name: `${postJob.first_name} ${postJob.last_name}`,
        phone: "099-999-9999", // Default phone
        rating: 4.5,  // Default rating
        reviews: 25   // Default reviews count
      });
    }
  }
  
  return simulateApiCall(employer);
};

// Mock API for job matching
export const getJobMatches = (findJobId: string): Promise<MatchResult[]> => {
  const matches = Array(6).fill(null).map((_, index) => ({
    id: uuidv4(),
    score: Math.floor(Math.random() * 20) + 80, // Random score between 80-99
    job_id: `job-${index + 1}`,
    findjob_id: findJobId,
    job_type: ['housekeeping', 'cooking', 'eldercare', 'driver', 'gardening', 'cleaning'][Math.floor(Math.random() * 6)],
    job_detail: `Job description ${index + 1}`,
    findjob_name: `Candidate ${index + 1}`,
    findjob_gender: index % 2 === 0 ? 'Male' : 'Female',
    job_date: '2023-05-30',
    day_match: Math.random() > 0.3,
    time_match: Math.random() > 0.3,
    location_match: Math.random() > 0.3,
    province_match: Math.random() > 0.3,
    province: 'Bangkok',
    // Add these properties for compatibility
    name: `Candidate ${index + 1}`,
    gender: index % 2 === 0 ? 'Male' : 'Female',
    jobType: ['housekeeping', 'cooking', 'eldercare', 'driver', 'gardening', 'cleaning'][Math.floor(Math.random() * 6)],
    date: '2023-05-30',
    time: '09:00 - 17:00',
    location: 'Bangkok',
    salary: `${15000 + (index * 1000)}`,
  }));
  return simulateApiCall(matches);
};

// Match status API
export const getMatchStatus = (jobId: string): Promise<StatusResult[]> => {
  const mockStatus: StatusResult[] = Array(3).fill(null).map((_, index) => ({
    id: uuidv4(),
    job_id: jobId,
    findjob_id: `findjob-${index + 1}`,
    status: ['pending', 'accepted', 'rejected'][index],
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
  return simulateApiCall(mockStatus);
};

// Create Mocks
export const createFindJob = (job: Omit<FindJob, 'id'>): Promise<FindJob> => {
  const newJob = {
    ...job,
    id: uuidv4(),
  };
  findJobs.push(newJob);
  return simulateApiCall(newJob);
};

export const createPostJob = (job: Omit<PostJob, 'id' | 'job_id'>): Promise<PostJob> => {
  const job_id = uuidv4();
  const newJob = {
    ...job,
    id: job_id,  // Use same value for both id and job_id
    job_id
  };
  postJobs.push(newJob);
  return simulateApiCall(newJob);
};

export const updateFindJob = (job: FindJob): Promise<FindJob> => {
  const index = findJobs.findIndex(j => j.id === job.id);
  if (index !== -1) {
    findJobs[index] = job;
  }
  return simulateApiCall(job);
};
