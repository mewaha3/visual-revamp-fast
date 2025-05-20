
import { PostJob } from "@/types/types";

const teachingJobs: PostJob[] = [
  {
    id: "teaching1", // Add id field
    job_id: "teaching1",
    first_name: "วิชัย",
    last_name: "รักการสอน",
    gender: "Male",
    email: "wichai_teacher@example.com",
    job_type: "tutor",
    job_detail: "ต้องการติวเตอร์สอนคณิตศาสตร์ ระดับมัธยมปลาย",
    salary: 25000,
    job_date: "2023-05-05",
    start_time: "16:00",
    end_time: "20:00",
    job_address: "666 ถนนสุขุมวิท กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "วัฒนา",
    subdistrict: "พระโขนงเหนือ",
    zip_code: "10110"
  },
  {
    id: "teaching2", // Add id field
    job_id: "teaching2",
    first_name: "สมศรี",
    last_name: "มีลูกเล็ก",
    gender: "Female",
    email: "somsri@example.com",
    job_type: "tutor",
    job_detail: "สอนภาษาอังกฤษเด็ก 8 ขวบ เน้นการสนทนา",
    salary: 18000,
    job_date: "2023-05-08",
    start_time: "15:00",
    end_time: "17:00",
    job_address: "777 ถนนรามคำแหง กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "สวนหลวง",
    subdistrict: "สวนหลวง",
    zip_code: "10250"
  }
];

export { teachingJobs };
