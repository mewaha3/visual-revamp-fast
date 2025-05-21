
export interface FindJob {
    id: string;
    name?: string; // เพิ่ม name เป็น optional เพื่อแก้ไขปัญหาใน matchMocks
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    gender: string;
    detail: string;
    address: string;
    salary_type: string;
    expected_salary: string | number; // แก้ type เป็น union type เพื่อรองรับทั้ง string และ number
    start_date: string;
    available_days: string | string[]; // แก้ type เป็น union type เพื่อรองรับทั้ง string และ string[]
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
    phone?: string; // เพิ่มเพื่อรองรับ MatchResult
    score?: number; // เพิ่มเพื่อรองรับ MatchResult
    aiScore?: number; // เพิ่มเพื่อรองรับ matching data
}

// Update PostJob interface with both id and job_id properties
export interface PostJob {
    id?: string; // เปลี่ยนเป็น optional เพื่อให้สามารถสร้าง object ที่ยังไม่มี id ได้
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
    job_id?: string; // คงไว้เพื่อรองรับ data ที่มีอยู่แล้ว
}
