
import { FindMatch, JobDetail, Employer } from "@/types/types";

// Mock data for development - expanded with more diverse job details
export const mockMatches: FindMatch[] = [
  {
    findjob_id: "FJ1",
    job_id: "PJ5",
    name: "คุณสมชาย สมบัติดี",
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
    name: "คุณสมชาย สมบัติดี",
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
    name: "คุณสมชาย สมบัติดี",
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
    name: "คุณสมชาย สมบัติดี",
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
    name: "คุณสมชาย สมบัติดี",
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
    name: "คุณสมชาย สมบัติดี",
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
    findjob_id: "FJ1",
    job_id: "PJ5",
    name: "คุณสมชาย สมบัติดี",
    job_type: "cleaning",
    detail: "ทำความสะอาดบ้าน",
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
    name: "คุณสมชาย สมบัติดี",
    job_type: "security",
    detail: "รักษาความปลอดภัย",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี"
  },
  "PJ7": {
    findjob_id: "FJ3",
    job_id: "PJ7",
    name: "คุณสมชาย สมบัติดี",
    job_type: "tailor",
    detail: "ซ่อมเสื้อผ้า",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี"
  },
  // Add PJ8 job details
  "PJ8": {
    findjob_id: "FJ4",
    job_id: "PJ8",
    name: "คุณสมชาย สมบัติดี",
    job_type: "packer",
    detail: "ติดฉลากสินค้า",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี"
  },
  // Add PJ9 job details
  "PJ9": {
    findjob_id: "FJ5",
    job_id: "PJ9",
    name: "คุณสมชาย สมบัติดี",
    job_type: "driver",
    detail: "ขับรถบรรทุก",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี"
  },
  // Add PJ10 job details
  "PJ10": {
    findjob_id: "FJ6",
    job_id: "PJ10",
    name: "คุณสมชาย สมบัติดี",
    job_type: "gardener",
    detail: "ตัดกิ่งไม้",
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    salary: 3600,
    job_address: "50 ถ.พัฒนาการ นนทบุรี"
  }
};

// Collection of mock employer data
export const mockEmployers: Record<string, Employer> = {
  "PJ5": {
    name: "คุณสมชาย สมบัติดี",
    phone: "081-234-5678",
    email: "somchai@example.com"
  },
  "PJ6": {
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  "PJ7": {
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  // Add PJ8 employer
  "PJ8": {
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  // Add PJ9 employer
  "PJ9": {
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  },
  // Add PJ10 employer
  "PJ10": {
    name: "คุณสมชาย สมบัติดี",
    phone: "082-123-4567",
    email: "somchai@example.com"
  }
};
