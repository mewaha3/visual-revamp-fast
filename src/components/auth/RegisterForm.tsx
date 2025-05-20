import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, User, Calendar, MapPin, Flag, Info } from "lucide-react";
import { format } from "date-fns";

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
import { users, addUser } from "@/data/users";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import useThailandLocations from "@/hooks/useThailandLocations";

// Define form validation schema
const formSchema = z.object({
  first_name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  last_name: z.string().min(1, { message: "กรุณากรอกนามสกุล" }),
  national_id: z.string().min(1, { message: "กรุณากรอกเลขบัตรประชาชนหรือพาสปอร์ต" }),
  dob: z.date({ required_error: "กรุณาเลือกวันเกิด" }),
  gender: z.string().min(1, { message: "กรุณาเลือกเพศ" }),
  nationality: z.string().min(1, { message: "กรุณากรอกสัญชาติ" }),
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

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [documents, setDocuments] = useState({
    certificate: null as File | null,
    passport: null as File | null,
    visa: null as File | null,
    work_permit: null as File | null,
  });
  
  // Use the Thailand locations hook
  const {
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading,
    error,
    zipCode,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
  } = useThailandLocations();
  
  // Calculate a reasonable year range for birthdate selection
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 80; // Allow birth years up to 80 years ago
  const maxYear = 2007; // As per your requirement

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  // Update zip_code when tambon changes
  const handleTambonSelect = (value: string) => {
    handleTambonChange(value);
    form.setValue("subdistrict", value);
    
    // Find the selected tambon to get its zip code
    if (filteredTambons.length > 0) {
      const selectedTambon = filteredTambons.find(t => t.name_th === value);
      if (selectedTambon && selectedTambon.zip_code) {
        // Fix: Convert zip_code to string explicitly
        form.setValue("zip_code", String(selectedTambon.zip_code));
      }
    }
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
      
      // Format the date to string for storing
      const formattedDate = format(values.dob, "yyyy-MM-dd");
      
      // Create the new user object with all required fields explicitly set
      const newUser = {
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
        zip_code: values.zip_code,
        certificate: documents.certificate ? documents.certificate.name : "No",
        passport: documents.passport ? "Yes" : "No",
        visa: documents.visa ? "Yes" : "No",
        work_permit: documents.work_permit ? "Yes" : "No",
        fullName: `${values.first_name} ${values.last_name}`
      };
      
      // Add the new user to the users array using the addUser function
      addUser(newUser);
      
      // Log the new user for debugging purposes
      console.log("New user registered:", newUser);
      
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
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700">คำแนะนำในการกรอกข้อมูล</p>
              <p className="text-sm text-blue-600">คุณสามารถกรอกข้อมูลได้ทั้งภาษาไทยและภาษาอังกฤษ โปรดกรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
            </div>
          </div>
        </div>
        
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
                    <Input className="pl-10" {...field} placeholder="เช่น สมชาย, John" />
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
                    <Input className="pl-10" {...field} placeholder="เช่น ใจดี, Smith" />
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
              <FormLabel>เลขรหัสบัตรประชาชน/พาสปอร์ต <span className="text-red-500">*</span></FormLabel>
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                กรอกเลขประจำตัวประชาชนหรือเลขพาสปอร์ต สำหรับชาวต่างชาติ
              </div>
              <FormControl>
                <Input {...field} placeholder="เช่น 1234567890123 หรือ AA12345678" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Enhanced Date of Birth - with better accessibility and user experience */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1">
              <FormLabel>วันเกิด <span className="text-red-500">*</span></FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-10 text-left font-normal flex justify-between items-center",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center">
                        <Calendar
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={16}
                        />
                        <span>
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            "เลือกวันเกิด"
                          )}
                        </span>
                      </div>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-sm font-medium">เลือกวันเกิด</div>
                    <div className="text-xs text-gray-500">
                      กรุณาเลือกวันเดือนปีเกิดของคุณ
                    </div>
                  </div>
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date(`${minYear}-01-01`)
                    }
                    initialFocus
                    defaultMonth={field.value || new Date(2000, 0)}
                    fromYear={minYear}
                    toYear={maxYear}
                    captionLayout="dropdown-buttons"
                    className="rounded-md border-none shadow-none"
                  />
                </PopoverContent>
              </Popover>
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
                  <Input className="pl-10" {...field} placeholder="เช่น ไทย, Laos, Myanmar" />
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
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                สามารถกรอกได้ทั้งภาษาไทยและภาษาอังกฤษ
              </div>
              <FormControl>
                <div className="relative">
                  <Textarea className="min-h-[80px]" {...field} placeholder="บ้านเลขที่ ถนน ซอย เช่น 123/45 ถ.สุขุมวิท ซ.15" />
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
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleProvinceChange(value);
                  // Clear dependent fields
                  form.setValue("district", "");
                  form.setValue("subdistrict", "");
                  form.setValue("zip_code", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกจังหวัด" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>กำลังโหลดข้อมูล...</SelectItem>
                  ) : provinces.map((province) => (
                    <SelectItem key={province.id} value={province.name_th}>
                      {province.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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
                onValueChange={(value) => {
                  field.onChange(value);
                  handleAmphureChange(value);
                  // Clear dependent fields
                  form.setValue("subdistrict", "");
                  form.setValue("zip_code", "");
                }}
                value={field.value}
                disabled={!form.getValues("province")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกอำเภอ/เขต" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!form.getValues("province") ? (
                    <SelectItem value="select-province" disabled>โปรดเลือกจังหวัดก่อน</SelectItem>
                  ) : filteredAmphures.length === 0 ? (
                    <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
                  ) : filteredAmphures.map((amphure) => (
                    <SelectItem key={amphure.id} value={amphure.name_th}>
                      {amphure.name_th}
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
                onValueChange={handleTambonSelect}
                value={field.value}
                disabled={!form.getValues("district")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกตำบล/แขวง" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!form.getValues("district") ? (
                    <SelectItem value="select-district" disabled>โปรดเลือกอำเภอ/เขตก่อน</SelectItem>
                  ) : filteredTambons.length === 0 ? (
                    <SelectItem value="no-data" disabled>ไม่พบข้อมูล</SelectItem>
                  ) : filteredTambons.map((tambon) => (
                    <SelectItem key={tambon.id} value={tambon.name_th}>
                      {tambon.name_th}
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
                  <Input 
                    className="pl-10" 
                    {...field} 
                    placeholder="เช่น 10110" 
                    style={zipCode ? { backgroundColor: "#f3f4f6" } : {}}
                  />
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
                    placeholder="เช่น example@email.com"
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
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />

        {/* Confirm Password */}
        <PasswordInput
          name="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          placeholder="กรอกรหัสผ่านอีกครั้ง"
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
