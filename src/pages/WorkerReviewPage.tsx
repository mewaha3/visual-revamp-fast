
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitReview } from '@/services/reviewService';
import { Slider } from "@/components/ui/slider";

interface EmployerInfo {
  firstName: string;
  lastName: string;
  userId: string;
  jobType?: string;
}

const WorkerReviewPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { userId, userFullName } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [employerInfo, setEmployerInfo] = useState<EmployerInfo | null>(null);
  
  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId || !userId) {
        setError('ข้อมูลไม่ครบถ้วน');
        setLoading(false);
        return;
      }

      try {
        // Get the match document
        const matchDocRef = doc(db, "match_results", matchId);
        const matchDoc = await getDoc(matchDocRef);
        
        if (!matchDoc.exists()) {
          setError('ไม่พบข้อมูลงาน');
          setLoading(false);
          return;
        }
        
        const matchData = matchDoc.data();
        
        // Check if this match belongs to the current user
        if (userId !== matchData.workerId) {
          setError('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
          setLoading(false);
          return;
        }
        
        // Get employer info
        setEmployerInfo({
          firstName: matchData.first_name_post_jobs || 'ไม่ระบุชื่อ',
          lastName: matchData.last_name_post_jobs || 'ไม่ระบุนามสกุล',
          userId: matchData.user_id || '',
          jobType: matchData.job_type || ''
        });
        
      } catch (error) {
        console.error("Error fetching match details:", error);
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatchDetails();
  }, [matchId, userId]);
  
  const handleRatingChange = (value: number[]) => {
    setRating(value[0]);
  };
  
  const handleSubmitReview = async () => {
    if (!matchId || !userId || !employerInfo) {
      toast.error('ข้อมูลไม่ครบถ้วน กรุณาลองใหม่อีกครั้ง');
      return;
    }
    
    if (rating === 0) {
      toast.error('กรุณาเลือกคะแนนรีวิว');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Add a new review using the review service
      const reviewData = {
        match_id: matchId,
        employer_id: employerInfo.userId,
        employer_name: `${employerInfo.firstName} ${employerInfo.lastName}`,
        worker_id: userId,
        worker_name: userFullName || 'Worker',
        rating: rating,
        comment: comment,
        review_type: 'worker_to_employer' as const
      };
      
      await submitReview(reviewData);
      
      toast.success('ขอบคุณสำหรับการรีวิว');
      
      // Navigate back to my jobs page
      navigate('/my-jobs');
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-md">
            <CardHeader className="text-center p-6">
              <div className="flex flex-col items-center mb-2">
                <Star className="text-yellow-400 w-10 h-10" />
                <CardTitle className="text-2xl font-bold text-center mt-2">Review Employee</CardTitle>
                <CardDescription className="text-gray-500 text-center">ให้คะแนนและแสดงความคิดเห็น</CardDescription>
                
                {!loading && !error && employerInfo && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>ประเภทงาน: {employerInfo.jobType || 'ไม่ระบุ'}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>กำลังโหลดข้อมูล...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <Button 
                    onClick={() => navigate('/my-jobs')} 
                    variant="outline" 
                    className="mt-4"
                  >
                    กลับไปยังรายการงาน
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="rating" className="block mb-2">ให้คะแนน</Label>
                    <div className="py-4">
                      <Slider
                        defaultValue={[rating]}
                        max={5}
                        step={1}
                        onValueChange={handleRatingChange}
                        value={[rating]}
                        className="mb-2"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">แย่</span>
                        <span className="text-sm font-medium">{rating}/5</span>
                        <span className="text-sm">ดีมาก</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mt-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleRatingChange([value])}
                          className="focus:outline-none"
                        >
                          <Star
                            size={32}
                            className={value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="comment" className="block mb-2">ความคิดเห็น</Label>
                    <Textarea
                      id="comment"
                      placeholder="แสดงความคิดเห็นของคุณที่นี่..."
                      rows={5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full resize-none min-h-[120px]"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submitting || rating === 0}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={18} />
                          กำลังส่ง...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-3"
                      onClick={() => navigate('/my-jobs')}
                    >
                      Go to Homepage
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkerReviewPage;
