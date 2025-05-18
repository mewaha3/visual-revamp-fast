import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

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
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const ok = await login(values.email, values.password);
    if (ok) {
      navigate("/upload-documents");
    } else {
      setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container max-w-md mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h1>
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสผ่าน</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่าน"
                            className="pl-10"
                            {...field}
                          />
                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={16}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                >
                  เข้าสู่ระบบ
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
