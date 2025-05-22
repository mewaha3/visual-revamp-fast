
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import useThailandLocations from "@/hooks/useThailandLocations";

// Define form validation schema
const profileFormSchema = z.object({
  first_name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  last_name: z.string().min(1, { message: "กรุณากรอกนามสกุล" }),
  national_id: z.string().min(1, { message: "กรุณากรอกเลขบัตรประชาชนหรือพาสปอร์ต" }),
  dob: z.string().min(1, { message: "กรุณาเลือกวันเกิด" }),
  gender: z.string().min(1, { message: "กรุณาเลือกเพศ" }),
  nationality: z.string().min(1, { message: "กรุณาเลือกสัญชาติ" }),
  address: z.string().min(1, { message: "กรุณากรอกที่อยู่" }),
  province: z.string().min(1, { message: "กรุณาเลือกจังหวัด" }),
  district: z.string().min(1, { message: "กรุณาเลือกอำเภอ/เขต" }),
  subdistrict: z.string().min(1, { message: "กรุณาเลือกตำบล/แขวง" }),
  zip_code: z.string().min(1, { message: "กรุณากรอกรหัสไปรษณีย์" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEdit() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId, userEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize Thailand locations hook
  const {
    provinces,
    filteredAmphures,
    filteredTambons,
    isLoading: isLocationLoading,
    error: locationError,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
    zipCode,
  } = useThailandLocations();

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
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
    },
  });

  // Load user profile data
  useEffect(() => {
    async function loadUserProfile() {
      if (!userId) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        const userData = await getUserProfile(userId);
        
        if (userData) {
          // Format date if it exists
          const formattedDate = userData.dob ? userData.dob : "";
          
          form.reset({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            national_id: userData.national_id || "",
            dob: formattedDate,
            gender: userData.gender || "",
            nationality: userData.nationality || "",
            address: userData.address || "",
            province: userData.province || "",
            district: userData.district || "",
            subdistrict: userData.subdistrict || "",
            zip_code: userData.zip_code || "",
          });
          
          // Initialize cascading location dropdowns with existing values
          if (userData.province) {
            handleProvinceChange(userData.province);
            
            if (userData.district) {
              handleAmphureChange(userData.district);
              
              if (userData.subdistrict) {
                handleTambonChange(userData.subdistrict);
              }
            }
          }
        } else {
          toast({
            title: "ไม่พบข้อมูลผู้ใช้",
            description: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, [userId, navigate, toast, form, handleProvinceChange, handleAmphureChange, handleTambonChange]);

  // Handle form submission
  async function onSubmit(values: ProfileFormValues) {
    if (!userId) {
      toast({
        title: "ไม่พบข้อมูลผู้ใช้",
        description: "กรุณาเข้าสู่ระบบใหม่",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update profile with submitted values
      const success = await updateUserProfile(userId, {
        ...values,
        email: userEmail,
        // Dynamically calculate fullName from first_name and last_name
        fullName: `${values.first_name} ${values.last_name}`,
        updatedAt: new Date().toISOString()
      });

      if (success) {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "ข้อมูลโปรไฟล์ของคุณได้รับการอัปเดตเรียบร้อยแล้ว",
        });
        // Redirect back to home page after successful update
        navigate("/");
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  // Update zip_code when tambon changes
  useEffect(() => {
    if (zipCode) {
      form.setValue("zip_code", zipCode);
    }
  }, [zipCode, form]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            แก้ไขข้อมูลส่วนตัว
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-fastlabor-600" />
              <span className="ml-2 text-fastlabor-700">กำลังโหลดข้อมูล...</span>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email field - readonly */}
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <Input
                      type="email"
                      value={userEmail || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </FormItem>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First name */}
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ชื่อ</FormLabel>
                          <FormControl>
                            <Input placeholder="ชื่อ" {...field} />
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
                          <FormLabel>นามสกุล</FormLabel>
                          <FormControl>
                            <Input placeholder="นามสกุล" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ID */}
                  <FormField
                    control={form.control}
                    name="national_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เลขบัตรประชาชน/พาสปอร์ต</FormLabel>
                        <FormControl>
                          <Input placeholder="เลขบัตรประชาชนหรือพาสปอร์ต" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date of birth */}
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>วันเกิด</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>เพศ</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                          <FormLabel>สัญชาติ</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="เลือกสัญชาติ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Thai">ไทย</SelectItem>
                              <SelectItem value="Myanmar">เมียนมาร์</SelectItem>
                              <SelectItem value="Laos">ลาว</SelectItem>
                              <SelectItem value="Cambodia">กัมพูชา</SelectItem>
                              <SelectItem value="Vietnam">เวียดนาม</SelectItem>
                              <SelectItem value="Other">อื่นๆ</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ที่อยู่</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="บ้านเลขที่ หมู่ ซอย ถนน" 
                            {...field}
                            className="min-h-[80px]"  
                          />
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
                        <FormLabel>จังหวัด</FormLabel>
                        <Select 
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleProvinceChange(value);
                            // Clear dependent fields
                            form.setValue("district", "");
                            form.setValue("subdistrict", "");
                            form.setValue("zip_code", "");
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกจังหวัด" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLocationLoading ? (
                              <SelectItem value="loading" disabled>กำลังโหลดข้อมูล...</SelectItem>
                            ) : provinces.map((province) => (
                              <SelectItem key={province.id} value={province.name_th}>
                                {province.name_th}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {locationError && <p className="text-sm text-red-500 mt-1">{locationError}</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* District */}
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>อำเภอ/เขต</FormLabel>
                          <Select 
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleAmphureChange(value);
                              // Clear dependent fields
                              form.setValue("subdistrict", "");
                              form.setValue("zip_code", "");
                            }}
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
                          <FormLabel>ตำบล/แขวง</FormLabel>
                          <Select 
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleTambonChange(value);
                            }}
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
                          <FormLabel>รหัสไปรษณีย์</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="รหัสไปรษณีย์" 
                              {...field} 
                              readOnly={!!zipCode}
                              className={zipCode ? "bg-gray-50" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="w-full sm:w-auto"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-fastlabor-600 hover:bg-fastlabor-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          กำลังบันทึกข้อมูล...
                        </>
                      ) : (
                        "บันทึกข้อมูล"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
