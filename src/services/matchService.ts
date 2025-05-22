
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Define the JobMatch interface to match the expected fields in AIMatchingPage
export interface JobMatch {
  id: string;
  employer_name: string;
  job_type: string;
  district: string;
  province: string;
  job_date: string;
  start_time: string;
  end_time: string;
  start_salary: number;
  range_salary: number;
  skills: string[];
  job_id: string;
}

// Get job matches for a specific user
export async function getJobMatches(userId: string): Promise<JobMatch[]> {
  try {
    // Mock data for testing
    // In a real implementation, this would fetch from Firestore
    const mockMatches: JobMatch[] = [
      {
        id: "match1",
        job_id: "job123",
        employer_name: "บริษัท เอบีซี จำกัด",
        job_type: "แม่บ้าน",
        district: "บางรัก",
        province: "กรุงเทพมหานคร",
        job_date: "2025-06-15",
        start_time: "09:00",
        end_time: "17:00",
        start_salary: 400,
        range_salary: 600,
        skills: ["ทำความสะอาด", "ซักรีด"]
      },
      {
        id: "match2",
        job_id: "job456",
        employer_name: "คุณสมศักดิ์ มีทรัพย์",
        job_type: "คนสวน",
        district: "ปทุมวัน",
        province: "กรุงเทพมหานคร",
        job_date: "2025-06-20",
        start_time: "08:00",
        end_time: "16:00",
        start_salary: 450,
        range_salary: 550,
        skills: ["ตัดหญ้า", "ดูแลต้นไม้"]
      }
    ];
    
    return mockMatches;
    
    // Actual Firestore implementation would be:
    /*
    const matchesRef = collection(db, "matches");
    const q = query(matchesRef, where("worker_id", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const matches: JobMatch[] = [];
    querySnapshot.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() } as JobMatch);
    });
    
    return matches;
    */
  } catch (error) {
    console.error("Error fetching job matches:", error);
    return [];
  }
}
