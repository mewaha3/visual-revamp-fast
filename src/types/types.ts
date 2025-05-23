// Import statements if needed...

// Update the FindJob interface to match the expected type
export interface FindJob {
    id: string;
    name?: string; 
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    gender: string;
    detail?: string;
    address?: string;
    salary_type?: string;
    expected_salary?: string | number; 
    start_date?: string;
    available_days?: string | string[]; 
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
    phone?: string; 
    score?: number; 
    aiScore?: number; 
    user_id?: string; 
}

// Update PostJob interface to make id optional and add fields
export interface PostJob {
    id?: string; 
    job_id?: string; 
    job_type: string;
    job_detail: string;
    detail?: string; // Add detail field to fix type errors
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
    phone?: string; // Add phone field
    status?: string;
    user_id?: string; 
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
    id?: string; // Add id to fix type error
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

// Update JobDetail interface to include job_id, phone, and name
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
  zip_code?: string; // Add zip_code
  phone?: string; // Add phone field
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
  name: string; // Make name required for EmployerCard
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

// Add MatchResultFirestore interface for Firebase storage
export interface MatchResultFirestore {
  id?: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  job_type: string;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
  priority: number;
  status: "on_queue" | "accepted" | "declined" | "paid" | "completed" | "no_candidates";
  findjob_id: string;
  job_id: string;
  job_salary: number;
  created_at?: any;
  updated_at?: any;
  skills?: string;
  embedding_model?: string;
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
  district?: string; // Add district
  subdistrict?: string; // Add subdistrict
  workerId?: string;
  priority?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: string;
  user_id?: string; // Add user_id field
  start_time?: string; // Add start_time field
  end_time?: string; // Add end_time field
  first_name_post_jobs?: string;
  last_name_post_jobs?: string;
  gender_post_jobs?: string;
  first_name_find_jobs?: string;
  last_name_find_jobs?: string;
  gender_find_jobs?: string;
  skills?: string; // Add skills field
  embedding_model?: string; // Add field for tracking which model was used
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
  priority?: number; // Added for priority
  first_name?: string;
  last_name?: string;
  skills?: string; // Add skills field
  embedding_model?: string; // Add field for tracking which model was used
}
