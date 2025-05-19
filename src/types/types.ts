
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
