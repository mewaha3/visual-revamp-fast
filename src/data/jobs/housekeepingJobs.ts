
import { PostJob } from "@/types/types";

const housekeepingJobs: PostJob[] = [
  {
    id: "housekeeping1", // Add id field
    job_id: "housekeeping1",
    first_name: "สมหญิง",
    last_name: "รักสะอาด",
    gender: "Female",
    email: "somying@example.com",
    job_type: "housekeeping",
    job_detail: "ต้องการแม่บ้านทำความสะอาดบ้าน 2 ชั้น 3 ห้องนอน",
    salary: 12000,
    job_date: "2023-04-10",
    start_time: "08:00",
    end_time: "17:00",
    job_address: "789 ถนนรัชดาภิเษก กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "ห้วยขวาง",
    subdistrict: "ห้วยขวาง",
    zip_code: "10310"
  },
  {
    id: "housekeeping2", // Add id field
    job_id: "housekeeping2",
    first_name: "ใจดี",
    last_name: "มีบ้าน",
    gender: "Female",
    email: "jaidee@example.com",
    job_type: "housekeeping",
    job_detail: "หาแม่บ้านทำความสะอาดและซักผ้า อาทิตย์ละ 3 วัน",
    salary: 9000,
    job_date: "2023-04-12",
    start_time: "09:00",
    end_time: "16:00",
    job_address: "101 ถนนลาดพร้าว กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "จตุจักร",
    subdistrict: "จตุจักร",
    zip_code: "10900"
  }
];

export { housekeepingJobs };
