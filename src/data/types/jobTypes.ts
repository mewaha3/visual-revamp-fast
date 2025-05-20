
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
}
