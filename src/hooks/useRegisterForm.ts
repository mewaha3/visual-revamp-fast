
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'nationality') {
        setShowForeignerDocs(value.nationality !== "Thai");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleContinueToUpload = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      // Format the date to string for storing
      const formattedDate = format(values.dob, "yyyy-MM-dd");
      
      // Store form data in session storage to retrieve on upload page
      const userData = {
        ...values,
        dob: formattedDate,
      };
      
      sessionStorage.setItem('registerFormData', JSON.stringify(userData));
      
      // Navigate to the document upload page
      navigate("/upload-documents");
      
    } catch (err: any) {
      console.error("Form validation error:", err);
      setErrorMessage("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล กรุณาลองใหม่อีกครั้ง");
      
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาตรวจสอบข้อมูลที่กรอกให้ถูกต้องและครบถ้วน",
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
    handleContinueToUpload
  };
}
