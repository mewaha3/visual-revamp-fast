
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useRegisterForm } from "@/hooks/useRegisterForm";

// Import modular form sections
import PersonalInfoSection from "./form-sections/PersonalInfoSection";
import AddressSection from "./form-sections/AddressSection";
import AccountSection from "./form-sections/AccountSection";

const RegisterForm = () => {
  const {
    form,
    isSubmitting,
    errorMessage,
    onSubmit
  } = useRegisterForm();

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700">คำแนะนำในการกรอกข้อมูล</p>
              <p className="text-sm text-blue-600">คุณสามารถกรอกข้อมูลได้ทั้งภาษาไทยและภาษาอังกฤษ โปรดกรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
            </div>
          </div>
        </div>
        
        {/* Personal Information Section */}
        <PersonalInfoSection />
        
        {/* Address Section */}
        <AddressSection />
        
        {/* Account Section */}
        <AccountSection />

        {/* Error message */}
        {errorMessage && (
          <div className="text-sm font-medium text-destructive">{errorMessage}</div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full bg-fastlabor-600 hover:bg-fastlabor-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </Button>

        {/* Login link */}
        <div className="text-center text-sm">
          มีบัญชีแล้ว?{" "}
          <a href="/login" className="text-fastlabor-600 hover:underline">
            เข้าสู่ระบบ
          </a>
        </div>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
