
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar, User, Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "กรุณากรอกชื่อ" }),
  lastName: z.string().min(2, { message: "กรุณากรอกนามสกุล" }),
  nationalId: z.string().min(13, { message: "เลขบัตรประจำตัวประชาชนต้องมี 13 หลัก" }),
  dateOfBirth: z.string({ required_error: "กรุณาเลือกวันเกิด" }),
  gender: z.string({ required_error: "กรุณาเลือกเพศ" }),
  nationality: z.string().min(1, { message: "กรุณากรอกสัญชาติ" }),
  address: z.string().min(5, { message: "กรุณากรอกที่อยู่" }),
  province: z.string({ required_error: "กรุณาเลือกจังหวัด" }),
  district: z.string({ required_error: "กรุณาเลือกอำเภอ/เขต" }),
  subDistrict: z.string({ required_error: "กรุณาเลือกตำบล/แขวง" }),
  zipCode: z.string().min(5, { message: "รหัสไปรษณีย์ต้องมี 5 หลัก" }),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
});

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Temporary data for dropdown options
  const provinces = ["กรุงเทพมหานคร", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น", "ชลบุรี"];
  const districts = ["เขตบางรัก", "เขตสาทร", "เขตปทุมวัน", "อำเภอเมือง", "อำเภอสันทราย"];
  const subDistricts = ["แขวงสีลม", "แขวงทุ่งมหาเมฆ", "ตำบลช้างเผือก", "ตำบลสุเทพ"];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalId: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      address: "",
      province: "",
      district: "",
      subDistrict: "",
      zipCode: "",
      email: "",
      password: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, you would submit this data to your API
    // For now, we'll just navigate to the upload page
    navigate("/upload-documents");
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 md:py-16">
        <div className="container max-w-3xl">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">สมัครสมาชิกใหม่</h1>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="mr-2" />
                  ข้อมูลส่วนตัว
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="ชื่อจริง" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>นามสกุล <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="นามสกุล" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หมายเลขบัตรประชาชน <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="เลขบัตรประจำตัวประชาชน 13 หลัก" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>วันเกิด <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="date" 
                              placeholder="เลือกวันเกิด" 
                              className="pl-10" 
                              {...field} 
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เพศ <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกเพศ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">ชาย</SelectItem>
                            <SelectItem value="female">หญิง</SelectItem>
                            <SelectItem value="other">ไม่ระบุ</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>สัญชาติ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="สัญชาติ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2" />
                  ข้อมูลที่อยู่
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ที่อยู่ (บ้านเลขที่, ถนน, ซอย) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="กรอกรายละเอียดที่อยู่"
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>จังหวัด <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="เลือกจังหวัด" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>อำเภอ/เขต <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="เลือกอำเภอ/เขต" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subDistrict"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ตำบล/แขวง <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="เลือกตำบล/แขวง" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subDistricts.map((subDistrict) => (
                                <SelectItem key={subDistrict} value={subDistrict}>
                                  {subDistrict}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รหัสไปรษณีย์ <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="รหัสไปรษณีย์" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Lock className="mr-2" />
                  ข้อมูลบัญชีผู้ใช้
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>อีเมล <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel>รหัสผ่าน <span className="text-red-500">*</span></FormLabel>
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
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button type="submit" className="w-full md:w-auto px-8 bg-fastlabor-600 hover:bg-fastlabor-700">
                  สมัครสมาชิก
                </Button>
              </div>
              
              <div className="text-center">
                <p>
                  มีบัญชีผู้ใช้แล้ว?{" "}
                  <a href="/login" className="text-fastlabor-600 hover:underline">
                    เข้าสู่ระบบ
                  </a>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
