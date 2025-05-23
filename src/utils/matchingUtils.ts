
import { calculateTextSimilarity, calculateSimpleStringSimilarity } from './embeddingUtils';

// คำนวณคะแนนความคล้ายกันระหว่างสตริง
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  return calculateSimpleStringSimilarity(str1, str2);
};

// คำนวณคะแนนความใกล้เคียงของตำแหน่งที่ตั้ง
export const calculateLocationSimilarity = (
  job1Province: string, 
  job1District: string, 
  job1Subdistrict: string, 
  job2Province: string, 
  job2District: string, 
  job2Subdistrict: string
): number => {
  if (job1Province === job2Province) {
    if (job1District === job2District) {
      if (job1Subdistrict === job2Subdistrict) {
        return 1.0; // ตรงกันทั้งหมด
      }
      return 0.8; // ตรงกันแค่จังหวัดและอำเภอ
    }
    return 0.5; // ตรงกันแค่จังหวัด
  }
  return 0.0; // ไม่ตรงกันเลย
};

// คำนวณความสอดคล้องของเวลา
export const calculateTimeOverlap = (
  startTime1: string, 
  endTime1: string, 
  startTime2: string, 
  endTime2: string
): number => {
  const parseTime = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // แปลงเป็นนาที
  };
  
  const start1 = parseTime(startTime1);
  const end1 = parseTime(endTime1);
  const start2 = parseTime(startTime2);
  const end2 = parseTime(endTime2);
  
  // ตรวจสอบว่ามีช่วงเวลาที่ซ้อนทับกันหรือไม่
  if (end1 <= start2 || end2 <= start1) {
    return 0; // ไม่มีการซ้อนทับ
  }
  
  // คำนวณช่วงเวลาที่ซ้อนทับกัน
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  const overlapDuration = overlapEnd - overlapStart;
  
  // คำนวณความยาวของช่วงเวลาทั้งสอง
  const duration1 = end1 - start1;
  const duration2 = end2 - start2;
  const maxDuration = Math.max(duration1, duration2);
  
  return overlapDuration / maxDuration;
};

// คำนวณความตรงกันของวันที่
export const calculateDateMatch = (date1: string, date2: string): number => {
  // เปรียบเทียบแบบง่าย ถ้าวันที่ตรงกันให้คะแนนเต็ม ถ้าไม่ตรงให้ 0
  return date1 === date2 ? 1.0 : 0.0;
};

// คำนวณความสอดคล้องของเงินเดือน
export const calculateSalaryMatch = (jobSalary: number, workerMinSalary: number, workerMaxSalary: number): number => {
  if (jobSalary >= workerMinSalary && jobSalary <= workerMaxSalary) {
    return 1.0; // อยู่ในช่วงที่ต้องการพอดี
  }
  
  // หากเงินเดือนงานน้อยกว่าเงินเดือนขั้นต่ำของพนักงาน
  if (jobSalary < workerMinSalary) {
    const diff = workerMinSalary - jobSalary;
    const maxDiff = workerMinSalary * 0.5; // สมมติว่าต่างกันได้ไม่เกิน 50% ของเงินเดือนขั้นต่ำ
    return Math.max(0, 1 - (diff / maxDiff));
  }
  
  // หากเงินเดือนงานมากกว่าเงินเดือนขั้นสูงของพนักงาน (กรณีนี้น่าจะไม่มีปัญหา แต่เราให้คะแนนตามสัดส่วน)
  const diff = jobSalary - workerMaxSalary;
  const maxDiff = workerMaxSalary * 0.5; // สมมติว่าต่างกันได้ไม่เกิน 50% ของเงินเดือนขั้นสูง
  return Math.max(0, 1 - (diff / maxDiff));
};

// ฟังก์ชั่นใหม่: คำนวณความเหมาะสมของงาน
export const calculateJobDescriptionMatch = async (
  jobDescription: string,
  workerSkills: string,
  useEmbeddings: boolean = true
): Promise<number> => {
  if (!jobDescription || !workerSkills) {
    return 0;
  }
  
  try {
    if (useEmbeddings) {
      // ใช้ text embeddings model - WangchanBERTa
      return await calculateTextSimilarity(jobDescription, workerSkills);
    } else {
      // ใช้วิธีเปรียบเทียบแบบง่าย
      return calculateSimpleStringSimilarity(jobDescription, workerSkills);
    }
  } catch (error) {
    console.error('Error calculating job description match:', error);
    return calculateSimpleStringSimilarity(jobDescription, workerSkills);
  }
};

// ฟังก์ชั่นใหม่: คำนวณคะแนนการจับคู่โดยรวม
export const calculateOverallMatchScore = async (
  job: {
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    start_time: string;
    end_time: string;
    job_date: string;
    salary: number;
    detail?: string;
  },
  worker: {
    job_type: string;
    province: string;
    district: string;
    subdistrict: string;
    start_time: string;
    end_time: string;
    job_date?: string;
    expected_salary?: number;
    skills?: string;
  },
  useEmbeddings: boolean = true
): Promise<number> => {
  let score = 0;
  // ปรับน้ำหนักให้ความสำคัญกับ job description มากขึ้นเนื่องจาก WangchanBERTa มีความแม่นยำสำหรับภาษาไทย
  let weights = {
    jobType: 0.15,
    location: 0.15,
    time: 0.1,
    date: 0.1,
    jobDescription: 0.4,  // เพิ่มน้ำหนักของ WangchanBERTa embeddings
    salary: 0.1
  };
  
  // Job type match
  if (job.job_type === worker.job_type) {
    score += weights.jobType;
  }
  
  // Location match
  score += calculateLocationSimilarity(
    job.province, job.district, job.subdistrict,
    worker.province, worker.district, worker.subdistrict
  ) * weights.location;
  
  // Time match
  if (job.start_time && job.end_time && worker.start_time && worker.end_time) {
    score += calculateTimeOverlap(
      job.start_time, job.end_time,
      worker.start_time, worker.end_time
    ) * weights.time;
  }
  
  // Date match
  if (job.job_date && worker.job_date) {
    score += calculateDateMatch(job.job_date, worker.job_date) * weights.date;
  }
  
  // Job description and skills match with WangchanBERTa
  if (job.detail && worker.skills) {
    const descriptionScore = await calculateJobDescriptionMatch(
      job.detail,
      worker.skills,
      useEmbeddings
    );
    score += descriptionScore * weights.jobDescription;
  }
  
  return Math.min(Math.max(score, 0), 1); // Ensure score is between 0 and 1
};
