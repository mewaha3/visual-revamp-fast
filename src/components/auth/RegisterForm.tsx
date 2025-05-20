
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { IdCard, FileText, Upload } from "lucide-react";
import PasswordInput from "@/components/auth/PasswordInput";
import DocumentUpload from "@/components/upload/DocumentUpload";
import { nationalities } from "@/data/nationalities";
import { useToast } from "@/hooks/use-toast";

// Create schema for form validation
const registerSchema = z.object({
  firstName: z.string().min(2, { message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" }),
  lastName: z.string().min(2, { message: "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร" }),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" }),
  confirmPassword: z.string(),
  nationality: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "คุณต้องยอมรับข้อตกลงและเงื่อนไข",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { toast } = useToast();
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [nationality, setNationality] = useState("Thai");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      nationality: "Thai",
      acceptTerms: false,
    },
  });

  function onSubmit(data: RegisterFormValues) {
    toast({
      title: "ลงทะเบียนสำเร็จ",
      description: "ยินดีต้อนรับสู่ FastLabor",
    });
    console.log(data);
  }

  const handleNationalityChange = (value: string) => {
    setNationality(value);
    form.setValue("nationality", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ</FormLabel>
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
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input placeholder="นามสกุล" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สัญชาติ</FormLabel>
              <Select
                onValueChange={handleNationalityChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสัญชาติ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  {nationalities.map((nationality) => (
                    <SelectItem key={nationality} value={nationality}>
                      {nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Documents section based on nationality */}
        {showDocumentUpload && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">เอกสารที่ต้องใช้</h3>
              {nationality === "Thai" ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <IdCard className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">สำเนาบัตรประชาชน</p>
                      <p className="text-sm text-gray-500">อัพโหลดสำเนาบัตรประชาชน</p>
                      <DocumentUpload type="idCard" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">หนังสือเดินทาง (Passport)</p>
                      <p className="text-sm text-gray-500">อัพโหลดสำเนาหนังสือเดินทาง</p>
                      <DocumentUpload type="passport" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">หนังสือวีซ่า (Visa)</p>
                      <p className="text-sm text-gray-500">อัพโหลดสำเนาวีซ่า</p>
                      <DocumentUpload type="visa" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">หนังสืออนุญาตทำงาน (Work Permit)</p>
                      <p className="text-sm text-gray-500">อัพโหลดสำเนาใบอนุญาตทำงาน</p>
                      <DocumentUpload type="workPermit" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสผ่าน</FormLabel>
              <FormControl>
                <PasswordInput placeholder="รหัสผ่าน" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
              <FormControl>
                <PasswordInput placeholder="ยืนยันรหัสผ่าน" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  ฉันยอมรับ <Link to="/terms" className="text-fastlabor-600 hover:underline">ข้อตกลงและเงื่อนไข</Link> ของ FastLabor
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => setShowDocumentUpload(!showDocumentUpload)}
          >
            <Upload className="mr-2 h-4 w-4" />
            {showDocumentUpload ? "ซ่อน" : "แสดง"}หัวข้ออัพโหลดเอกสาร
          </Button>
          
          <Button type="submit" className="w-full bg-fastlabor-600 hover:bg-fastlabor-700">
            สมัครสมาชิก
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="text-fastlabor-600 hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
