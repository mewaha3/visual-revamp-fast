
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TabMenu from '@/components/TabMenu';
import { PostJobList, FindJobList } from '@/components/JobList';
import { postJobs } from '@/data/postJobs';
import { findJobs } from '@/data/findJobs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MyJobs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'post' | 'find'>('post');
  const { userFullName } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Jobs</h1>
                <p className="text-gray-600">สวัสดี, {userFullName || 'ผู้ใช้งาน'}</p>
              </div>
            </div>

            <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'post' ? (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold mb-4">🚀 รายการที่ลงโพสต์งาน</h2>
                <PostJobList jobs={postJobs} />
              </div>
            ) : (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold mb-4">🔍 รายการงานที่ค้นหา</h2>
                <FindJobList jobs={findJobs} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyJobs;
