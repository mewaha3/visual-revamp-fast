
export interface Job {
  job_id: string;
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
}

export interface PostJob extends Job {
  // All required fields already in Job interface
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

export interface FindJob {
  findjob_id: string;
  job_type: string;  // Keep job_type as string without modification
  skills: string;
  job_date: string;
  start_time: string;
  end_time: string;
  province: string;
  district: string;
  subdistrict: string;
  start_salary: number;
  range_salary: number;
  email: string;
  first_name: string;
  last_name: string;
  job_address: string;
  zip_code: string;
  gender: string;  // Changed from enum type to string to match implementation
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

export const JOB_TYPES = [
  { value: "cleaning", label: "พนักงานทำความสะอาด (แม่บ้านออฟฟิศ, ห้าง ฯลฯ)", icon: "broom" },
  { value: "security", label: "พนักงานรักษาความปลอดภัย (รปภ.)", icon: "shield" },
  { value: "toilet", label: "พนักงานดูแลห้องน้ำสาธารณะ", icon: "bath" },
  { value: "tailor", label: "พนักงานเย็บผ้า", icon: "scissors" },
  { value: "factory", label: "พนักงานสายพาน / โรงงานผลิต", icon: "factory" },
  { value: "packer", label: "พนักงานแพ็คของ", icon: "package" },
  { value: "qc", label: "พนักงาน QC / ตรวจสอบคุณภาพ", icon: "search" },
  { value: "pet", label: "คนดูแลสัตว์เลี้ยง / จูงหมา", icon: "dog" },
  { value: "car_wash", label: "คนล้างรถ", icon: "car" },
  { value: "house", label: "คนเฝ้าบ้าน", icon: "home" },
  { value: "window", label: "พนักงานเช็ดกระจกอาคารสูง", icon: "glasses" },
  { value: "flyer", label: "พนักงานแจกใบปลิว", icon: "file-text" },
  { value: "driver", label: "พนักงานขับรถ", icon: "car-front" },
  { value: "gardener", label: "คนสวน", icon: "tree-deciduous" }
];
