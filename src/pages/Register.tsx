// src/pages/Register.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Calendar,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DocumentType {
  id: string;
  name: string;
  file: File | null;
  status: "idle" | "success";
}

const formSchema = z.object({
  firstName: z.string().min(2, { message: "กรุณากรอกชื่อ" }),
  lastName: z.string().min(2, { message: "กรุณากรอกนามสกุล" }),
  nationalId: z
    .string()
    .length(13, { message: "เลขบัตรประชาชนต้องมี 13 หลัก" }),
  dateOfBirth: z.string({ required_error: "กรุณาเลือกวันเกิด" }),
  gender: z.string({ required_error: "กรุณาเลือกเพศ" }),
  nationality: z.string().min(1, { message: "กรุณากรอกสัญชาติ" }),
  address: z.string().min(5, { message: "กรุณากรอกที่อยู่" }),
  province: z.string({ required_error: "กรุณาเลือกจังหวัด" }),
  district: z.string({ required_error: "กรุณาเลือกอำเภอ/เขต" }),
  subDistrict: z.string({ required_error: "กรุณาเลือกตำบล/แขวง" }),
  zipCode: z.string().length(5, { message: "รหัสไปรษณีย์ต้องมี 5 หลัก" }),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  consent: z
    .boolean()
    .refine((v) => v, {
      message:
        "คุณต้องยินยอมให้บริษัทเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของคุณ",
    }),
  // we won't validate documents here in Zod; handle upload state manually
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // upload docs state
  const [documents, setDocuments] = useState<DocumentType[]>([
    { id: "ID", name: "บัตรประชาชน", file: null, status: "idle" },
    { id: "passport", name: "หนังสือเดินทาง (Passport)", file: null, status: "idle" },
    { id: "visa", name: "หนังสือวีซ่า (Visa)", file: null, status: "idle" },
    { id: "workPermit", name: "หนังสืออนุญาตทำงาน (Work Permit)", file: null, status: "idle" },
  ]);

  // full location data
  const [provincesData, setProvincesData] = useState<{ id: number; name_th: string }[]>([]);
  const [districtsData, setDistrictsData] = useState<
    { id: number; name_th: string; province_id: number }[]
  >([]);
  const [subDistrictsData, setSubDistrictsData] = useState<
    { id: number; name_th: string; amphure_id: number; zip_code: number }[]
  >([]);

  // filtered options
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [subDistrictOptions, setSubDistrictOptions] = useState<string[]>([]);

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
      consent: false,
    },
  });
  const { setValue, watch, handleSubmit, control } = form;
  const hasConsented = watch("consent");

  // load location data once
  useEffect(() => {
    async function loadLocationData() {
      const [provRes, distRes, subRes] = await Promise.all([
        fetch(
          "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
        ).then((r) => r.json()),
        fetch(
          "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
        ).then((r) => r.json()),
        fetch(
          "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
        ).then((r) => r.json()),
      ]);
      setProvincesData(provRes);
      setDistrictsData(distRes);
      setSubDistrictsData(subRes);
    }
    loadLocationData();
  }, []);

  // filter districts when province changes
  useEffect(() => {
    const provName = watch("province");
    if (provName) {
      const p = provincesData.find((p) => p.name_th === provName);
      setDistrictOptions(
        p
          ? districtsData.filter((d) => d.province_id === p.id).map((d) => d.name_th)
          : []
      );
    } else {
      setDistrictOptions([]);
    }
    setValue("district", "");
    setValue("subDistrict", "");
    setValue("zipCode", "");
  }, [watch("province"), provincesData, districtsData, setValue]);

  // filter sub-districts when district changes
  useEffect(() => {
    const distName = watch("district");
    if (distName) {
      const d = districtsData.find((d) => d.name_th === distName);
      setSubDistrictOptions(
        d
          ? subDistrictsData.filter((s) => s.amphure_id === d.id).map((s) => s.name_th)
          : []
      );
    } else {
      setSubDistrictOptions([]);
    }
    setValue("subDistrict", "");
    setValue("zipCode", "");
  }, [watch("district"), districtsData, subDistrictsData, setValue]);

  // autofill zip when sub-district changes
  useEffect(() => {
    const subName = watch("subDistrict");
    if (subName) {
      const s = subDistrictsData.find((s) => s.name_th === subName);
      setValue("zipCode", s ? String(s.zip_code) : "");
    } else {
      setValue("zipCode", "");
    }
  }, [watch("subDistrict"), subDistrictsData, setValue]);

  function handleFileChange(documentId: string, files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, file, status: "success" } : doc
        )
      );
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(documentId: string, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFileChange(documentId, e.dataTransfer.files);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // prepare row data
    const row = [
      values.firstName,
      values.lastName,
      values.nationalId,
      values.dateOfBirth,
      values.gender,
      values.nationality,
      values.address,
      values.province,
      values.district,
      values.subDistrict,
      values.zipCode,
      values.email,
      values.password,
    ];

    try {
      // send form data to your sheets API
      const resp = await fetch("http://localhost:4000/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const json = await resp.json();
      if (!json.ok) throw new Error(json.error);

      // then handle file uploads (example)
      const uploaded = documents.filter((d) => d.file);
      console.log("Uploading files:", uploaded);
      // TODO: actually upload to server...

      navigate("/Login");
    } catch (err: any) {
      console.error(err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-16">
        <div className="container max-w-3xl space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            สมัครสมาชิกใหม่
          </h1>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* -- Personal Info -- */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* firstName */}
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ชื่อจริง" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* lastName */}
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>นามสกุล <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="นามสกุล" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* nationalId */}
                  <FormField
                    control={control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หมายเลขบัตรประชาชน <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="13 หลัก" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* dateOfBirth */}
                  <FormField
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>วันเกิด <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} className="pl-10" />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* gender */}
                  <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เพศ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกเพศ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">ชาย</SelectItem>
                              <SelectItem value="female">หญิง</SelectItem>
                              <SelectItem value="other">ไม่ระบุ</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* nationality */}
                  <FormField
                    control={control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>สัญชาติ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="สัญชาติ" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* -- Address Info -- */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">ข้อมูลที่อยู่</h2>
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ที่อยู่ <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* province */}
                  <FormField
                    control={control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>จังหวัด <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกจังหวัด" />
                            </SelectTrigger>
                            <SelectContent>
                              {provincesData.map((p) => (
                                <SelectItem key={p.id} value={p.name_th}>
                                  {p.name_th}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* district */}
                  <FormField
                    control={control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>อำเภอ/เขต <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!districtOptions.length}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกอำเภอ/เขต" />
                            </SelectTrigger>
                            <SelectContent>
                              {districtOptions.map((d) => (
                                <SelectItem key={d} value={d}>
                                  {d}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* subDistrict */}
                  <FormField
                    control={control}
                    name="subDistrict"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ตำบล/แขวง <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!subDistrictOptions.length}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกตำบล/แขวง" />
                            </SelectTrigger>
                            <SelectContent>
                              {subDistrictOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* zipCode */}
                  <FormField
                    control={control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสไปรษณีย์ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* -- Account Info -- */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">ข้อมูลบัญชีผู้ใช้</h2>
                <div className="space-y-4">
                  {/* email */}
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>อีเมล <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} type="email" className="pl-10" />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* password */}
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสผ่าน <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              className="pl-10"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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

              {/* -- Upload Documents -- */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Upload className="mr-2" /> อัพโหลดเอกสาร
                </h2>
                <p className="text-center text-gray-600 mb-4">
                  อัพโหลดเอกสารของคุณ (PDF หรือ PNG)
                </p>
                <div className="space-y-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-3">{doc.name}</h3>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center ${
                          doc.status === "success"
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(doc.id, e)}
                      >
                        {doc.file ? (
                          <div className="flex items-center justify-center">
                            <div className="bg-green-100 text-green-700 p-2 rounded-full mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm">{doc.file.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-1">
                              ลากแล้ววางไฟล์ที่นี่
                            </p>
                            <p className="text-xs text-gray-400">
                              สูงสุด 20MB • PDF, PNG
                            </p>
                          </>
                        )}
                      </div>
                      <div className="mt-2 flex justify-center">
                        <input
                          type="file"
                          id={`file-${doc.id}`}
                          className="hidden"
                          accept=".pdf,.png"
                          onChange={(e) => handleFileChange(doc.id, e.target.files)}
                        />
                        <label
                          htmlFor={`file-${doc.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
                        >
                          เลือกไฟล์
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* -- Consent Checkbox -- */}
              <FormField
                control={control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v === true)}
                      />
                    </FormControl>
                    <div>
                      <FormLabel>
                        <p className="text-sm leading-relaxed">
                          ✅ ข้าพเจ้ายินยอมให้บริษัทเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
                          เพื่อวัตถุประสงค์ในการสมัครงาน การจับคู่งานกับนายจ้าง/ลูกจ้าง
                          และการติดต่อสื่อสารที่เกี่ยวข้องตามนโยบายความเป็นส่วนตัว
                        </p>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* -- Submit -- */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!hasConsented}
                  className={`w-full md:w-auto px-8 bg-fastlabor-600 hover:bg-fastlabor-700 ${
                    !hasConsented
                      ? "opacity-50 cursor-not-allowed hover:bg-fastlabor-600"
                      : ""
                  }`}
                >
                  สมัครสมาชิก
                </Button>
              </div>

              {/* -- Login Link -- */}
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
}
