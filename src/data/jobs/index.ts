
import { PostJob } from "../types/jobTypes";
import { serviceJobs } from "./serviceJobs";
import { teachingJobs } from "./teachingJobs";
import { housekeepingJobs } from "./housekeepingJobs";
import { driverJobs } from "./driverJobs";

// Combine all job data
export const postJobs: PostJob[] = [
  ...serviceJobs,
  ...teachingJobs,
  ...housekeepingJobs,
  ...driverJobs
];

// Re-export the interface with proper syntax for isolatedModules
export type { PostJob } from "../types/jobTypes";
