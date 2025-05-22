
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/services/userService";
import PersonalInfoSection from "./PersonalInfoSection";
import AddressSection from "./AddressSection";
import { useState, useEffect } from "react";
import { ProfileFormValues } from "@/pages/ProfileEdit";

interface ProfileFormProps {
  userId: string | null;
  userEmail: string | null;
  initialData: ProfileFormValues | null;
}

// Define form validation schema
const profileFormSchema = z.object({
  first_name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  last_name: z.string().min(1, { message: "กรุณากรอกนามสกุล" }),
  national_id: z.string().min(1, { message: "กรุณากรอกเลขบัตรประชาชนหรือพาสปอร์ต" }),
  dob: z.string().min(1, { message: "กรุณาเลือกวันเกิด" }),
  gender: z.string().min(1, { message: "กรุณาเลือกเพศ" }),
  nationality: z.string().min(1, { message: "กรุณาเลือกสัญชาติ" }),
  address: z.string().min(1, { message: "กรุณากรอกที่อยู่" }),
  province: z.string().min(1, { message: "กรุณาเลือกจังหวัด" }),
  district: z.string().min(1, { message: "กรุณาเลือกอำเภอ/เขต" }),
  subdistrict: z.string().min(1, { message: "กรุณาเลือกตำบล/แขวง" }),
  zip_code: z.string().min(1, { message: "กรุณากรอกรหัสไปรษณีย์" }),
});

export { profileFormSchema };

export default function ProfileForm({ userId, userEmail, initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      national_id: "",
      dob: "",
      gender: "",
      nationality: "",
      address: "",
      province: "",
      district: "",
      subdistrict: "",
      zip_code: "",
    },
  });

  // Update form with initial data when available
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  // Handle form submission
  async function onSubmit(values: ProfileFormValues) {
    if (!userId) {
      toast({
        title: "ไม่พบข้อมูลผู้ใช้",
        description: "กรุณาเข้าสู่ระบบใหม่",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update profile with submitted values
      const success = await updateUserProfile(userId, {
        ...values,
        email: userEmail,
        // Dynamically calculate fullName from first_name and last_name
        fullName: `${values.first_name} ${values.last_name}`,
        updatedAt: new Date().toISOString()
      });

      if (success) {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "ข้อมูลโปรไฟล์ของคุณได้รับการอัปเดตเรียบร้อยแล้ว",
        });
        // Redirect back to home page after successful update
        navigate("/");
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-8">
            <PersonalInfoSection userEmail={userEmail} />
            <AddressSection />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังบันทึกข้อมูล...
                </>
              ) : (
                "บันทึกข้อมูล"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
