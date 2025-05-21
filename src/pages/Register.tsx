
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(true);
  const [isConsented, setIsConsented] = useState(false);
  const { userEmail, isLoading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && userEmail) {
      navigate('/');
    }
  }, [userEmail, navigate, isLoading]);

  const handleConsent = () => {
    if (isConsented) {
      setShowConsent(false);
    }
  };

  const handleDecline = () => {
    // Redirect to home page if user declines
    navigate('/');
  };
  
  // Don't render content until authentication state is determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fastlabor-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังตรวจสอบข้อมูลผู้ใช้...</p>
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
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center mb-6">สมัครสมาชิกใหม่</h1>
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer />

      {/* Privacy Consent Dialog */}
      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ข้อตกลงการใช้ข้อมูลส่วนบุคคล</DialogTitle>
            <DialogDescription>
              โปรดอ่านและยอมรับข้อตกลงเพื่อดำเนินการต่อ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              ข้าพเจ้ายินยอมให้บริษัทเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
              เพื่อวัตถุประสงค์ในการสมัครงาน การจับคู่งานกับนายจ้าง/ลูกจ้าง และการติดต่อสื่อสาร
              ที่เกี่ยวข้องตามนโยบายความเป็นส่วนตัว
            </p>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="consent" 
                checked={isConsented}
                onCheckedChange={(checked) => setIsConsented(checked === true)}
              />
              <label 
                htmlFor="consent" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ข้าพเจ้ายอมรับข้อตกลงการใช้ข้อมูลส่วนบุคคล
              </label>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleDecline}>
              ปฏิเสธ
            </Button>
            <Button 
              type="button" 
              onClick={handleConsent} 
              disabled={!isConsented}
              className="bg-fastlabor-600 hover:bg-fastlabor-700"
            >
              ยอมรับและดำเนินการต่อ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
