// Import statements if needed...

// Update the FindJob interface to match the expected type
export interface FindJob {
    id: string;
    name: string;
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    gender: string; // Changed from the enum to string to fix TypeScript error
    detail: string;
    address: string;
    salary_type: string;
    expected_salary: number;
    start_date: string;
    available_days: string[];
    start_time: string;
    end_time: string;
}

// Keep other interfaces and types unchanged
export interface FindMatch {
    findjob_id: string;
    job_id: string;
    name: string;
    job_type: string;
    detail: string;
    job_date: string;
    start_time: string;
    end_time: string;
    province: string;
    district: string;
    subdistrict: string;
    salary: number;
}
