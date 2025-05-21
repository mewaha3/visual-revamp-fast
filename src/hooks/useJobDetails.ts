
import { useState, useEffect } from 'react';
import { getJobDetails } from '@/services/jobDetailsService';
import { getEmployerDetails } from '@/services/employerService';
import { JobDetail, Employer } from '@/types/types';
import { toast } from "sonner";

export const useJobDetails = (jobId?: string) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [employer, setEmployer] = useState<Employer | null>(null);
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
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("ไม่สามารถโหลดข้อมูลได้");
        toast.error("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        
        // Reset job and employer data to ensure we don't show stale data
        setJobDetails(null);
        setEmployer(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
  return { jobDetails, employer, loading, error };
};
