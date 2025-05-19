
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "./PasswordInput";

const formSchema = z.object({
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  redirectPath?: string;
}

const LoginForm = ({ redirectPath = "/upload-documents" }: LoginFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination from location state (if any)
  const from = location.state?.from || redirectPath;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const ok = await login(values.email, values.password);
      if (ok) {
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับกลับมา!",
        });
        navigate(from); // Navigate to the intended destination
      } else {
        setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลัง");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {errorMsg && (
        <p className="mb-4 text-center text-red-600">{errorMsg}</p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="อีเมล"
                      className="pl-10"
                      {...field}
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

          <PasswordInput
            name="password"
            label="รหัสผ่าน"
            placeholder="รหัสผ่าน"
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v)}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none"
                  >
                    จดจำฉัน
                  </label>
                </div>
              )}
            />

            <a
              href="#"
              className="text-sm text-fastlabor-600 hover:underline"
            >
              ลืมรหัสผ่าน?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-fastlabor-600 hover:bg-fastlabor-700"
            disabled={isLoading}
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>

          <p className="text-center mt-4 text-sm text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <a
              href="/register"
              className="text-fastlabor-600 hover:underline"
            >
              สมัครสมาชิกใหม่
            </a>
          </p>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
