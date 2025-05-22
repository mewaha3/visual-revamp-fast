
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { registerUser } from "@/services/authService";
import { UserRegistrationData } from "@/services/authService"; 

// Define form validation schema
export const registerFormSchema = z.object({
  first_name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  last_name: z.string().min(1, { message: "กรุณากรอกนามสกุล" }),
  national_id: z.string().min(1, { message: "กรุณากรอกเลขบัตรประชาชนหรือพาสปอร์ต" }),
  dob: z.date({ required_error: "กรุณาเลือกวันเกิด" }),
  gender: z.string().min(1, { message: "กรุณาเลือกเพศ" }),
  nationality: z.string().min(1, { message: "กรุณาเลือกสัญชาติ" }),
  address: z.string().min(1, { message: "กรุณากรอกที่อยู่" }),
  province: z.string().min(1, { message: "กรุณาเลือกจังหวัด" }),
  district: z.string().min(1, { message: "กรุณาเลือกอำเภอ/เขต" }),
  subdistrict: z.string().min(1, { message: "กรุณาเลือกตำบล/แขวง" }),
  zip_code: z.string().min(1, { message: "กรุณากรอกรหัสไปรษณีย์" }),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  confirmPassword: z.string().min(6, { message: "กรุณายืนยันรหัสผ่าน" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function useRegisterForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [showForeignerDocs, setShowForeignerDocs] = useState(false);

  // Initialize form with validation schema
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      national_id: "",
      gender: "",
      nationality: "",
      address: "",
      province: "",
      district: "",
      subdistrict: "",
      zip_code: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Update document requirements when nationality changes
  useState(() => {
    const nationality = form.watch("nationality");
    setShowForeignerDocs(nationality !== "Thai");
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Format the date to string for storing
      const formattedDate = format(values.dob, "yyyy-MM-dd");
      
      // Log what we're submitting
      console.log("Form submission values:", { 
        ...values, 
        dob: formattedDate, 
        password: "[REDACTED]"
      });
      
      // Prepare user data for registration - ensure all required fields are included
      const userData: UserRegistrationData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        national_id: values.national_id,
        dob: formattedDate,
        gender: values.gender,
        nationality: values.nationality,
        address: values.address,
        province: values.province,
        district: values.district,
        subdistrict: values.subdistrict,
        zip_code: values.zip_code
      };
      
      // Register the user using the authService
      const userId = await registerUser(userData);
      console.log("Registration successful, userId:", userId);
      
      toast({
        title: "ลงทะเบียนสำเร็จ",
        description: "บัญชีผู้ใช้ถูกสร้างเรียบร้อยแล้ว",
      });

      // Redirect to home page after successful registration
      navigate("/");
    } catch (err: any) {
      console.error("Registration error:", err);
      
      let errorMsg = "เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง";
      
      // Handle specific Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น";
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = "รูปแบบอีเมลไม่ถูกต้อง";
      } else if (err.code === 'auth/weak-password') {
        errorMsg = "รหัสผ่านไม่ปลอดภัย กรุณาใช้รหัสผ่านที่มีความซับซ้อนมากขึ้น";
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = "การลงทะเบียนถูกปิดใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ";
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = "เกิดปัญหาในการเชื่อมต่อเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
      } else if (err.code === 'firestore/permission-denied') {
        errorMsg = "คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูล กรุณาติดต่อผู้ดูแลระบบ";
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "เกิดข้อผิดพลาด",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    errorMessage,
    showForeignerDocs,
    onSubmit
  };
}
