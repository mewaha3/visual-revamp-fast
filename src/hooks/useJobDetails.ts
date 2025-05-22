
import { useState, useEffect } from 'react';
import { getJobDetails } from '@/services/jobDetailsService';
import { getEmployerDetails } from '@/services/employerService';
import { JobDetail, Employer, MatchResult } from '@/types/types';
import { toast } from "sonner";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

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
        
        // First check if this job exists in match_results collection
        const matchResultsRef = collection(db, "match_results");
        const matchQuery = query(matchResultsRef, where("job_id", "==", jobId));
        const matchSnapshot = await getDocs(matchQuery);
        
        if (!matchSnapshot.empty) {
          // We found match results, use the first one to get job details
          const matchData = matchSnapshot.docs[0].data();
          
          // Construct job details from match data
          const jobData: JobDetail = {
            id: jobId,
            job_id: matchData.job_id,
            job_type: matchData.job_type || "",
            detail: matchData.job_detail || "",
            job_detail: matchData.job_detail || "",
            job_date: matchData.job_date || "",
            start_time: matchData.start_time || "",
            end_time: matchData.end_time || "",
            job_address: matchData.job_address || "",
            salary: matchData.job_salary || 0,
            province: matchData.province || "",
            district: matchData.district || "",
            subdistrict: matchData.subdistrict || "",
            status: matchData.status,
            zip_code: matchData.zip_code || ""
          };
          
          setJobDetails(jobData);
          
          // Construct employer information from match data
          if (matchData.first_name_post_jobs && matchData.last_name_post_jobs) {
            const employerData: Employer = {
              id: jobId,
              first_name: matchData.first_name_post_jobs,
              last_name: matchData.last_name_post_jobs,
              name: `${matchData.first_name_post_jobs} ${matchData.last_name_post_jobs}`.trim(),
              email: matchData.email_post_jobs || "",
              phone: matchData.phone_post_jobs || ""
            };
            setEmployer(employerData);
          } else {
            // Fallback to basic employer info
            const employerData: Employer = {
              id: jobId,
              first_name: matchData.first_name || "",
              last_name: matchData.last_name || "",
              name: `${matchData.first_name || ""} ${matchData.last_name || ""}`.trim() || "ไม่ระบุชื่อ",
              email: matchData.email || ""
            };
            setEmployer(employerData);
          }
        } else {
          // If not in match_results, try to get from post_jobs
          const details = await getJobDetails(jobId);
          console.log("Job details fetched from post_jobs:", details);
          setJobDetails(details);
          
          // Get employer details
          const employerInfo = await getEmployerDetails(jobId);
          console.log("Employer details fetched:", employerInfo);
          
          // Make sure we have a name property
          if (employerInfo) {
            employerInfo.name = `${employerInfo.first_name || ""} ${employerInfo.last_name || ""}`.trim() || "ไม่ระบุชื่อ";
          }
          
          setEmployer(employerInfo);
        }
        
        // Get match_results related to this job
        const matchResults: MatchResult[] = [];
        matchSnapshot.forEach((doc) => {
          const data = doc.data();
          matchResults.push({
            id: doc.id,
            job_id: data.job_id,
            findjob_id: data.findjob_id,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "ไม่ระบุชื่อ",
            gender: data.gender,
            jobType: data.job_type,
            date: data.job_date,
            time: `${data.start_time || ""} - ${data.end_time || ""}`,
            location: `${data.province || ""}/${data.district || ""}/${data.subdistrict || ""}`,
            province: data.province || "",
            district: data.district || "",
            subdistrict: data.subdistrict || "",
            salary: data.job_salary || 0,
            status: data.status,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            workerId: data.workerId,
            start_time: data.start_time,
            end_time: data.end_time,
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
