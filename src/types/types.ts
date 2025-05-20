
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

// Add the JOB_TYPES constant that was missing
export const JOB_TYPES = [
  { value: "housekeeping", label: "แม่บ้าน", icon: "cleaning" },
  { value: "gardening", label: "ดูแลสวน", icon: "garden" },
  { value: "cooking", label: "ทำอาหาร", icon: "cooking" },
  { value: "eldercare", label: "ดูแลผู้สูงอายุ", icon: "elderly" },
  { value: "childcare", label: "เลี้ยงเด็ก", icon: "baby" },
  { value: "driver", label: "คนขับรถ", icon: "car" },
  { value: "security", label: "รักษาความปลอดภัย", icon: "security" },
  { value: "petcare", label: "ดูแลสัตว์เลี้ยง", icon: "pet" },
  { value: "tutor", label: "ติวเตอร์", icon: "tutor" },
  { value: "handyman", label: "ช่างซ่อมทั่วไป", icon: "repair" },
  { value: "cleaning", label: "ทำความสะอาด", icon: "cleaning" },
  { value: "other", label: "อื่นๆ", icon: "other" },
];

// Adding missing interfaces for fixing other TypeScript errors
export interface JobDetail {
  id: string;
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
}

export interface Employer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  profile_image?: string;
}

export interface Job {
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
}

export interface MatchResult {
  id: string;
  score: number;
  job_id: string;
  findjob_id: string;
  job_type: string;
  job_detail: string;
  findjob_name: string;
  findjob_gender: string;
  job_date: string;
  day_match: boolean;
  time_match: boolean;
  location_match: boolean;
  province_match: boolean;
  province: string;
}

export interface StatusResult {
  id: string;
  job_id: string;
  findjob_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}
