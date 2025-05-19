
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, User, Calendar, MapPin, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { users } from "@/data/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PasswordInput from "./PasswordInput";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "../upload/DocumentUpload";

// Define form validation schema
const formSchema = z.object({
  first_name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  last_name: z.string().min(1, { message: "กรุณากรอกนามสกุล" }),
  national_id: z.string().min(13, { message: "กรุณากรอกเลขบัตรประชาชน 13 หลัก" }).max(13),
  dob: z.string().min(1, { message: "กรุณาเลือกวันเกิด" }),
  gender: z.string().min(1, { message: "กรุณาเลือกเพศ" }),
  nationality: z.string().min(1, { message: "กรุณากรอกสัญชาติ" }),
  address: z.string().min(1, { message: "กรุณากรอกที่อยู่" }),
  province: z.string().min(1, { message: "กรุณาเลือกจังหวัด" }),
  district: z.string().min(1, { message: "กรุณาเลือกอำเภอ/เขต" }),
  subdistrict: z.string().min(1, { message: "กรุณาเลือกตำบล/แขวง" }),
  zip_code: z.string().min(5, { message: "กรุณากรอกรหัสไปรษณีย์" }).max(5),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  confirmPassword: z.string().min(6, { message: "กรุณายืนยันรหัสผ่าน" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

// Sample data for dropdowns
const provinces = [
  "กรุงเทพ", "เชียงใหม่", "ขอนแก่น", "ลำปาง", "นครราชสีมา", "ชลบุรี", "ลำพูน"
];

const districts = {
  "กรุงเทพ": ["เขต1", "เขต2", "เขตลาดพร้าว", "เขตจตุจักร"],
  "เชียงใหม่": ["เมืองเชียงใหม่", "แม่ริม", "สันทราย"],
  "ขอนแก่น": ["เมืองขอนแก่น", "พล", "ชุมแพ"],
  "ลำปาง": ["เมืองลำปาง", "เกาะคา", "เสริมงาม"],
  "นครราชสีมา": ["เมืองนครราชสีมา", "ปากช่อง", "พิมาย"],
  "ชลบุรี": ["เมืองชลบุรี", "พัทยา", "ศรีราชา"],
  "ลำพูน": ["เมืองลำพูน", "ป่าซาง", "บ้านโฮ่ง"]
};

const subdistricts = {
  "เขต1": ["แขวง1", "แขวง2"],
  "เมืองเชียงใหม่": ["ศรีภูมิ", "พระสิงห์", "ช้างม่อย"],
  "เมืองขอนแก่น": ["ตำบล1", "ตำบล2", "ตำบล3"],
  "เมืองลำปาง": ["ตำบล1", "ตำบล2", "ตำบล3"],
  "เมืองนครราชสีมา": ["ตำบล4", "ตำบล5", "ตำบล6"],
  "เมืองชลบุรี": ["ตำบล5", "ตำบล6", "ตำบล7"],
  "เมืองลำพูน": ["ลำพูน", "ต้นธง", "เวียงยอง"]
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [documents, setDocuments] = useState({
    certificate: null as File | null,
    passport: null as File | null,
    visa: null as File | null,
    work_permit: null as File | null,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    form.setValue("province", value);
    form.setValue("district", "");
    form.setValue("subdistrict", "");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    form.setValue("district", value);
    form.setValue("subdistrict", "");
  };

  const handleDocumentUpload = (type: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Check if email already exists
      const emailExists = users.some(user => user.email === values.email);
      
      if (emailExists) {
        setErrorMessage("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
        setIsSubmitting(false);
        return;
      }
      
      // In a real application, we would add the new user to the database
      // but for our demo, we'll just show a success message
      const newUser = {
        ...values,
        certificate: documents.certificate ? documents.certificate.name : "No",
        passport: documents.passport ? "Yes" : "No",
        visa: documents.visa ? "Yes" : "No",
        work_permit: documents.work_permit ? "Yes" : "No",
        fullName: `${values.first_name} ${values.last_name}`
      };
      
      // This would normally update the database
      console.log("New user to be registered:", newUser);
      
      toast({
        title: "ลงทะเบียนสำเร็จ",
        description: "กรุณาเข้าสู่ระบบด้วยบัญชีที่สร้างขึ้น",
      });

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
        <h2 className="text-xl font-semibold">ข้อมูลส่วนบุคคล</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input className="pl-10" {...field} placeholder="ชื่อ" />
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

          {/* Last name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>นามสกุล <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input className="pl-10" {...field} placeholder="นามสกุล" />
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
        </div>

        {/* National ID */}
        <FormField
          control={form.control}
          name="national_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เลขบัตรประชาชน <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="เลขบัตรประชาชน 13 หลัก" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันเกิด <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type="date" className="pl-10" {...field} />
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
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
                  <SelectItem value="Male">ชาย</SelectItem>
                  <SelectItem value="Female">หญิง</SelectItem>
                  <SelectItem value="Other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สัญชาติ <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="pl-10" {...field} placeholder="สัญชาติ" />
                  <Flag
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="text-xl font-semibold pt-4">ข้อมูลที่อยู่</h2>
        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ที่อยู่ <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea className="min-h-[80px]" {...field} placeholder="บ้านเลขที่ ถนน ซอย" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Province */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>จังหวัด <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={handleProvinceChange} defaultValue={field.value}>
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

        {/* District */}
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อำเภอ/เขต <span className="text-red-500">*</span></FormLabel>
              <Select 
                onValueChange={handleDistrictChange} 
                defaultValue={field.value}
                disabled={!selectedProvince}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกอำเภอ/เขต" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedProvince && districts[selectedProvince as keyof typeof districts]?.map((district) => (
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

        {/* Subdistrict */}
        <FormField
          control={form.control}
          name="subdistrict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ตำบล/แขวง <span className="text-red-500">*</span></FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!selectedDistrict}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกตำบล/แขวง" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedDistrict && subdistricts[selectedDistrict as keyof typeof subdistricts]?.map((subdistrict) => (
                    <SelectItem key={subdistrict} value={subdistrict}>
                      {subdistrict}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Zip Code */}
        <FormField
          control={form.control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสไปรษณีย์ <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="pl-10" {...field} placeholder="รหัสไปรษณีย์" />
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="text-xl font-semibold pt-4">อัพโหลดเอกสาร</h2>
        <div className="space-y-4">
          <DocumentUpload 
            title="สำเนาบัตรประชาชน (ID Card)" 
            onChange={(file) => handleDocumentUpload("certificate", file)} 
          />
          <DocumentUpload 
            title="หนังสือเดินทาง (Passport)" 
            onChange={(file) => handleDocumentUpload("passport", file)} 
          />
          <DocumentUpload 
            title="หนังสือวีซ่า (Visa)" 
            onChange={(file) => handleDocumentUpload("visa", file)} 
          />
          <DocumentUpload 
            title="หนังสืออนุญาตทำงาน (Work Permit)" 
            onChange={(file) => handleDocumentUpload("work_permit", file)} 
          />
        </div>

        <h2 className="text-xl font-semibold pt-4">ข้อมูลบัญชี</h2>
        {/* Email */}
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

        {/* Password */}
        <PasswordInput
          name="password"
          label="รหัสผ่าน"
          placeholder="รหัสผ่าน"
        />

        {/* Confirm Password */}
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
