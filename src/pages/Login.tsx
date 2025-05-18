
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formSchema = z.object({
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, you would authenticate the user
    // For now, let's just navigate to the home page
    navigate("/");
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/lovable-uploads/365674fc-1bea-4770-b4cb-f2f99ec0e841.png"
                alt="FastLabor Logo"
                className="h-16 w-auto"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h1>
            
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
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
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
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          จดจำฉัน
                        </label>
                      </div>
                    )}
                  />
                  
                  <a href="#" className="text-sm text-fastlabor-600 hover:underline">
                    ลืมรหัสผ่าน?
                  </a>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-fastlabor-600 hover:bg-fastlabor-700"
                >
                  เข้าสู่ระบบ
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    ยังไม่มีบัญชีผู้ใช้?{" "}
                    <a href="/register" className="text-fastlabor-600 hover:underline">
                      สมัครสมาชิกใหม่
                    </a>
                  </p>
                </div>
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
