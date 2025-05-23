
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, BarChart, Check, RefreshCw } from 'lucide-react';
import { getPostJobById } from '@/services/firestoreService';
import { PostJob, MatchResult } from '@/types/types';
import JobMatchDetails from '@/components/jobs/JobMatchDetails';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { saveMatchResults, getMatchResultsByJobId, createSimpleMatch } from '@/services/matchingService';
import { calculateTextSimilarity, calculateSimpleStringSimilarity } from '@/utils/embeddingUtils';
import { calculateOverallMatchScore } from '@/utils/matchingUtils';

const AIMatchingDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth(); // Access userId from auth context
  const [job, setJob] = useState<PostJob | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasExistingMatches, setHasExistingMatches] = useState(false);
  const [useEmbeddings, setUseEmbeddings] = useState(true);
  const [modelInfo, setModelInfo] = useState("WangchanBERTa (ไทย)");

  const fetchJobAndMatches = async (forceRefresh = false) => {
    if (!jobId) return;
    
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Get job details
      const jobData = await getPostJobById(jobId);
      if (!jobData) {
        setError("ไม่พบข้อมูลงาน");
        return;
      }
      
      setJob(jobData);

      // Check if there are already confirmed matches for this job
      const existingMatches = await getMatchResultsByJobId(jobId);
      setHasExistingMatches(existingMatches.length > 0);
      
      // Fetch real find_job data from Firestore
      const findJobsRef = collection(db, "find_jobs");
      const findJobsSnapshot = await getDocs(findJobsRef);
      
      let matches: MatchResult[] = [];
      const matchPromises: Promise<MatchResult>[] = [];
      
      // Create matches from find_jobs with scoring
      findJobsSnapshot.forEach(doc => {
        const findJobData = doc.data();

        // Skip users matching with their own jobs
        if (findJobData.user_id === userId) {
          console.log(`Skipping job ${doc.id} as it belongs to the current user`);
          return;
        }
        
        matchPromises.push(
          (async () => {
            // Use new overall match scoring function
            const matchScore = await calculateOverallMatchScore(
              {
                job_type: jobData.job_type,
                province: jobData.province,
                district: jobData.district,
                subdistrict: jobData.subdistrict,
                start_time: jobData.start_time,
                end_time: jobData.end_time,
                job_date: jobData.job_date,
                salary: jobData.salary,
                detail: jobData.job_detail || jobData.detail
              },
              {
                job_type: findJobData.job_type,
                province: findJobData.province,
                district: findJobData.district,
                subdistrict: findJobData.subdistrict,
                start_time: findJobData.start_time,
                end_time: findJobData.end_time,
                job_date: findJobData.job_date || findJobData.start_date,
                expected_salary: findJobData.expected_salary || findJobData.start_salary,
                skills: findJobData.skills
              },
              useEmbeddings
            );

            // Add a slight random factor for refresh variance (small weight)
            let finalScore = matchScore;
            if (forceRefresh) {
              finalScore += (Math.random() * 0.1) - 0.05; // -0.05 to +0.05 variance
              finalScore = Math.min(Math.max(finalScore, 0), 1); // Keep in 0-1 range
            }
            
            console.log(`Match score for ${findJobData.first_name}: ${finalScore.toFixed(3)} (using WangchanBERTa)`);
            
            // Create the match object
            return {
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
              aiScore: finalScore,
              workerId: findJobData.user_id,
              user_id: findJobData.user_id,
              province: findJobData.province,
              district: findJobData.district,
              subdistrict: findJobData.subdistrict,
              skills: findJobData.skills || ""
            };
          })()
        );
      });
      
      try {
        // Wait for all match calculations to complete
        matches = await Promise.all(matchPromises);
        
        // Sort by AI score descending
        matches.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
        
        if (matches.length === 0) {
          // No candidates found
          setModelInfo("ไม่พบผู้สมัครที่เหมาะสม");
          
          if (!hasExistingMatches && jobData && forceRefresh) {
            // Create a placeholder match record with status no_candidates
            await createSimpleMatch({
              job_id: jobId,
              job_type: jobData.job_type,
              job_date: jobData.job_date,
              start_time: jobData.start_time,
              end_time: jobData.end_time,
              job_address: jobData.job_address,
              province: jobData.province,
              district: jobData.district,
              subdistrict: jobData.subdistrict,
              zip_code: jobData.zip_code,
              job_salary: jobData.salary,
              user_id: userId
            });
            
            toast.info("ไม่พบผู้สมัครที่เหมาะสม บันทึกสถานะแล้ว");
            navigate(`/status/${jobId}`);
            return;
          }
        } else {
          // Take only top 5 matches
          matches = matches.slice(0, 5);
          
          // Assign initial priority values based on AI score order
          matches = matches.map((match, index) => ({
            ...match,
            priority: index + 1
          }));
        }
        
        setMatchResults(matches);
        
        if (forceRefresh) {
          toast.success("จับคู่งานใหม่เรียบร้อยแล้ว");
        }
      } catch (error) {
        console.error("Error calculating matches:", error);
        // If embedding fails, try with simple string matching
        if (useEmbeddings) {
          setUseEmbeddings(false);
          setModelInfo("ใช้การเปรียบเทียบแบบพื้นฐาน");
          toast.error("ไม่สามารถใช้ WangchanBERTa ได้ กำลังใช้การเปรียบเทียบแบบพื้นฐานแทน");
          fetchJobAndMatches(forceRefresh);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchJobAndMatches();
  }, [jobId, userId]);

  const handleRefresh = () => {
    setUseEmbeddings(true);  // Reset to try embeddings again
    setModelInfo("WangchanBERTa (ไทย)");
    fetchJobAndMatches(true);
  };

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
          skills: match.skills || '',
          embedding_model: 'airesearch/wangchanberta-base-att-spm-uncased'
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-fastlabor-600" />
                  <CardTitle className="text-2xl">AI Matching</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? "กำลังจับคู่ใหม่..." : "จับคู่ใหม่"}
                </Button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                ใช้โมเดล: {modelInfo}
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
                  {(job.detail || job.job_detail) && (
                    <div className="mt-2">
                      <p><span className="font-medium">รายละเอียดงาน:</span> {job.detail || job.job_detail}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">แสดงงานที่มีผลการจับคู่สูงสุด 5 อันดับ</h3>
                <p className="text-sm text-gray-500 mb-4">คุณสามารถเปลี่ยนอันดับลำดับความสำคัญของผลการจับคู่ได้ด้วย</p>
              </div>
              
              {matchResults.length > 0 ? (
                <JobMatchDetails 
                  matches={matchResults} 
                  rankLimit={5} 
                  allowRanking={true} 
                  onRankChange={handleRankChange}
                  showSkills={true}
                />
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-600">ไม่พบผู้สมัครที่เหมาะสมในระบบ</p>
                  <p className="text-sm text-gray-500 mt-2">ลองปรับรายละเอียดงานหรือกดปุ่มจับคู่ใหม่</p>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleConfirmMatch}
                  disabled={submitting || matchResults.length === 0 || hasExistingMatches}
                  className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white font-medium px-6"
                >
                  <Check size={20} className="mr-2" />
                  {hasExistingMatches 
                    ? "ได้ยืนยันการจับคู่แล้ว" 
                    : submitting 
                      ? "กำลังบันทึกข้อมูล..." 
                      : matchResults.length === 0 
                        ? "ไม่พบผู้สมัครที่เหมาะสม"
                        : "ยืนยันการจับคู่"
                  }
                </Button>
              </div>
              
              {hasExistingMatches && (
                <p className="text-center mt-4 text-sm text-amber-600">
                  คุณได้ยืนยันการจับคู่ไปแล้ว ดูผลการจับคู่ได้ที่หน้า Status Matching
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIMatchingDetailPage;
