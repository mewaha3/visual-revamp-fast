
import { useState, useEffect } from 'react';
import { getJobDetails, getEmployerDetails } from '@/services/matchService';
import { JobDetail, Employer } from '@/types/types';
import { toast } from "sonner";

export const useJobDetails = (jobId?: string) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      
      setLoading(true);
      try {
        // Get job details
        const details = await getJobDetails(jobId);
        setJobDetails(details);
        
        // Get employer details
        const employerInfo = await getEmployerDetails(jobId);
        setEmployer(employerInfo);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          description: "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);
  
  return { jobDetails, employer, loading };
};
