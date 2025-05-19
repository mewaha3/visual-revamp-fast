
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const FindJob = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    skills: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    salary: "",
    payPeriod: "",
    address: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would send data to your backend
      console.log("Submitting worker data:", formData);
      
      // For now, just show a success message
      toast.success("ลงทะเบียนหางานสำเร็จ");
    } catch (error) {
      console.error("Error submitting job request:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            Find Job <span className="text-blue-500">🔍</span>
          </h1>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <img 
              src="/lovable-uploads/365674fc-1bea-4770-b4cb-f2f99ec0e841.png"
              alt="FastLabor Logo" 
              className="w-24 h-24 mx-auto mb-6"
            />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Job Information</h2>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Enter job title you're looking for"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Enter skills separated by commas"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <Select
                      value={formData.startTime}
                      onValueChange={(value) => handleSelectChange("startTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                    <Select
                      value={formData.endTime}
                      onValueChange={(value) => handleSelectChange("endTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="Enter expected salary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="payPeriod" className="block text-sm font-medium text-gray-700 mb-1">Pay Period *</label>
                    <Select
                      value={formData.payPeriod}
                      onValueChange={(value) => handleSelectChange("payPeriod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pay period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">รายวัน</SelectItem>
                        <SelectItem value="weekly">รายสัปดาห์</SelectItem>
                        <SelectItem value="monthly">รายเดือน</SelectItem>
                        <SelectItem value="project">ตามโปรเจค</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Address Information</h2>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address (House No, Street, Area) *</label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-medium text-gray-700">Location Details</h2>
                
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => handleSelectChange("province", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
                      <SelectItem value="chiang_mai">เชียงใหม่</SelectItem>
                      <SelectItem value="phuket">ภูเก็ต</SelectItem>
                      <SelectItem value="chonburi">ชลบุรี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => handleSelectChange("district", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="district1">เขตพระนคร</SelectItem>
                      <SelectItem value="district2">เขตดุสิต</SelectItem>
                      <SelectItem value="district3">เขตหนองจอก</SelectItem>
                      <SelectItem value="district4">เขตบางรัก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="subdistrict" className="block text-sm font-medium text-gray-700 mb-1">Subdistrict *</label>
                  <Select
                    value={formData.subdistrict}
                    onValueChange={(value) => handleSelectChange("subdistrict", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subdistrict" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subdistrict1">แขวงตลาดยอด</SelectItem>
                      <SelectItem value="subdistrict2">แขวงวังบูรพาภิรมย์</SelectItem>
                      <SelectItem value="subdistrict3">แขวงจักรวรรดิ</SelectItem>
                      <SelectItem value="subdistrict4">แขวงสำราญราษฎร์</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
              >
                Find Job
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindJob;
