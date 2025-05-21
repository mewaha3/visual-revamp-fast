// Import statements if needed...

// Update the FindJob interface to match the expected type
export interface FindJob {
    id: string;
    name?: string; // Added as optional to fix errors in matchMocks
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    gender: string;
    detail?: string;
    address?: string;
    salary_type?: string;
    expected_salary?: string | number; // Support both types
    start_date?: string;
    available_days?: string | string[]; // Support both types
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

// Keep other interfaces unchanged
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

// Update JOB_TYPES with improved icons
export const JOB_TYPES = [
  { value: "housekeeping", label: "แม่บ้าน", icon: "home" },
  { value: "gardening", label: "ดูแลสวน", icon: "tree-deciduous" },
  { value: "cooking", label: "ทำอาหาร", icon: "chef-hat" },
  { value: "eldercare", label: "ดูแลผู้สูงอายุ", icon: "users" },
  { value: "childcare", label: "เลี้ยงเด็ก", icon: "baby" },
  { value: "driver", label: "คนขับรถ", icon: "car-front" },
  { value: "security", label: "รักษาความปลอดภัย", icon: "shield" },
  { value: "petcare", label: "ดูแลสัตว์เลี้ยง", icon: "dog" },
  { value: "tutor", label: "ติวเตอร์", icon: "graduation-cap" },
  { value: "handyman", label: "ช่างซ่อมทั่วไป", icon: "wrench" },
  { value: "cleaning", label: "ทำความสะอาด", icon: "broom" },
  { value: "other", label: "อื่นๆ", icon: "file-text" },
];

// Update JobDetail interface to include job_id and name
export interface JobDetail {
  id: string;
  job_id?: string;
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
  status?: string;
  findjob_id?: string;
  detail?: string;
  name?: string; // Add name to fix type errors in matchMocks
}

// Update Employer interface with required fields
export interface Employer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  profile_image?: string;
  name?: string;
}

export interface Job {
  id: string;
  job_id?: string;
  job_type: string;
  job_detail?: string;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address?: string;
  salary?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code?: string;
  status?: string;
}

export interface MatchResult {
  id?: string;
  name?: string; 
  gender?: string;
  jobType?: string;
  job_type?: string;
  date?: string;
  time?: string;
  location?: string;
  salary?: number | string;
  aiScore?: number;
  score?: number;
  job_id?: string;
  findjob_id?: string;
  job_detail?: string;
  findjob_name?: string;
  findjob_gender?: string;
  job_date?: string;
  day_match?: boolean;
  time_match?: boolean;
  location_match?: boolean;
  province_match?: boolean;
  province?: string;
  workerId?: string;
}

export interface StatusResult {
  id: string;
  job_id: string;
  findjob_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  name?: string;
  gender?: string;
  jobType?: string;
  date?: string;
  time?: string;
  location?: string;
  salary?: string | number;
  workerId?: string;
}
