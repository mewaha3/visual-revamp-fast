
import { FindMatch, JobDetail, Employer } from "@/types/types";

// Mock data for development - expanded with more diverse job details
export const mockMatches: FindMatch[] = [
  {
    findjob_id: "FJ1",
    job_id: "PJ5",
    name: "somchai@example.com", // Using email as name for filtering
    job_type: "cleaning",
    detail: "ทำความสะอาดบ้าน",
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
    name: "somchai@example.com", // Using email as name for filtering
    job_type: "security",
    detail: "รักษาความปลอดภัย",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600
  },
  {
    findjob_id: "FJ3",
    job_id: "PJ7",
    name: "somchai@example.com", // Using email as name for filtering
    job_type: "tailor",
    detail: "ซ่อมเสื้อผ้า",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600
  },
  // Adding PJ8 to mock data
  {
    findjob_id: "FJ4",
    job_id: "PJ8",
    name: "aaa@aaa.com", // Different user
    job_type: "packer",
    detail: "ติดฉลากสินค้า",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600
  },
  // Adding PJ9 to mock data
  {
    findjob_id: "FJ5",
    job_id: "PJ9",
    name: "aaa@aaa.com", // Different user
    job_type: "driver",
    detail: "ขับรถบรรทุก",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600
  },
  // Adding PJ10 to mock data
  {
    findjob_id: "FJ6",
    job_id: "PJ10",
    name: "user3@example.com", // Different user
    job_type: "gardener",
    detail: "ตัดกิ่งไม้",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600
  }
];

// Collection of mock job details with different data
export const mockJobDetails: Record<string, JobDetail> = {
  "PJ5": {
    id: "PJ5",
    job_id: "PJ5",
    job_type: "cleaning",
    detail: "ทำความสะอาดบ้าน",
    job_detail: "ทำความสะอาดบ้าน",
    job_date: "2025-06-10",
    start_time: "09:00:00",
    end_time: "18:00:00",
    province: "กรุงเทพฯ",
    district: "ห้วยขวาง",
    subdistrict: "ห้วยขวาง",
    salary: 800,
    job_address: "เลขที่ 9/9 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
    name: "คุณสมชาย สมบัติดี"
  },
  "PJ6": {
    id: "PJ6",
    job_id: "PJ6",
    job_type: "security",
    detail: "รักษาความปลอดภัย",
    job_detail: "รักษาความปลอดภัย",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี",
    name: "คุณสมชาย สมบัติดี"
  },
  "PJ7": {
    id: "PJ7",
    job_id: "PJ7",
    job_type: "tailor",
    detail: "ซ่อมเสื้อผ้า",
    job_detail: "ซ่อมเสื้อผ้า",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี",
    name: "คุณสมชาย สมบัติดี"
  },
  // Add PJ8 job details
  "PJ8": {
    id: "PJ8",
    job_id: "PJ8",
    job_type: "packer",
    detail: "ติดฉลากสินค้า",
    job_detail: "ติดฉลากสินค้า",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี",
    name: "คุณสมชาย สมบัติดี"
  },
  // Add PJ9 job details
  "PJ9": {
    id: "PJ9",
    job_id: "PJ9",
    job_type: "driver",
    detail: "ขับรถบรรทุก",
    job_detail: "ขับรถบรรทุก",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี",
    name: "คุณสมชาย สมบัติดี"
  },
  // Add PJ10 job details
  "PJ10": {
    id: "PJ10",
    job_id: "PJ10",
    job_type: "gardener",
    detail: "ตัดกิ่งไม้",
    job_detail: "ตัดกิ่งไม้",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี",
    name: "คุณสมชาย สมบัติดี"
  }
};

// Collection of mock employer data
export const mockEmployers: Record<string, Employer> = {
  "PJ5": {
    id: "emp1",
    first_name: "สมชาย",
    last_name: "สมบัติดี",
    name: "คุณสมชาย สมบัติดี",
    phone: "081-234-5678",
    email: "somchai@example.com"
  },
  "PJ6": {
    id: "emp1",
    first_name: "สมชาย",
    last_name: "สมบัติดี",
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  "PJ7": {
    id: "emp1",
    first_name: "สมชาย",
    last_name: "สมบัติดี",
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  // Add PJ8 employer
  "PJ8": {
    id: "emp1",
    first_name: "สมชาย",
    last_name: "สมบัติดี",
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  // Add PJ9 employer
  "PJ9": {
    id: "emp1",
    first_name: "สมชาย",
    last_name: "สมบัติดี",
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  // Add PJ10 employer
  "PJ10": {
    id: "emp1",
    first_name: "สมชาย",
    last_name: "สมบัติดี",
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  }
};
