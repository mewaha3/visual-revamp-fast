
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
  status: 'on_queue' | 'job_done';
}
