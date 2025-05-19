
export interface FindJob {
  findjob_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_type: string;
  skills: string;
  job_date: string;
  start_time: string;
  end_time: string;
  job_address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
  start_salary: number;
  range_salary: number;
  gender: "Male" | "Female";
}

export const findJobs: FindJob[] = [
  {
    findjob_id: "FJ1",
    first_name: "สมชาย",
    last_name: "สุขใจดี",
    email: "somchai@example.com",
    job_type: "พนักงาน",
    skills: "จัดส่ง,บรรทุก",
    job_date: "2025-05-01",
    start_time: "8:00:00",
    end_time: "16:00:00",
    job_address: "100/1 ถ.สุขุมวิท กรุงเทพฯ",
    province: "ตราด",
    district: "เมือง",
    subdistrict: "ตราด",
    zip_code: "10100",
    start_salary: 3000,
    range_salary: 5000,
    gender: "Male"
  },
  {
    findjob_id: "FJ2",
    first_name: "สมหญิง",
    last_name: "มีแก้ว",
    email: "somying@example.com",
    job_type: "ครูสอน",
    skills: "สอนฝึกป,ฟุตบอล",
    job_date: "2025-05-02",
    start_time: "9:00:00",
    end_time: "17:00:00",
    job_address: "200 ถ.พาหุรัด 9 เชียงใหม่",
    province: "เชียงใหม่",
    district: "เมืองเชียงใหม่",
    subdistrict: "สุเทพ",
    zip_code: "50200",
    start_salary: 3200,
    range_salary: 5200,
    gender: "Female"
  },
  {
    findjob_id: "FJ3",
    first_name: "วิเชษฐ์",
    last_name: "ไพบูลย์",
    email: "wattana@example.com",
    job_type: "พ่อบ้าน",
    skills: "ทำความสะอาด,ซ่อม",
    job_date: "2025-05-03",
    start_time: "10:00:00",
    end_time: "18:00:00",
    job_address: "300 ถ.เพชรบุรี พะเยา",
    province: "เชียงใหม่",
    district: "สันทราย",
    subdistrict: "ต้นเปา",
    zip_code: "40000",
    start_salary: 3400,
    range_salary: 5400,
    gender: "Male"
  },
  {
    findjob_id: "FJ4",
    first_name: "จันทร์พร",
    last_name: "สะอาดตา",
    email: "jinda@example.com",
    job_type: "พนักงาน",
    skills: "เสิร์ฟ,แคชเชียร์",
    job_date: "2025-05-04",
    start_time: "11:00:00",
    end_time: "19:00:00",
    job_address: "400 ถ.เจริญกรุง ระนอง",
    province: "เชียงราย",
    district: "เชียงแสน",
    subdistrict: "ตำบล3",
    zip_code: "20000",
    start_salary: 3600,
    range_salary: 5600,
    gender: "Female"
  },
  {
    findjob_id: "FJ5",
    first_name: "สุเทพ",
    last_name: "ประเสริฐ",
    email: "thanapol@example.com",
    job_type: "พนักงาน",
    skills: "จัดส่ง,สต็อค",
    job_date: "2025-05-05",
    start_time: "12:00:00",
    end_time: "20:00:00",
    job_address: "500 ถ.พระราม 9 นครราชสีมา",
    province: "เชียงเหนือ",
    district: "เชียงเหนือพัฒนา",
    subdistrict: "ตำบล4",
    zip_code: "30000",
    start_salary: 3800,
    range_salary: 5500,
    gender: "Male"
  }
];
