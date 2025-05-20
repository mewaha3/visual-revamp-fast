
import { PostJob } from "@/types/types";

const serviceJobs: PostJob[] = [
  {
    id: "service1", // Add id field
    job_id: "service1",
    first_name: "สมศักดิ์",
    last_name: "ต้องการช่าง",
    gender: "Male",
    email: "somsak@example.com",
    job_type: "handyman",
    job_detail: "ต้องการช่างซ่อมแอร์ มีประสบการณ์อย่างน้อย 1 ปี",
    salary: 20000,
    job_date: "2023-04-18",
    start_time: "09:00",
    end_time: "18:00",
    job_address: "222 ถนนสาทร กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "สาทร",
    subdistrict: "ทุ่งมหาเมฆ",
    zip_code: "10120"
  },
  {
    id: "service2", // Add id field
    job_id: "service2",
    first_name: "วันดี",
    last_name: "มีสุนัข",
    gender: "Female",
    email: "wandee@example.com",
    job_type: "petcare",
    job_detail: "รับคนดูแลสุนัขพันธุ์โกลเด้น 2 ตัว ช่วงวันหยุด",
    salary: 8000,
    job_date: "2023-04-22",
    start_time: "08:00",
    end_time: "20:00",
    job_address: "333 ถนนเพชรบุรี กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "ราชเทวี",
    subdistrict: "มักกะสัน",
    zip_code: "10400"
  },
  {
    id: "service3", // Add id field
    job_id: "service3",
    first_name: "พรชัย",
    last_name: "มีผู้สูงอายุ",
    gender: "Male",
    email: "pornchai@example.com",
    job_type: "eldercare",
    job_detail: "รับสมัครผู้ดูแลผู้สูงอายุ ช่วยทำกายภาพบำบัด",
    salary: 22000,
    job_date: "2023-04-25",
    start_time: "07:00",
    end_time: "19:00",
    job_address: "444 ถนนพหลโยธิน กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "พญาไท",
    subdistrict: "สามเสนใน",
    zip_code: "10400"
  },
  {
    id: "service4", // Add id field
    job_id: "service4",
    first_name: "สมใจ",
    last_name: "รักครัว",
    gender: "Female",
    email: "somjai@example.com",
    job_type: "cooking",
    job_detail: "หาคนทำอาหาร 3 มื้อ สำหรับครอบครัว 4 คน",
    salary: 15000,
    job_date: "2023-05-01",
    start_time: "06:00",
    end_time: "18:00",
    job_address: "555 ถนนเจริญกรุง กรุงเทพฯ",
    province: "กรุงเทพมหานคร",
    district: "บางคอแหลม",
    subdistrict: "บางคอแหลม",
    zip_code: "10120"
  }
];

export { serviceJobs };
