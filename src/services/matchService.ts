import { JobDetail, Employer, FindMatch, MatchResult, Job } from "@/types/types";
import { getJobById } from '@/services/jobService';

// Mock data for development - expanded with more diverse job details
const mockMatches: FindMatch[] = [
  {
    findjob_id: "FJ1",
    job_id: "PJ5",
    job_type: "พนักงานจัดแสดงสินค้า",
    detail: "งานจัดแสดงสินค้าที่ห้างสรรพสินค้า",
    job_date: "2025-06-10",
    start_time: "09:00:00",
    end_time: "18:00:00",
    province: "กรุงเทพฯ",
    district: "ปทุมวัน",
    subdistrict: "ลุมพินี",
    salary: 800
  },
  {
    findjob_id: "FJ2",
    job_id: "PJ6",
    job_type: "พนักงานขาย",
    detail: "งานขายเครื่องสำอางในห้าง Central World ชั้น 2 โซนบิวตี้",
    job_date: "2025-06-15",
    start_time: "10:00:00",
    end_time: "19:00:00",
    province: "กรุงเทพฯ",
    district: "จตุจักร",
    subdistrict: "จตุจักร",
    salary: 750
  },
  {
    findjob_id: "FJ3",
    job_id: "PJ7",
    job_type: "พนักงานทำความสะอาด",
    detail: "งานทำความสะอาดสำนักงาน",
    job_date: "2025-06-20",
    start_time: "08:00:00",
    end_time: "17:00:00",
    province: "นนทบุรี",
    district: "ปากเกร็ด",
    subdistrict: "บางตลาด",
    salary: 600
  },
  // Adding PJ8 to mock data
  {
    findjob_id: "FJ4",
    job_id: "PJ8",
    job_type: "พนักงานบริการ",
    detail: "งานบริการลูกค้าในร้านอาหาร",
    job_date: "2025-06-25",
    start_time: "11:00:00",
    end_time: "20:00:00",
    province: "กรุงเทพฯ",
    district: "บางนา",
    subdistrict: "บางนา",
    salary: 700
  }
];

// Collection of mock job details with different data
const mockJobDetails: Record<string, JobDetail> = {
  "PJ5": {
    findjob_id: "FJ1",
    job_id: "PJ5",
    job_type: "พนักงานจัดแสดงสินค้า",
    detail: "งานจัดแสดงสินค้าเครื่องใช้ไฟฟ้าที่ห้างสรรพสินค้า Central Rama 9",
    job_date: "2025-06-10",
    start_time: "09:00:00",
    end_time: "18:00:00",
    province: "กรุงเทพฯ",
    district: "ห้วยขวาง",
    subdistrict: "ห้วยขวาง",
    salary: 800,
    job_address: "เลขที่ 9/9 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310"
  },
  "PJ6": {
    findjob_id: "FJ2",
    job_id: "PJ6",
    job_type: "พนักงานขาย",
    detail: "งานขายเครื่องสำอางในห้าง Central World ชั้น 2 โซนบิวตี้",
    job_date: "2025-06-15",
    start_time: "10:00:00",
    end_time: "19:00:00",
    province: "กรุงเทพฯ",
    district: "ปทุมวัน",
    subdistrict: "ลุมพินี",
    salary: 750,
    job_address: "เลขที่ 999 ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330"
  },
  "PJ7": {
    findjob_id: "FJ3",
    job_id: "PJ7",
    job_type: "พนักงานทำความสะอาด",
    detail: "งานทำความสะอาดสำนักงานบริษัท ABC ประจำวัน",
    job_date: "2025-06-20",
    start_time: "08:00:00",
    end_time: "17:00:00",
    province: "นนทบุรี",
    district: "ปากเกร็ด",
    subdistrict: "บางตลาด",
    salary: 600,
    job_address: "เลขที่ 123 หมู่ 4 ถนนแจ้งวัฒนะ ตำบลบางตลาด อำเภอปากเกร็ด จังหวัดนนทบุรี 11120"
  },
  // Add PJ8 job details
  "PJ8": {
    findjob_id: "FJ4",
    job_id: "PJ8",
    job_type: "พนักงานบริการ",
    detail: "งานบริการลูกค้าในร้านอาหาร The Garden หน้าที่รับผิดชอบ: ต้อนรับลูกค้า, แนะนำเมนู, เสิร์ฟอาหาร",
    job_date: "2025-06-25",
    start_time: "11:00:00",
    end_time: "20:00:00",
    province: "กรุงเทพฯ",
    district: "บางนา",
    subdistrict: "บางนา",
    salary: 700,
    job_address: "เลขที่ 88 ซอยบางนา-ตราด 30 แขวงบางนา เขตบางนา กรุงเทพฯ 10260"
  }
};

