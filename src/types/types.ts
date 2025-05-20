
export interface Job {
  job_id: string;
  job_type: string;
  job_detail: string;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  salary: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  // Added fields to match PostJob interface
  gender?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  zip_code?: string;
}

export interface PostJob extends Job {
  gender: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
}

export interface MatchResult {
  name: string;
  gender: string;
  jobType: string;
  date: string;
  time: string;
  location: string;
  salary: number;
  aiScore: number;
}

export interface StatusResult extends MatchResult {
  status: 'on_queue' | 'accepted' | 'declined' | 'job_done';
  workerId?: string;
}

export interface FindJob {
  findjob_id: string;
  job_type: string;
  skills: string;
  job_date: string;
  start_time: string;
  end_time: string;
  province: string;
  district: string;
  subdistrict: string;
  start_salary: number;
  range_salary: number;
  email: string;
  first_name: string;
  last_name: string;
  job_address?: string; // Optional for backward compatibility
  zip_code?: string; // Optional for backward compatibility
  gender?: string; // Optional for backward compatibility
}

export interface FindMatch {
  findjob_id: string;
  job_id: string;
  job_type: string;
  detail?: string;
  job_date: string;
  start_time: string;
  end_time: string;
  province: string;
  district: string;
  subdistrict: string;
  salary: number;
}

export interface JobDetail extends FindMatch {
  job_address: string;
  // Additional fields can go here
}

export interface Employer {
  name: string;
  phone: string;
  email: string;
}
