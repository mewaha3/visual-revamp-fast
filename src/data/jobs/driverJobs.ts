
import { PostJob } from "@/types/types";

const driverJobs: PostJob[] = [
  {
    id: "driver1", // Add id field
    job_id: "driver1",
    first_name: "สมชาย",
    last_name: "มีรถ",
    gender: "Male",
    email: "somchai@example.com",
    job_type: "driver",
    job_detail: "ต้องการคนขับรถส่วนตัว รู้เส้นทางในกรุงเทพฯ",
    salary: 15000,
    job_date: "2023-04-15",
    start_time: "08:00",
    end_time: "17:00",
    job_address: "123 ถนนสุขุมวิท กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "วัฒนา",
    subdistrict: "คลองตันเหนือ",
    zip_code: "10110"
  },
  {
    id: "driver2", // Add id field
    job_id: "driver2",
    first_name: "วิชัย",
    last_name: "รักขับรถ",
    gender: "Male",
    email: "wichai@example.com",
    job_type: "driver",
    job_detail: "รับสมัครคนขับรถส่งของ ขับรถตู้ได้",
    salary: 18000,
    job_date: "2023-04-20",
    start_time: "09:00",
    end_time: "18:00",
    job_address: "456 ถนนสีลม กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "บางรัก",
    subdistrict: "สีลม",
    zip_code: "10500"
  }
];

export { driverJobs };
