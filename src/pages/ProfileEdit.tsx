
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/userService";
import { Loader2 } from "lucide-react";
import ProfileForm, { profileFormSchema } from "@/components/profile/ProfileForm";

// Export form type for reuse in child components
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEdit() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId, userEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);

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
          console.log("Loaded user profile data:", userData);
          // Format date if it exists
          const formattedDate = userData.dob ? userData.dob : "";
          
          // Set profile data for the form including location data
          setProfileData({
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
          
          console.log("Location data loaded:", {
            province: userData.province || "",
            district: userData.district || "",
            subdistrict: userData.subdistrict || "",
            zip_code: userData.zip_code || "",
          });
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
  }, [userId, navigate, toast]);

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
              <ProfileForm 
                userId={userId} 
                userEmail={userEmail} 
                initialData={profileData} 
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
