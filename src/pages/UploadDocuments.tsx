
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Check, Passport } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DocumentsSection from "@/components/auth/form-sections/DocumentsSection";
import { registerUser } from "@/services/authService";
import { UserRegistrationData } from "@/services/authService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface DocumentsState {
  id_card: File | null;
  passport: File | null;
  visa: File | null;
  work_permit: File | null;
}

export default function UploadDocuments() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [documents, setDocuments] = useState<DocumentsState>({
    id_card: null,
    passport: null,
    visa: null,
    work_permit: null,
  });

  // Load form data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('registerFormData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    } else {
      // Redirect back to register if no form data is found
      navigate('/register');
    }
  }, [navigate]);

  // Handle document upload
  function handleDocumentUpload(type: keyof DocumentsState, file: File | null) {
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  }

  // Check if required documents are uploaded based on nationality
  function hasRequiredDocuments() {
    if (!formData) return false;
    
    if (formData.nationality === "Thai") {
      return !!documents.id_card;
    } else {
      return !!documents.passport && !!documents.visa && !!documents.work_permit;
    }
  }

  async function handleSubmit() {
    if (!hasRequiredDocuments()) {
      toast({
        title: "กรุณาอัพโหลดเอกสารที่จำเป็น",
        description: formData?.nationality === "Thai" 
          ? "กรุณาอัพโหลดสำเนาบัตรประชาชน" 
          : "กรุณาอัพโหลดหนังสือเดินทาง วีซ่า และใบอนุญาตทำงาน",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the documents to a server here
      console.log("Documents to upload:", documents);
      
      // Register the user
      if (formData) {
        const userData: UserRegistrationData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          national_id: formData.national_id,
          dob: formData.dob,
          gender: formData.gender,
          nationality: formData.nationality,
          address: formData.address,
          province: formData.province,
          district: formData.district,
          subdistrict: formData.subdistrict,
          zip_code: formData.zip_code
        };
        
        // This would actually register the user in a real app
        // Uncomment this to actually register the user
        // const userId = await registerUser(userData);
        
        // For now, we'll just simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success dialog
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลงทะเบียนผู้ใช้ได้ โปรดลองอีกครั้งในภายหลัง",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContinue() {
    // Clear session storage
    sessionStorage.removeItem('registerFormData');
    // Close dialog and redirect to login
    setShowSuccessDialog(false);
    navigate('/login');
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fastlabor-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-16">
        <div className="container max-w-3xl space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            อัพโหลดเอกสาร
          </h1>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2" /> อัพโหลดเอกสาร
            </h2>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                {formData.nationality === "Thai" 
                  ? "กรุณาอัพโหลดสำเนาบัตรประชาชนเพื่อยืนยันตัวตน" 
                  : "กรุณาอัพโหลดเอกสารสำหรับชาวต่างชาติเพื่อยืนยันตัวตน"}
              </p>
            </div>
            
            <DocumentsSection onDocumentUpload={handleDocumentUpload} />

            <div className="mt-8 flex flex-col gap-4">
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-fastlabor-600 hover:bg-fastlabor-700"
                disabled={isSubmitting || !hasRequiredDocuments()}
              >
                {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full"
              >
                ย้อนกลับ
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              การตรวจสอบเอกสารผ่าน
            </DialogTitle>
            <DialogDescription>
              เอกสารของคุณได้รับการตรวจสอบและยืนยันเรียบร้อยแล้ว
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-green-50 p-4 rounded-lg my-4 text-center">
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium text-green-800">สมัครสมาชิกสำเร็จ!</h3>
            <p className="text-sm text-green-700 mt-2">
              คุณสามารถเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ลงทะเบียนไว้
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleContinue}
              className="w-full bg-fastlabor-600 hover:bg-fastlabor-700"
            >
              เข้าสู่ระบบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
