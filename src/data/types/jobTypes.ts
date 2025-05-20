
export interface FindJob {
    id: string;
    name: string;
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    gender: string; // Updated to accept any string value
    detail: string;
    address: string;
    salary_type: string;
    expected_salary: number;
    start_date: string;
    available_days: string[];
    start_time: string;
    end_time: string;
    // Add additional fields that were causing type errors in other files
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
}

// Update PostJob interface with job_id property
export interface PostJob {
    id: string;
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
    job_id?: string; // Added to fix type errors
}
