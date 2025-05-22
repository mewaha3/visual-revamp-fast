
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface EmployerInfo {
  firstName: string;
  lastName: string;
  userId: string;
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
          userId: matchData.user_id || ''
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
  
  const handleRatingChange = (value: number) => {
    setRating(value);
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
      // Add a new review to the reviews collection
      const reviewData = {
        match_id: matchId,
        employer_id: employerInfo.userId || 'unknown',
        employer_name: `${employerInfo.firstName} ${employerInfo.lastName}`,
        worker_id: userId,
        worker_name: userFullName || 'Worker',
        rating: rating,
        comment: comment,
        created_at: serverTimestamp(),
        review_type: 'worker_to_employer' // Worker reviewing employer
      };
      
      const reviewRef = await addDoc(collection(db, "reviews"), reviewData);
      
      // Update the match with the review reference
      const matchDocRef = doc(db, "match_results", matchId);
      await updateDoc(matchDocRef, {
        worker_review_id: reviewRef.id,
        worker_review_rating: rating,
        updated_at: serverTimestamp()
      });
      
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-2" />
            ย้อนกลับ
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">รีวิวนายจ้าง</h1>
            
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
              <Card>
                <CardHeader>
                  <CardTitle>ให้คะแนนนายจ้าง: {employerInfo?.firstName} {employerInfo?.lastName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="rating" className="block text-lg mb-2">คะแนน</Label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingChange(value)}
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
                      <Label htmlFor="comment" className="block text-lg mb-2">ความคิดเห็น</Label>
                      <Textarea
                        id="comment"
                        placeholder="แสดงความคิดเห็นเกี่ยวกับนายจ้าง..."
                        rows={5}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleSubmitReview}
                        disabled={submitting || rating === 0}
                        className="px-8"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            กำลังส่ง...
                          </>
                        ) : (
                          'ส่งรีวิว'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkerReviewPage;
