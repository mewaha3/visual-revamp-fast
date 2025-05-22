
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, BarChart, Check } from 'lucide-react';
import { getPostJobById } from '@/services/firestoreService';
import { PostJob, MatchResult } from '@/types/types';
import JobMatchDetails from '@/components/jobs/JobMatchDetails';
import { db } from '@/lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { saveMatchResults } from '@/services/matchingService';

const AIMatchingDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth(); // Access userId from auth context
  const [job, setJob] = useState<PostJob | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobAndMatches = async () => {
      if (!jobId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get job details
        const jobData = await getPostJobById(jobId);
        if (!jobData) {
          setError("ไม่พบข้อมูลงาน");
          return;
        }
        
        setJob(jobData);
        
        // Fetch real find_job data from Firestore
        const findJobsRef = collection(db, "find_jobs");
        const findJobsSnapshot = await getDocs(findJobsRef);
        
        let matches: MatchResult[] = [];
        
        // Create matches from find_jobs with scoring
        findJobsSnapshot.forEach(doc => {
          const findJobData = doc.data();

          // Skip users matching with their own jobs
          if (findJobData.user_id === userId) {
            console.log(`Skipping job ${doc.id} as it belongs to the current user`);
            return;
          }
          
          // Calculate match score based on multiple factors
          let matchScore = 0;
          
          // Job type match (high weight)
          if (findJobData.job_type === jobData.job_type) {
            matchScore += 0.4;
          }
          
          // Location match (medium weight)
          if (findJobData.province === jobData.province) {
            matchScore += 0.2;
            
            if (findJobData.district === jobData.district) {
              matchScore += 0.1;
              
              if (findJobData.subdistrict === jobData.subdistrict) {
                matchScore += 0.1;
              }
            }
          }
          
          // Time preference match (medium weight)
          const jobStartTime = jobData.start_time ? parseInt(jobData.start_time.replace(':', '')) : 0;
          const jobEndTime = jobData.end_time ? parseInt(jobData.end_time.replace(':', '')) : 0;
          const findJobStartTime = findJobData.start_time ? parseInt(findJobData.start_time.replace(':', '')) : 0;
          const findJobEndTime = findJobData.end_time ? parseInt(findJobData.end_time.replace(':', '')) : 0;
          
          // If time ranges overlap
          if (findJobStartTime <= jobEndTime && findJobEndTime >= jobStartTime) {
            matchScore += 0.2;
          }
          
          // Create the match object
          matches.push({
            id: doc.id,
            findjob_id: findJobData.findjob_id || doc.id,
            job_id: jobId,
            name: `${findJobData.first_name || ''} ${findJobData.last_name || ''}`.trim() || "ไม่ระบุชื่อ",
            first_name: findJobData.first_name,
            last_name: findJobData.last_name,
            gender: findJobData.gender || "ไม่ระบุ",
            jobType: findJobData.job_type,
            job_type: findJobData.job_type,
            date: findJobData.job_date || findJobData.start_date,
            time: `${findJobData.start_time || "00:00"} - ${findJobData.end_time || "00:00"}`,
            start_time: findJobData.start_time,
            end_time: findJobData.end_time,
            location: `${findJobData.province || ""}/${findJobData.district || ""}/${findJobData.subdistrict || ""}`,
            salary: findJobData.expected_salary || findJobData.start_salary || 0,
            email: findJobData.email || "",
            aiScore: matchScore,
            workerId: findJobData.user_id,
            user_id: findJobData.user_id,
            province: findJobData.province,
            district: findJobData.district,
            subdistrict: findJobData.subdistrict,
            skills: findJobData.skills || ""
          });
        });
        
        // Sort by AI score descending
        matches.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
        
        // Take only top 5 matches
        matches = matches.slice(0, 5);
        
        // Assign initial priority values based on AI score order
        matches = matches.map((match, index) => ({
          ...match,
          priority: index + 1
        }));
        
        setMatchResults(matches);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobAndMatches();
  }, [jobId, userId]);

  const handleRankChange = (matchId: string, newRank: number) => {
    // Update the local matches array with the new rank
    const updatedMatches = [...matchResults];
    const matchIndex = updatedMatches.findIndex(match => match.id === matchId);
    
    if (matchIndex !== -1) {
      // Get the old rank
      const oldRank = updatedMatches[matchIndex].priority || 0;
      
      if (oldRank === newRank) return; // No change needed
      
      // Update all matches that are affected by the rank change
      updatedMatches.forEach(match => {
        if (match.id === matchId) {
          match.priority = newRank;
        } else if (oldRank < newRank && match.priority && match.priority > oldRank && match.priority <= newRank) {
          // Moving down in rank (increasing number), decrease others in between
          match.priority = (match.priority - 1);
        } else if (oldRank > newRank && match.priority && match.priority >= newRank && match.priority < oldRank) {
          // Moving up in rank (decreasing number), increase others in between
          match.priority = (match.priority + 1);
        }
      });
      
      setMatchResults([...updatedMatches]);
    }
  };
  
  const handleConfirmMatch = async () => {
    if (!jobId || matchResults.length === 0 || !job) return;
    
    setSubmitting(true);
    
    try {
      // Save matches with their current ranks (based on array position)
      for (const match of matchResults) {
        await saveMatchResults({
          job_id: jobId,
          findjob_id: match.findjob_id || '',
          priority: match.priority || 0,
          status: 'on_queue',
          // Job details
          job_type: job.job_type,
          job_date: job.job_date,
          start_time: job.start_time,
          end_time: job.end_time,
          job_address: job.job_address,
          province: job.province,
          district: job.district,
          subdistrict: job.subdistrict,
          zip_code: job.zip_code,
          job_salary: job.salary,
          // Worker details
          first_name: match.first_name || '',
          last_name: match.last_name || '',
          gender: match.gender || '',
          email: match.email || '',
          workerId: match.workerId || '',
          skills: match.skills || ''
        });
      }
      
      toast.success("บันทึกการจับคู่เรียบร้อยแล้ว");
      navigate(`/status/${jobId}`);
    } catch (error) {
      console.error("Error saving match results:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-6">
          <div className="container mx-auto px-4">
            <p className="text-center">กำลังโหลดข้อมูล...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-6">
          <div className="container mx-auto px-4">
            <p className="text-center text-red-500">{error}</p>
            <Button 
              onClick={() => navigate("/my-jobs")}
              className="mx-auto block mt-4"
            >
              กลับไปยังรายการงาน
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate('/my-jobs')}
          >
            <ArrowLeft size={16} className="mr-2" />
            กลับไปยังรายการงาน
          </Button>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-fastlabor-600" />
                <CardTitle className="text-2xl">AI Matching</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Job ID: {jobId}</h2>
              
              {job && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">รายละเอียดงาน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">ประเภทงาน:</span> {job.job_type}</p>
                      <p><span className="font-medium">วันที่:</span> {job.job_date}</p>
                      <p><span className="font-medium">เวลา:</span> {job.start_time} - {job.end_time}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">สถานที่:</span> {job.job_address}</p>
                      <p><span className="font-medium">ตำแหน่ง:</span> {job.province}/{job.district}/{job.subdistrict}</p>
                      <p><span className="font-medium">รหัสไปรษณีย์:</span> {job.zip_code || "ไม่ระบุ"}</p>
                      <p><span className="font-medium">ค่าตอบแทน:</span> {job.salary} บาท</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">แสดงงานที่มีผลการจับคู่สูงสุด 5 อันดับ</h3>
                <p className="text-sm text-gray-500 mb-4">คุณสามารถเปลี่ยนอันดับลำดับความสำคัญของผลการจับคู่ได้ด้วย</p>
              </div>
              
              <JobMatchDetails 
                matches={matchResults} 
                rankLimit={5} 
                allowRanking={true} 
                onRankChange={handleRankChange}
                showSkills={true}
              />
              
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleConfirmMatch}
                  disabled={submitting || matchResults.length === 0}
                  className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white font-medium px-6"
                >
                  <Check size={20} className="mr-2" />
                  {submitting ? "กำลังบันทึกข้อมูล..." : "ยืนยันการจับคู่"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIMatchingDetailPage;
