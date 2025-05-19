
export interface PostJob {
  job_id: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female";
  email: string;
  job_type: string;
  job_detail: string;
  salary: number;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
}

export const postJobs: PostJob[] = [
  {
    job_id: "PJ1",
    first_name: "สมชัย",
    last_name: "สุขดี",
    gender: "Male",
    email: "somkid@example.com",
    job_type: "พนักงาน",
    job_detail: "ต้อนรับ",
    salary: 3500,
    job_date: "2025-05-01",
    start_time: "8:00:00",
    end_time: "17:00:00",
    job_address: "101 ถ.พหลโยธิน กรุงเทพฯ",
    province: "กรุงเทพ",
    district: "จตุจักร",
    subdistrict: "จตุจักร",
    zip_code: "10900"
  },
  {
    job_id: "PJ2",
    first_name: "มานี",
    last_name: "ปรีชา",
    gender: "Male",
    email: "malee@example.com",
    job_type: "ผู้สอน",
    job_detail: "คณิตฯ",
    salary: 3000,
    job_date: "2025-06-02",
    start_time: "9:00:00",
    end_time: "18:00:00",
    job_address: "20 ถ.เจริญกรุง ปทุมธานี",
    province: "ปทุมธานี",
    district: "ธัญบุรี",
    subdistrict: "ประชาธิปัตย์",
    zip_code: "12130"
  },
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
    job_id: "PJ4",
    first_name: "พรชัย",
    last_name: "ทองสกุล",
    gender: "Male",
    email: "thanakorn@example.com",
    job_type: "พนักงาน",
    job_detail: "ยกกระเป๋าโรงแรม",
    salary: 3700,
    job_date: "2025-06-04",
    start_time: "10:00:00",
    end_time: "19:00:00",
    job_address: "44 ซ.เพชรเกษม 3 ฉะเชิงเทรา",
    province: "ฉะเชิงเทรา",
    district: "เมืองฉะเชิงเทรา",
    subdistrict: "หน้าเมือง",
    zip_code: "10270"
  },
  {
    job_id: "PJ5",
    first_name: "อรทัย",
    last_name: "บุญศรี",
    gender: "Female",
    email: "orathai@example.com",
    job_type: "พนักงาน",
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
  },
  {
    job_id: "PJ6",
    first_name: "สมชาย",
    last_name: "สุขใจดี",
    gender: "Female",
    email: "somchai@example.com",
    job_type: "พนักงาน",
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
