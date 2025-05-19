
import { FindMatch, JobDetail, Employer } from "@/types/types";

// Mock data for development
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
    detail: "งานขายเครื่องสำอางในห้าง",
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
  }
];

const mockJobDetail: JobDetail = {
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
  salary: 750,
  job_address: "เลขที่ 999 ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330"
};

const mockEmployer: Employer = {
  name: "คุณรัชดา มีสุข",
  phone: "062-123-4567",
  email: "rachada@example.com"
};

// Fetch user's job matches
export const getUserMatches = async (userEmail: string): Promise<FindMatch[]> => {
  // In a real implementation, you would fetch from an API
  // return axios.get(`/api/my-matches?email=${userEmail}`);
  console.log(`Fetching matches for user: ${userEmail}`);
  return Promise.resolve(mockMatches);
};

// Accept a job match
export const acceptJobMatch = async (findjobId: string): Promise<void> => {
  // In a real implementation, you would call an API
  // return axios.post(`/api/matches/${findjobId}/accept`);
  console.log(`Accepting job match: ${findjobId}`);
  return Promise.resolve();
};

// Decline a job match
export const declineJobMatch = async (findjobId: string): Promise<void> => {
  // In a real implementation, you would call an API
  // return axios.post(`/api/matches/${findjobId}/decline`);
  console.log(`Declining job match: ${findjobId}`);
  return Promise.resolve();
};

// Fetch job details
export const getJobDetails = async (jobId: string): Promise<JobDetail> => {
  // In a real implementation, you would fetch from an API
  // return axios.get(`/api/jobs/${jobId}`);
  console.log(`Fetching job details for job: ${jobId}`);
  return Promise.resolve(mockJobDetail);
};

// Fetch employer details
export const getEmployerDetails = async (jobId: string): Promise<Employer> => {
  // In a real implementation, you would fetch from an API
  // return axios.get(`/api/jobs/${jobId}/employer`);
  console.log(`Fetching employer details for job: ${jobId}`);
  return Promise.resolve(mockEmployer);
};
