
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  type: "idCard" | "passport" | "visa" | "workPermit";
}

export default function DocumentUpload({ type }: DocumentUploadProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "ไฟล์ใหญ่เกินไป",
          description: "กรุณาอัพโหลดไฟล์ที่มีขนาดไม่เกิน 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        toast({
          title: "ประเภทไฟล์ไม่รองรับ",
          description: "รองรับไฟล์ประเภท JPG, PNG และ PDF เท่านั้น",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      simulateUpload(selectedFile);
    }
  };

  const simulateUpload = (file: File) => {
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      
      toast({
        title: "อัพโหลดสำเร็จ",
        description: `อัพโหลดไฟล์ ${file.name} เรียบร้อยแล้ว`
      });
    }, 1500);
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        id={`file-${type}`}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
      />
      <label htmlFor={`file-${type}`}>
        {file ? (
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              className="text-sm flex items-center text-green-600 border-green-200 bg-green-50"
              disabled
            >
              <Check className="h-4 w-4 mr-1" />
              {file.name}
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            type="button"
            className="text-sm"
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            {uploading ? "กำลังอัพโหลด..." : "เลือกไฟล์"}
          </Button>
        )}
      </label>
    </div>
  );
}
