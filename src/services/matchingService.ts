
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MatchResult } from "@/types/types";
import { 
  calculateStringSimilarity, 
  calculateLocationSimilarity, 
  calculateTimeOverlap, 
  calculateDateMatch, 
  calculateSalaryMatch 
} from '@/utils/matchingUtils';
import { getPostJobById } from './firestoreService';

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

// ฟังก์ชันสำหรับการจับคู่งานและพนักงาน จาก Firestore
export const matchJobWithWorkers = async (jobId: string): Promise<MatchResult[]> => {
  try {
    // หางานจาก ID ใน Firestore
    const job = await getPostJobById(jobId);
    if (!job) {
      console.error("Job not found with ID:", jobId);
      return [];
    }
    
    console.log("Found job:", job);
    
    // ดึงข้อมูลพนักงานที่ต้องการหางานทั้งหมดจาก Firestore
    const findJobsRef = collection(db, "find_jobs");
    const findJobsSnapshot = await getDocs(findJobsRef);
    
    if (findJobsSnapshot.empty) {
      console.log("No find_jobs documents found");
      return [];
    }
    
    const findJobs: any[] = [];
    findJobsSnapshot.forEach((doc) => {
      findJobs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Found find_jobs:", findJobs.length);
    
    // คำนวณคะแนนสำหรับแต่ละพนักงาน
    const matchResults = await Promise.all(findJobs.map(async (worker) => {
      const score = calculateMatchingScore(job, worker);
      
      // สร้าง full name จาก first_name และ last_name
      const fullName = `${worker.first_name || ''} ${worker.last_name || ''}`.trim() || 'ไม่ระบุชื่อ';
      
      return {
        name: fullName,
        gender: worker.gender || 'ไม่ระบุ',
        jobType: worker.job_type || 'ไม่ระบุ',
        date: worker.job_date || 'ไม่ระบุ',
        time: `${worker.start_time || '00:00'} - ${worker.end_time || '00:00'}`,
        location: `${worker.province || ''}/${worker.district || ''}/${worker.subdistrict || ''}`,
        salary: worker.start_salary || 0,
        aiScore: score,
        workerId: worker.findjob_id || worker.id // ใช้ findjob_id ถ้ามี ไม่งั้นใช้ doc ID
      };
    }));
    
    console.log("Calculated match results:", matchResults);
    
    // เรียงลำดับตามคะแนน (มากไปน้อย) และจำกัดให้แสดงเพียง 5 อันดับแรก
    return matchResults.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 5);
  } catch (error) {
    console.error("Error in matchJobWithWorkers:", error);
    return [];
  }
};
