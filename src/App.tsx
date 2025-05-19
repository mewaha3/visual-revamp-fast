
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

// Comment explaining the solution without modifying tsconfig.json:
/*
 * Since we can't modify the tsconfig.json to set `"declaration": false` or `"noEmit": true`,
 * we use a pre-build script to delete all .d.ts files in the src/ directory.
 * This solves the TS6305 errors by ensuring no stale declaration files exist
 * that don't match their source files. Run with:
 * npm run cleanup && npm run build
 * or set up a prebuild script in package.json:
 * "prebuild": "node src/scripts/cleanup.js"
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
