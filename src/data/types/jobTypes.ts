
import { v4 as uuidv4 } from 'uuid';

export interface PostJob {
  id: string;  // Added required id field
  job_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  job_type: string;
  job_detail: string;
  salary: number;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
}

export interface FindJob {
  id: string;
  service_type: string;
  service_detail?: string;
  days_available: string[];
  preferred_time: string;
  preferred_location: string;
  preferred_provinces: string[];
  expected_salary: string;
  gender: string;
  age?: number;
  education_level?: string;
  experience?: string;
  skills?: string[];
  certificates?: string[];
  references?: string[];
  additional_notes?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at?: string;
}

export interface JobDetail {
  id: string;  // Added required id field
  job_id: string;
  job_type: string;
  job_detail: string;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  salary: number;
  province: string;
  district: string;
  subdistrict: string;
  name?: string;  // Make name optional to fix errors
}

export interface Employer {
  id: string;  // Added required id field
  first_name: string;
  last_name: string;
  email: string;
  name?: string;  // Make name optional
  phone?: string;
  rating?: number;
  reviews?: number;
}

export interface MatchResult {
  id: string;
  score: number;
  job_id: string;
  findjob_id: string;
  job_type: string;
  job_detail: string;
  findjob_name: string;
  findjob_gender: string;
  job_date: string;
  day_match: boolean;
  time_match: boolean;
  location_match: boolean;
  province_match: boolean;
  province: string;
  // Added these properties for compatibility
  name?: string;
  gender?: string;
  jobType?: string;
  date?: string;
  time?: string;
  location?: string;
  salary?: string;
}

export interface StatusResult {
  id: string;
  job_id: string;
  findjob_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
  name: string;
  gender: string;
  jobType: string;
  date: string;
  time: string;
  location: string;
  salary: string | number;
  workerId: string;
}

// Helper function to update PostJob data with IDs
export function enrichWithId<T extends { id?: string }>(data: T): T & { id: string } {
  if (data.id) return data as T & { id: string };
  return { ...data, id: uuidv4() };
}
