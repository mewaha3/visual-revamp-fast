
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
import AIMatchingDetailPage from './pages/AIMatchingDetailPage';
import AcceptedJobDetailPage from './pages/AcceptedJobDetailPage';
import WorkerReviewPage from './pages/WorkerReviewPage';
import ProfileEdit from './pages/ProfileEdit';

/* 
 * Note about the TS6305 errors:
 * These errors appear because TypeScript is trying to generate declaration files (.d.ts) 
 * but some source files have not been properly built yet.
 * This is typically fixed by:
 * 1. Setting "declaration": false in tsconfig.json
 * 2. Using a prebuild script to clean up old declaration files
 * 3. Setting "noEmit": true in tsconfig.json
 *
 * Since we can't modify tsconfig.json directly, we're addressing this with the cleanup script.
 * For now, we can safely ignore these errors as they don't affect the functionality of the app.
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

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
            {/* Profile edit route */}
            <Route path="/profile/edit" element={<ProfileEdit />} />
            {/* New route for the find tab */}
            <Route path="/my-jobs/find" element={<MyJobsPage />} />
            {/* Job matching system routes */}
            <Route path="/my-jobs-page" element={<MyJobsPage />} />
            <Route path="/matching/:jobId" element={<AIMatchingDetailPage />} />
            <Route path="/status/:jobId" element={<StatusMatchingPage />} />
            <Route path="/job-detail/:jobId" element={<JobDetailPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            {/* Review routes */}
            <Route path="/review/:jobId" element={<ReviewPage />} />
            <Route path="/jobs/:jobId/review" element={<ReviewPage />} />
            {/* Worker job detail and employer review routes */}
            <Route path="/worker/jobs/:jobId" element={<WorkerJobDetailPage />} />
            <Route path="/employer-review/:jobId" element={<EmployerReviewPage />} />
            {/* New routes for accepted jobs and worker reviews */}
            <Route path="/accepted-job/:matchId" element={<AcceptedJobDetailPage />} />
            <Route path="/worker-review/:matchId" element={<WorkerReviewPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
