import { MatchResult, StatusResult } from "@/types/types";
import { postJobs } from "@/data/postJobs";
import { findJobs } from "@/data/findJobs";

export const getJobById = (jobId: string) => {
  return postJobs.find(job => job.job_id === jobId) || null;
};

export const getUserJobs = (email: string | null) => {
  if (!email) return [];
  return postJobs.filter(job => job.email === email);
};

// คำนวณคะแนนความคล้ายกันระหว่างสตริง
const calculateStringSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // ตัดคำและเปรียบเทียบคำที่ตรงกัน
  const words1 = s1.split(/\s+|,/).filter(Boolean);
  const words2 = s2.split(/\s+|,/).filter(Boolean);
  
  // หาจำนวนคำที่มีร่วมกัน
  const commonWords = words1.filter(word => words2.includes(word)).length;
  
  // คำนวณคะแนนความคล้ายคลึง
  const similarity = commonWords / Math.max(words1.length, words2.length, 1);
  return similarity;
};

// คำนวณคะแนนความใกล้เคียงของตำแหน่งที่ตั้ง
const calculateLocationSimilarity = (
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
const calculateTimeOverlap = (
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
const calculateDateMatch = (date1: string, date2: string): number => {
  // เปรียบเทียบแบบง่าย ถ้าวันที่ตรงกันให้คะแนนเต็ม ถ้าไม่ตรงให้ 0
  return date1 === date2 ? 1.0 : 0.0;
};

// คำนวณความสอดคล้องของเงินเดือน
const calculateSalaryMatch = (jobSalary: number, workerMinSalary: number, workerMaxSalary: number): number => {
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

// ฟังก์ชันคำนวณคะแนนรวมสำหรับการจับคู่
const calculateMatchingScore = (job: any, worker: any): number => {
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

// Store confirmed matches by jobId
const confirmedMatches: Record<string, boolean> = {};

// Mock worker data for job details
const matchedWorkers: Record<string, { 
  name: string;
  gender: string;
  skills: string;
  jobType: string;
  workerId: string;
}> = {};

// Function to get worker by ID
export const getWorkerById = (workerId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find worker in findJobs data based on workerId
      const worker = findJobs.find(w => w.findjob_id === workerId);
      
      if (worker) {
        resolve({
          name: `${worker.first_name} ${worker.last_name}`,
          gender: worker.gender,
          skills: worker.skills,
          jobType: worker.job_type
        });
      } else {
        // Mock data if worker not found
        resolve({
          name: "สมชาย ใจดี",
          gender: "Male",
          skills: "ทำความสะอาด, ซักผ้า",
          jobType: "แม่บ้าน"
        });
      }
    }, 300);
  });
};

// Function to confirm matches for a job
export const confirmMatches = (jobId: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      confirmedMatches[jobId] = true;
      resolve({ success: true });
    }, 300);
  });
};

// Function to check if matches are confirmed for a job
export const isMatchesConfirmed = (jobId: string): boolean => {
  return !!confirmedMatches[jobId];
};

// ฟังก์ชันสำหรับการจับค��่งานและพนักงาน
const matchJobWithWorkers = (jobId: string): MatchResult[] => {
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

export const getMatchingResults = (jobId: string): Promise<{ matches: MatchResult[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches = matchJobWithWorkers(jobId);
      resolve({ matches });
    }, 500);
  });
};

export const getStatusResults = (jobId: string): Promise<{ status: StatusResult[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // If matches aren't confirmed yet, return an empty array
      if (!confirmedMatches[jobId]) {
        resolve({ status: [] });
        return;
      }
      
      // ใช้ผลลัพธ์จากการจับคู่ AI แล้วเพิ่มสถานะ
      const matches = matchJobWithWorkers(jobId);
      
      // กำหนดสถานะจำลอง - แค่ 5 อันดับแรก
      const statusResults: StatusResult[] = matches.map((match, index) => {
        // Determine worker ID from name for linking to job detail
        const workerId = `FJ${index + 1}`;
        
        // Assign status based on index
        let status: 'on_queue' | 'accepted' | 'declined' | 'job_done' = 'job_done';
        if (index === 0) {
          status = 'on_queue';
        } else if (index === 1) {
          status = 'accepted';
        } else if (index === 2) {
          status = 'declined';
        }
        
        return {
          ...match,
          status,
          workerId
        };
      });
      
      resolve({ status: statusResults });
    }, 500);
  });
};
