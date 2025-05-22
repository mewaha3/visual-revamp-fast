import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from "@/context/AuthContext";
import { getJobById } from "@/services/jobService";
import { getJobMatchDetails } from "@/services/matchingService";
import JobHeader from "@/components/jobs/JobHeader";
import JobDetailsCard from "@/components/jobs/JobDetailsCard";
import JobMatchDetails from "@/components/jobs/JobMatchDetails";
import { toast } from "sonner";

const StatusMatchingPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobAndMatches = async () => {
      if (!jobId || !userId) {
        setError("ไม่พบข้อมูลงานหรือผู้ใช้");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get the job details first
        const job = await getJobById(jobId);
        
        // Check if the job exists and belongs to the current user
        if (!job) {
          setError("ไม่พบข้อมูลงาน");
          setIsLoading(false);
          return;
        }

        if (job.user_id !== userId) {
          setError("คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้");
          setIsLoading(false);
          return;
        }

        setJobDetails(job);

        // Get the match details for this job
        const matchResults = await getJobMatchDetails(jobId);
        setMatches(matchResults || []);
      } catch (error) {
        console.error("Error fetching job and matches:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobAndMatches();
  }, [jobId, userId]);

  const handleViewDetails = (jobId: string, matchId?: string) => {
    if (matchId) {
      // If we have a matchId, go to the accepted job detail page
      navigate(`/accepted-job/${matchId}`);
    } else {
      // Otherwise go to the standard job detail page
      navigate(`/job-detail/${jobId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <JobHeader backTo="/my-jobs" backLabel="กลับไปยังรายการงานของฉัน" />

          {isLoading ? (
            <div className="text-center py-8">
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              {jobDetails && <JobDetailsCard jobDetails={jobDetails} />}
              <JobMatchDetails 
                matches={matches} 
                showViewButton={true} 
                onViewDetails={handleViewDetails}
                hideButtonForStatus={["declined", "on_queue"]}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StatusMatchingPage;
