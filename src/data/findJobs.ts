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
  },
  {
    findjob_id: "FJ6", 
    first_name: "กัญญา", 
    last_name: "จันทร์หอม", 
    email: "kanya@example.com",
    job_type: "แม่บ้าน", 
    skills: "ซักผ้า,ล้างจาน",
    job_date: "2025-05-06", 
    start_time: "08:30:00", 
    end_time: "16:30:00",
    job_address: "600 ถ.สุขุมวิท หัวหิน", 
    province: "ประจวบคีรีขันธ์",
    district: "หัวหิน", 
    subdistrict: "หัวหินใน", 
    zip_code: "77110",
    start_salary: 2900, 
    range_salary: 4500, 
    gender: "Female"
  },
  {
    findjob_id: "FJ7", first_name: "จิราภรณ์", last_name: "สำราญ", email: "jiraporn@example.com",
    job_type: "พนักงาน", skills: "ขับรถ,ยกของ",
    job_date: "2025-05-07", start_time: "07:00:00", end_time: "15:00:00",
    job_address: "700 ถ.ราชดำเนิน ลพบุรี", province: "ลพบุรี",
    district: "เมืองลพบุรี", subdistrict: "ป่าตาล", zip_code: "15000",
    start_salary: 3100, range_salary: 4800, gender: "Female"
  },
  {
    findjob_id: "FJ8", first_name: "ณัฐพล", last_name: "พวงเพชร", email: "natthaphon@example.com",
    job_type: "พนักงาน", skills: "จัดเก็บสินค้า,ตรวจนับ",
    job_date: "2025-05-08", start_time: "09:30:00", end_time: "17:30:00",
    job_address: "800 ถ.เพชรเกษม ราชบุรี", province: "ราชบุรี",
    district: "เมืองราชบุรี", subdistrict: "หน้าเมือง", zip_code: "70000",
    start_salary: 3300, range_salary: 5200, gender: "Male"
  },
  {
    findjob_id: "FJ9", first_name: "สุชาดา", last_name: "ทรัพย์สิน", email: "suchada@example.com",
    job_type: "แม่บ้าน", skills: "ทำความสะอาด,รีดผ้า",
    job_date: "2025-05-09", start_time: "10:00:00", end_time: "18:00:00",
    job_address: "900 ถ.สุขาภิบาล นครศรีฯ", province: "นครศรีธรรมราช",
    district: "เมืองนครศรีฯ", subdistrict: "ในเมือง", zip_code: "80000",
    start_salary: 3000, range_salary: 4600, gender: "Female"
  },
  {
    findjob_id: "FJ10", first_name: "เทพรักษ์", last_name: "กลมกล่อม", email: "tepruk@example.com",
    job_type: "พนักงาน", skills: "แคชเชียร์,บริการลูกค้า",
    job_date: "2025-05-10", start_time: "11:00:00", end_time: "19:00:00",
    job_address: "1000 ถ.ศรีนครินทร์ สมุทรปราการ", province: "สมุทรปราการ",
    district: "เมืองสมุทรปราการ", subdistrict: "ปากน้ำ", zip_code: "10270",
    start_salary: 3500, range_salary: 5800, gender: "Male"
  },
  {
    findjob_id: "FJ11", first_name: "ปริยากร", last_name: "เกษมสุข", email: "priya@example.com",
    job_type: "ครูสอน", skills: "สอนคณิตศาสตร์,ภาษาอังกฤษ",
    job_date: "2025-05-11", start_time: "08:00:00", end_time: "16:00:00",
    job_address: "1100 ถ.พระราม 4 กรุงเทพฯ", province: "กรุงเทพมหานคร",
    district: "คลองเตย", subdistrict: "คลองตัน", zip_code: "10110",
    start_salary: 4000, range_salary: 7000, gender: "Female"
  },
  {
    findjob_id: "FJ12", first_name: "คเณศ", last_name: "วัฒนธรรม", email: "kanes@example.com",
    job_type: "พนักงาน", skills: "ดูแลต้นไม้,รดน้ำ",
    job_date: "2025-05-12", start_time: "07:30:00", end_time: "15:30:00",
    job_address: "1200 ถ.พหลโยธิน พิษณุโลก", province: "พิษณุโลก",
    district: "เมืองพิษณุโลก", subdistrict: "ในเมือง", zip_code: "65000",
    start_salary: 2800, range_salary: 4500, gender: "Male"
  },
  {
    findjob_id: "FJ13", first_name: "อาทิยา", last_name: "อร่าม", email: "athiya@example.com",
    job_type: "แม่บ้าน", skills: "ล้างรถ,กวาดถนน",
    job_date: "2025-05-13", start_time: "09:00:00", end_time: "17:00:00",
    job_address: "1300 ถ.มหาราช อยุธยา", province: "พระนครศรีอยุธยา",
    district: "เมือง", subdistrict: "ประตูชัย", zip_code: "13000",
    start_salary: 3100, range_salary: 4900, gender: "Female"
  },
  {
    findjob_id: "FJ14", first_name: "ทศพล", last_name: "มานะกิจ", email: "thotsaphon@example.com",
    job_type: "พนักงาน", skills: "ยกของ,ขนส่ง",
    job_date: "2025-05-14", start_time: "08:00:00", end_time: "16:00:00",
    job_address: "1400 ถ.ศรีวิชัย สงขลา", province: "สงขลา",
    district: "เมืองสงขลา", subdistrict: "บ่อยาง", zip_code: "90000",
    start_salary: 3400, range_salary: 5600, gender: "Male"
  },
  {
    findjob_id: "FJ15", first_name: "บุษบา", last_name: "ศรีสุข", email: "busaba@example.com",
    job_type: "พ่อบ้าน", skills: "ซ่อมไฟฟ้า,เช็ดกระจก",
    job_date: "2025-05-15", start_time: "10:00:00", end_time: "18:00:00",
    job_address: "1500 ถ.เจริญกรุง นครปฐม", province: "นครปฐม",
    district: "เมืองนครปฐม", subdistrict: "บางแขม", zip_code: "73000",
    start_salary: 3000, range_salary: 4800, gender: "Female"
  },
  {
    findjob_id: "FJ16", first_name: "มนตรี", last_name: "เคลิ้ม", email: "montri@example.com",
    job_type: "พนักงาน", skills: "จัดสินค้า,แพ็คของ",
    job_date: "2025-05-16", start_time: "07:00:00", end_time: "15:00:00",
    job_address: "1600 ถ.พระปกเกล้า จันทบุรี", province: "จันทบุรี",
    district: "เมือง", subdistrict: "ท่าช้าง", zip_code: "22000",
    start_salary: 3200, range_salary: 5000, gender: "Male"
  },
  {
    findjob_id: "FJ17", first_name: "พิมพ์", last_name: "โลกา", email: "pimloka@example.com",
    job_type: "ครูสอน", skills: "สอนศิลปะ,สอนโยคะ",
    job_date: "2025-05-17", start_time: "09:30:00", end_time: "17:30:00",
    job_address: "1700 ถ.สายใหม่ นนทบุรี", province: "นนทบุรี",
    district: "เมืองนนทบุรี", subdistrict: "บางกร่าง", zip_code: "11000",
    start_salary: 3800, range_salary: 6200, gender: "Female"
  },
  {
    findjob_id: "FJ18", first_name: "วรวิทย์", last_name: "จิตต์มั่น", email: "worawit@example.com",
    job_type: "พนักงาน", skills: "ดูแลลูกค้า,รับโทรศัพท์",
    job_date: "2025-05-18", start_time: "08:00:00", end_time: "16:00:00",
    job_address: "1800 ถ.ศรีราชา ชลบุรี", province: "ชลบุรี",
    district: "เมืองชลบุรี", subdistrict: "บางแสน", zip_code: "20130",
    start_salary: 3300, range_salary: 5500, gender: "Male"
  },
  {
    findjob_id: "FJ19", first_name: "นิภาพร", last_name: "วรวุฒิ", email: "nipaporn@example.com",
    job_type: "พ่อบ้าน", skills: "ทำอาหาร,ล้างจาน",
    job_date: "2025-05-19", start_time: "07:00:00", end_time: "15:00:00",
    job_address: "1900 ถ.หลักเมือง สุราษฎร์ฯ", province: "สุราษฎร์ธานี",
    district: "เมืองสุราษฎร์ฯ", subdistrict: "ตลาด", zip_code: "84000",
    start_salary: 3100, range_salary: 4700, gender: "Female"
  },
  {
    findjob_id: "FJ20", first_name: "ชาญชัย", last_name: "ศรีทอง", email: "chanchai@example.com",
    job_type: "พนักงาน", skills: "แคชเชียร์,บริการ",
    job_date: "2025-05-20", start_time: "09:00:00", end_time: "17:00:00",
    job_address: "2000 ถ.เฉลิมพระเกียรติ ปัตตานี", province: "ปัตตานี",
    district: "เมืองปัตตานี", subdistrict: "รูสะมิแล", zip_code: "94000",
    start_salary: 3500, range_salary: 6000, gender: "Male"
  },
  {
    findjob_id: "FJ21", first_name: "จิตติ", last_name: "แสนดี", email: "jitti@example.com",
    job_type: "แม่บ้าน", skills: "รีดผ้า,ทำความสะอาด",
    job_date: "2025-05-21", start_time: "08:30:00", end_time: "16:30:00",
    job_address: "2100 ถ.ราชดำเนิน สุโขทัย", province: "สุโขทัย",
    district: "เมืองสุโขทัย", subdistrict: "ธานี", zip_code: "64000",
    start_salary: 2900, range_salary: 4500, gender: "Female"
  },
  {
    findjob_id: "FJ22", first_name: "ประยูร", last_name: "สง่า", email: "prayoon@example.com",
    job_type: "พนักงาน", skills: "ขับรถ,จัดส่งพัสดุ",
    job_date: "2025-05-22", start_time: "07:00:00", end_time: "15:00:00",
    job_address: "2200 ถ.บรมราชชนนี นครปฐม", province: "นครปฐม",
    district: "สามพราน", subdistrict: "อ้อมใหญ่", zip_code: "73170",
    start_salary: 3000, range_salary: 4800, gender: "Male"
  },
  {
    findjob_id: "FJ23", first_name: "ณิชาภัทร", last_name: "อยู่ดี", email: "nichapat@example.com",
    job_type: "ครูสอน", skills: "สอนภาษาไทย,สอนประวัติศาสตร์",
    job_date: "2025-05-23", start_time: "09:00:00", end_time: "17:00:00",
    job_address: "2300 ถ.สุขุมวิท ระยอง", province: "ระยอง",
    district: "เมืองระยอง", subdistrict: "ปากน้ำ", zip_code: "21000",
    start_salary: 3900, range_salary: 6200, gender: "Female"
  },
  {
    findjob_id: "FJ24", first_name: "พิชิต", last_name: "ชัยวัฒน์", email: "pichit@example.com",
    job_type: "พนักงาน", skills: "ดูแลคลังสินค้า,แพ็คสินค้า",
    job_date: "2025-05-24", start_time: "08:00:00", end_time: "16:00:00",
    job_address: "2400 ถ.เทพกระษัตรี ภูเก็ต", province: "ภูเก็ต",
    district: "เมืองภูเก็ต", subdistrict: "ตลาดใหญ่", zip_code: "83000",
    start_salary: 3200, range_salary: 5000, gender: "Male"
  },
  {
    findjob_id: "FJ25", first_name: "อรพินท์", last_name: "สุนทร", email: "orpin@example.com",
    job_type: "แม่บ้าน", skills: "ซักผ้า,รีดผ้า",
    job_date: "2025-05-25", start_time: "10:00:00", end_time: "18:00:00",
    job_address: "2500 ถ.ปทุมธานี ปทุมธานี", province: "ปทุมธานี",
    district: "เมืองปทุมธานี", subdistrict: "บางปรอก", zip_code: "12000",
    start_salary: 2800, range_salary: 4400, gender: "Female"
  }
];
