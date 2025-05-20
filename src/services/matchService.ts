
// This file now acts as a facade to our modular services

// Re-export all functions from their respective service modules
export { getUserMatches, acceptJobMatch, declineJobMatch } from './matchOperationsService';
export { getJobDetails } from './jobDetailsService';
export { getEmployerDetails } from './employerService';

// Fix TS1205 error in data exports
export { type PostJob } from '@/data/types/jobTypes';
