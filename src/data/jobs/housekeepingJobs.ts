
import { PostJob } from "../types/jobTypes";

export const housekeepingJobs: PostJob[] = [
  {
    job_id: "PJ3",
    first_name: "ชาย",
    last_name: "กลางบัว",
    gender: "Male",
    email: "chai@example.com",
    job_type: "พ่อบ้าน",
    job_detail: "ทำความสะอาด",
    salary: 2800,
    job_date: "2025-06-03",
    start_time: "7:30:00",
    end_time: "15:30:00",
    job_address: "303 ถ.สุขุมวิท ซ. สมชาย",
    province: "ราชบุรี",
    district: "เมืองราชบุรี",
    subdistrict: "หน้าเมือง",
    zip_code: "70000"
  },
  {
    job_id: "PJ8",
    first_name: "สมชาย",
    last_name: "สุขใจดี",
    gender: "Female",
    email: "somchai@example.com",
    job_type: "พ่อบ้าน",
    job_detail: "จัดแสดงสินค้า",
    salary: 3600,
    job_date: "2025-06-05",
    start_time: "12:00:00",
    end_time: "21:00:00",
    job_address: "50 ถ.พัฒนาการ นนทบุรี",
    province: "นนทบุรี",
    district: "เมืองนนทบุรี",
    subdistrict: "บางกระสอ",
    zip_code: "11000"
  }
];
