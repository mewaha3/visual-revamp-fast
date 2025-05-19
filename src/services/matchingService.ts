
import { postJobs } from "@/data/postJobs";
import { findJobs } from "@/data/findJobs";
import { MatchResult } from "@/types/types";
import { 
  calculateStringSimilarity, 
  calculateLocationSimilarity, 
  calculateTimeOverlap, 
  calculateDateMatch, 
  calculateSalaryMatch 
} from '@/utils/matchingUtils';
import { matchedWorkers } from './workerService';

// ฟังก์ชันคำนวณคะแนนรวมสำหรับการจับคู่
export const calculateMatchingScore = (job: any, worker: any): number => {
  // น้ำหนักของแต่ละเกณฑ์
  const weights = {
    jobType: 0.2,    // ประเภทงานเดียวกัน
    skills: 0.2,     // ทักษะตรงกัน
    location: 0.2,   // ตำแหน่งที่ตั้งใกล้เคียงกัน
    time: 0.1,       // เวลาทำงานตรงกัน
    date: 0.1,       // วันทำงานตรงกัน
    salary: 0.2      // เงินเดือนสอดคล้องกัน
  };
  
  // คำนวณคะแนนแต่ละด้าน
  const jobTypeScore = job.job_type.toLowerCase() === worker.job_type.toLowerCase() ? 1.0 : 0.0;
  
  // คะแนนความคล้ายคลึงของงาน/ทักษะ
  let skillsScore = 0;
  if (job.job_detail && worker.skills) {
    skillsScore = calculateStringSimilarity(job.job_detail, worker.skills);
  }
  
  // คะแนนตำแหน่งที่ตั้ง
  const locationScore = calculateLocationSimilarity(
    job.province, job.district, job.subdistrict,
    worker.province, worker.district, worker.subdistrict
  );
  
  // คะแนนเวลาทำงาน
  const timeScore = calculateTimeOverlap(job.start_time, job.end_time, worker.start_time, worker.end_time);
  
  // คะแนนวันทำงาน
  const dateScore = calculateDateMatch(job.job_date, worker.job_date);
  
  // คะแนนเงินเดือน
  const salaryScore = calculateSalaryMatch(job.salary, worker.start_salary, worker.range_salary);
  
  // คำนวณคะแนนรวม
  const finalScore = 
    weights.jobType * jobTypeScore +
    weights.skills * skillsScore +
    weights.location * locationScore +
    weights.time * timeScore +
    weights.date * dateScore +
    weights.salary * salaryScore;
  
  return finalScore;
};

// ฟังก์ชันสำหรับการจับคู่งานและพนักงาน
export const matchJobWithWorkers = (jobId: string): MatchResult[] => {
  // หางานจาก ID
  const job = postJobs.find(job => job.job_id === jobId);
  if (!job) {
    return [];
  }
  
  // คำนวณคะแนนสำหรับแต่ละพนักงาน
  const matchedWorkers = findJobs.map(worker => {
    const score = calculateMatchingScore(job, worker);
    
    return {
      name: `${worker.first_name} ${worker.last_name}`,
      gender: worker.gender,
      jobType: worker.job_type,
      date: worker.job_date,
      time: `${worker.start_time} - ${worker.end_time}`,
      location: `${worker.province}/${worker.district}/${worker.subdistrict}`,
      salary: worker.start_salary,
      aiScore: score
    };
  });
  
  // เรียงลำดับตามคะแนน (มากไปน้อย) และจำกัดให้แสดงเพียง 5 อันดับแรก
  return matchedWorkers.sort((a, b) => b.aiScore - a.aiScore).slice(0, 5);
};
