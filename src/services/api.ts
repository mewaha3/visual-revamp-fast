
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

export const getMatchingResults = (jobId: string): Promise<{ matches: MatchResult[] }> => {
  // Simulating API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMatches: MatchResult[] = [
        {
          name: "สมชาย สุขใจดี",
          gender: "Male",
          jobType: "คนขับรถ",
          date: "2025-05-01 to 2025-05-02",
          time: "8:00:00 - 16:00:00",
          location: "กรุงเทพฯ/เขต1/แขวง31",
          salary: 4000,
          aiScore: 0.92
        },
        {
          name: "www wwwz",
          gender: "Male",
          jobType: "คนขับรถ",
          date: "2025-05-17 to 2025-05-17",
          time: "08:00:00 - 18:45:00",
          location: "กรุงเทพฯ/หนองจอก/ลำตะคอง/คลองสอง",
          salary: 1250,
          aiScore: 0.84
        },
        {
          name: "วิเชษฐ์ ไพบูลย์",
          gender: "Male",
          jobType: "คนขับรถ",
          date: "2025-05-03 to 2025-05-04",
          time: "10:00:00 - 18:00:00",
          location: "เชียงใหม่/สันทราย/ต้นเปา",
          salary: 3400,
          aiScore: 0.78
        },
        {
          name: "จันทร์พร สะอาดตา",
          gender: "Female",
          jobType: "คนขับรถ",
          date: "2025-05-04 to 2025-05-05",
          time: "11:00:00 - 19:00:00",
          location: "เชียงราย/เชียงแสน/ตำบล3",
          salary: 3600,
          aiScore: 0.65
        },
        {
          name: "สุเทพ ประเสริฐ",
          gender: "Male",
          jobType: "คนขับรถ",
          date: "2025-05-05 to 2025-05-06",
          time: "12:00:00 - 20:00:00",
          location: "เชียงเหนือ/เชียงเหนือพัฒนา/ตำบล4",
          salary: 3800,
          aiScore: 0.45
        }
      ];
      
      resolve({ matches: mockMatches });
    }, 500);
  });
};

export const getStatusResults = (jobId: string): Promise<{ status: StatusResult[] }> => {
  // Simulating API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockStatus: StatusResult[] = [
        {
          name: "สมชาย สุขใจดี",
          gender: "Male",
          jobType: "คนขับรถ",
          date: "2025-05-01 to 2025-05-02",
          time: "8:00:00 - 16:00:00",
          location: "กรุงเทพฯ/เขต1/แขวง31",
          salary: 4000,
          aiScore: 0.92,
          status: "on_queue"
        },
        {
          name: "www www",
          gender: "Male",
          jobType: "คนขับรถ",
          date: "2025-05-17 to 2025-05-17",
          time: "08:00:00 - 18:45:00",
          location: "กรุงเทพฯ/หนองจอก/ลำตะคอง/คลองสอง",
          salary: 1250,
          aiScore: 0.84,
          status: "job_done"
        }
      ];
      
      resolve({ status: mockStatus });
    }, 500);
  });
};
