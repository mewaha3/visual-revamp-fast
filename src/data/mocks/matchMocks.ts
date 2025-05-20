
import { FindMatch, JobDetail, Employer } from "@/types/types";

// Mock data for development - expanded with more diverse job details
export const mockMatches: FindMatch[] = [
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
export const mockJobDetails: Record<string, JobDetail> = {
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
export const mockEmployers: Record<string, Employer> = {
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
