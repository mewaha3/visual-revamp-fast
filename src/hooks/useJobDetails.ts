
import { useState, useEffect } from 'react';
import { getJobDetails } from '@/services/jobDetailsService';
import { getEmployerDetails } from '@/services/employerService';
import { JobDetail, Employer, MatchResult } from '@/types/types';
import { toast } from "sonner";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

export const useJobDetails = (jobId?: string) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [matchDetails, setMatchDetails] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching details for job ID: ${jobId}`);
        
        // Get job details from Firebase
        const details = await getJobDetails(jobId);
        console.log("Job details fetched:", details);
        setJobDetails(details);
        
        // Get employer details
        const employerInfo = await getEmployerDetails(jobId);
        console.log("Employer details fetched:", employerInfo);
        setEmployer(employerInfo);
        
        // Get match_results related to this job
        const matchResultsRef = collection(db, "match_results");
        const q = query(matchResultsRef, where("job_id", "==", jobId));
        const querySnapshot = await getDocs(q);
        
        const matchResults: MatchResult[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          matchResults.push({
            id: doc.id,
            job_id: data.job_id,
            findjob_id: data.findjob_id,
            name: `${data.first_name} ${data.last_name}`,
            gender: data.gender,
            jobType: data.job_type || details.job_type,
            date: data.job_date || details.job_date,
            time: `${data.start_time || details.start_time} - ${data.end_time || details.end_time}`,
            location: `${data.province || details.province}/${data.district || details.district}/${data.subdistrict || details.subdistrict}`,
            salary: data.job_salary || details.salary,
            status: data.status,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            // Additional nested fields
            first_name_post_jobs: data.first_name_post_jobs,
            last_name_post_jobs: data.last_name_post_jobs,
            gender_post_jobs: data.gender_post_jobs,
            first_name_find_jobs: data.first_name_find_jobs,
            last_name_find_jobs: data.last_name_find_jobs,
            gender_find_jobs: data.gender_find_jobs
          });
        });
        
        setMatchDetails(matchResults);
        console.log("Match results fetched:", matchResults);
        
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("ไม่สามารถโหลดข้อมูลได้");
        toast.error("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        
        // Reset job and employer data to ensure we don't show stale data
        setJobDetails(null);
        setEmployer(null);
        setMatchDetails([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
  return { jobDetails, employer, matchDetails, loading, error };
};
