
export interface FindJob {
    id: string;
    name?: string; // Added as optional to fix errors in matchMocks
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    gender: string;
    detail: string;
    address: string;
    salary_type: string;
    expected_salary: string | number; // Support both types
    start_date: string;
    available_days: string | string[]; // Support both types
    start_time: string;
    end_time: string;
    // Additional fields for compatibility
    findjob_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    skills?: string;
    job_date?: string;
    start_salary?: number;
    range_salary?: number;
    job_address?: string;
    zip_code?: string;
    phone?: string; // For MatchResult
    score?: number; // For MatchResult
    aiScore?: number; // For matching data
}

// Update PostJob interface to make id optional
export interface PostJob {
    id?: string; // Optional to allow creation of new jobs
    job_id?: string; // Added for compatibility
    job_type: string;
    job_detail: string;
    job_date: string;
    start_time: string;
    end_time: string;
    job_address: string;
    salary: number;
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    province: string;
    district: string;
    subdistrict: string;
    zip_code: string;
    status?: string;
}