// Collection of mock employer data
const mockEmployers: Record<string, Employer> = {
  "PJ5": {
    name: "คุณสมชาย รักการค้า",
    phone: "081-234-5678",
    email: "somchai@example.com"
  },
  "PJ6": {
    name: "คุณรัชดา มีสุข",
    phone: "062-123-4567",
    email: "rachada@example.com"
  },
  "PJ7": {
    name: "คุณมานะ ใจดี",
    phone: "089-876-5432",
    email: "mana@example.com"
  },
  // Add PJ8 employer
  "PJ8": {
    name: "คุณวิชัย อาหารอร่อย",
    phone: "065-789-1234",
    email: "wichai@example.com"
  }
};

// Fetch user's job matches
export const getUserMatches = async (userEmail: string): Promise<FindMatch[]> => {
  // In a real implementation, you would fetch from an API
  console.log(`Fetching matches for user: ${userEmail}`);
  return Promise.resolve(mockMatches);
};

// Accept a job match
export const acceptJobMatch = async (findjobId: string): Promise<void> => {
  // In a real implementation, you would call an API
  console.log(`Accepting job match: ${findjobId}`);
  return Promise.resolve();
};

// Decline a job match
export const declineJobMatch = async (findjobId: string): Promise<void> => {
  // In a real implementation, you would call an API
  console.log(`Declining job match: ${findjobId}`);
  return Promise.resolve();
};

// Get job details for a specific job ID
export const getJobDetails = async (jobId: string): Promise<JobDetail> => {
  try {
    console.log("Fetching job details for job:", jobId);
    
    // First check if this is a job from postJobs array
    const jobData = getJobById(jobId);
    
    if (!jobData) {
      throw new Error(`Job details not found for job ID: ${jobId}`);
    }
    
    // Convert Job to JobDetail format
    const jobDetail: JobDetail = {
      findjob_id: "", // Not applicable for posted jobs
      job_id: jobData.job_id,
      job_type: jobData.job_type,
      detail: jobData.job_detail,
      job_date: jobData.job_date,
      start_time: jobData.start_time,
      end_time: jobData.end_time,
      province: jobData.province,
      district: jobData.district,
      subdistrict: jobData.subdistrict,
      salary: jobData.salary,
      job_address: jobData.job_address,
    };
    
    console.log("Job details fetched:", jobDetail);
    return jobDetail;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
};

// Get employer details for a specific job ID
export const getEmployerDetails = async (jobId: string): Promise<Employer> => {
  try {
    // Get the job data first to access employer info
    const jobData = getJobById(jobId);
    
    if (!jobData) {
      throw new Error(`Employer details not found for job ID: ${jobId}`);
    }
    
    // Construct employer information from job data
    const employer: Employer = {
      name: `${jobData.first_name} ${jobData.last_name}`,
      phone: "099-999-9999", // Mock phone number as it's not in the Job interface
      email: jobData.email,
    };
    
    return employer;
  } catch (error) {
    console.error("Error fetching employer details:", error);
    throw error;
  }
};
