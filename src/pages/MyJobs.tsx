
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import TabMenu from '@/components/TabMenu';
import { PostJobList, FindJobList } from '@/components/JobList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUserJobs } from '@/services/jobService';
import { getUserFindJobs, findJobsUpdatedEvent } from '@/services/findJobService';
import { Button } from "@/components/ui/button";
import { Job, FindJob } from '@/types/types';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from "sonner";

const MyJobs: React.FC = () => {
  const location = useLocation();
  const initialTab = location.pathname.includes('/find') ? 'find' : 'post';
  const [activeTab, setActiveTab] = useState<'post' | 'find'>(initialTab as 'post' | 'find');
  const { userEmail, userFullName } = useAuth();
  const [filteredPostJobs, setFilteredPostJobs] = useState<Job[]>([]);
  const [filteredFindJobs, setFilteredFindJobs] = useState<FindJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchJobData();
    
    // Listen for find jobs updated event
    const handleFindJobsUpdated = () => {
      fetchFindJobs();
    };
    
    document.addEventListener('findJobsUpdated', handleFindJobsUpdated);
    
    return () => {
      document.removeEventListener('findJobsUpdated', handleFindJobsUpdated);
    };
  }, [userEmail]);

  useEffect(() => {
    // Update URL when active tab changes
    navigate(activeTab === 'find' ? '/my-jobs/find' : '/my-jobs');
  }, [activeTab]);

  useEffect(() => {
    // Set the active tab based on URL when the component mounts
    const tabFromUrl = location.pathname.includes('/find') ? 'find' : 'post';
    setActiveTab(tabFromUrl as 'post' | 'find');
  }, [location]);
  
  const fetchJobData = () => {
    setLoading(true);
    try {
      fetchPostJobs();
      fetchFindJobs();
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPostJobs = () => {
    try {
      // Filter jobs by the logged-in user's email
      if (userEmail) {
        const userPostJobs = getUserJobs(userEmail);
        setFilteredPostJobs(userPostJobs);
      }
    } catch (error) {
      console.error("Error fetching post jobs:", error);
      toast.error("ไม่สามารถโหลดข้อมูลงานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };
  
  const fetchFindJobs = () => {
    try {
      // Filter find jobs by the logged-in user's email
      if (userEmail) {
        const userFindJobs = getUserFindJobs(userEmail);
        setFilteredFindJobs(userFindJobs as FindJob[]);
      }
    } catch (error) {
      console.error("Error fetching find jobs:", error);
      toast.error("ไม่สามารถโหลดข้อมูลหางานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };
  
  const handleRefresh = () => {
    fetchJobData();
    toast.success("อัปเดตข้อมูลล่าสุด");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">งานของฉัน</h1>
                  <p className="text-gray-600">สวัสดี, {userFullName || userEmail || 'ผู้ใช้งาน'}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/post-job')} className="flex items-center gap-2">
                  <span>Post Job</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/find-job')} className="flex items-center gap-2">
                  <span>Find Job</span>
                </Button>
              </div>
            </div>

            <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'post' ? (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold mb-4">🚀 รายการที่ลงโพสต์งาน</h2>
                {loading ? (
                  <div className="text-center py-8 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : filteredPostJobs.length > 0 ? (
                  <PostJobList jobs={filteredPostJobs} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>คุณยังไม่มีรายการประกาศงาน</p>
                    <p className="mt-2">
                      <a href="/post-job" className="text-fastlabor-600 hover:underline">
                        ลงประกาศงานใหม่
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold mb-4">🔍 รายการงานที่ค้นหา</h2>
                {loading ? (
                  <div className="text-center py-8 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : filteredFindJobs.length > 0 ? (
                  <FindJobList jobs={filteredFindJobs} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>คุณยังไม่มีรายการหางาน</p>
                    <p className="mt-2">
                      <a href="/find-job" className="text-fastlabor-600 hover:underline">
                        สมัครเป็นแรงงาน
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Work Flow Overview - based on the flow diagram */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold mb-4">ขั้นตอนการทำงาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-fastlabor-50 p-4 rounded-lg">
                  <h4 className="font-medium text-fastlabor-700 mb-2">ลงประกาศงาน / หางาน</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-fastlabor-600 mr-2">•</span>
                      <span>กรอกข้อมูลงานหรือทักษะ</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fastlabor-600 mr-2">•</span>
                      <span>ระบุเวลาและสถานที่</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fastlabor-600 mr-2">•</span>
                      <span>กำหนดค่าตอบแทน</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">จับคู่งานและแรงงาน</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>AI จับคู่ทักษะที่เหมาะสม</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>ตรวจสอบพื้นที่การทำงาน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>ยืนยันเวลาและค่าตอบแทน</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">ทำงานและชำระเงิน</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>ติดตามสถานะงาน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>ชำระเงินเมื่องานเสร็จสิ้น</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>ให้คะแนนและรีวิว</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyJobs;
