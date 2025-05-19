
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import FindWorker from "./pages/FindWorker";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UploadDocuments from "./pages/UploadDocuments";
import PostJob from "./pages/PostJob";
import FindJob from "./pages/FindJob";
import MyJobs from "./pages/MyJobs";
import MyJobsPage from "./pages/MyJobsPage";
import AIMatchingPage from "./pages/AIMatchingPage";
import StatusMatchingPage from "./pages/StatusMatchingPage";
import JobDetailPage from "./pages/JobDetailPage";
import ReviewPage from "./pages/ReviewPage";
import WorkerJobDetailPage from "./pages/WorkerJobDetailPage";
import EmployerReviewPage from "./pages/EmployerReviewPage";

// คำอธิบายการแก้ปัญหาโดยไม่ต้องแก้ไข tsconfig.json:
/*
 * เนื่องจากเราไม่สามารถแก้ไข tsconfig.json เพื่อตั้งค่า `"declaration": false` หรือ `"noEmit": true` ได้
 * เราจึงใช้สคริปต์ pre-build เพื่อลบไฟล์ .d.ts ทั้งหมดในโฟลเดอร์ src/
 * วิธีนี้แก้ไขปัญหา TS6305 โดยการทำให้แน่ใจว่าไม่มีไฟล์ declaration เก่าที่ไม่ตรงกับไฟล์ต้นฉบับ
 * สามารถรันด้วยคำสั่ง:
 * npm run cleanup && npm run build
 * หรือตั้งค่าสคริปต์ prebuild ใน package.json:
 * "prebuild": "node src/scripts/cleanup-declarations.js"
 */

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/find-worker" element={<FindWorker />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/upload-documents" element={<UploadDocuments />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/find-job" element={<FindJob />} />
            <Route path="/my-jobs" element={<MyJobsPage />} />
            {/* New route for the find tab */}
            <Route path="/my-jobs/find" element={<MyJobsPage />} />
            {/* Job matching system routes */}
            <Route path="/my-jobs-page" element={<MyJobsPage />} />
            <Route path="/matching/:jobId" element={<AIMatchingPage />} />
            <Route path="/status/:jobId" element={<StatusMatchingPage />} />
            <Route path="/job-detail/:jobId" element={<JobDetailPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            {/* Review route */}
            <Route path="/jobs/:jobId/review" element={<ReviewPage />} />
            {/* New worker job detail and employer review routes */}
            <Route path="/worker/jobs/:jobId" element={<WorkerJobDetailPage />} />
            <Route path="/employer-review/:jobId" element={<EmployerReviewPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
