
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "./PasswordInput";

// Define form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "กรุณากรอกชื่อ-นามสกุล" }),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  confirmPassword: z.string().min(6, { message: "กรุณายืนยันรหัสผ่าน" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // prepare row data for Google Sheet
      const row = [
        values.fullName,
        values.email,
        values.password,
      ];

      // send form data to sheets API
      const resp = await fetch("http://localhost:4000/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      
      if (!resp.ok) {
        throw new Error(await resp.text());
      }
      
      const json = await resp.json();
      if (!json.ok) {
        throw new Error(json.error);
      }

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ชื่อ-นามสกุล */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ-นามสกุล</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="pl-10" {...field} placeholder="ชื่อ-นามสกุล" />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    className="pl-10"
                    {...field}
                    placeholder="อีเมล"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password - using our reusable PasswordInput */}
        <PasswordInput
          name="password"
          label="รหัสผ่าน"
          placeholder="รหัสผ่าน"
        />

        {/* Confirm Password - also using our PasswordInput */}
        <PasswordInput
          name="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          placeholder="ยืนยันรหัสผ่าน"
        />

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
    </Form>
  );
};

export default RegisterForm;
