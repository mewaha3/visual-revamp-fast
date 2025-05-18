
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DocumentType {
  id: string;
  name: string;
  file: File | null;
  status: "idle" | "uploading" | "success" | "error";
}

const UploadDocuments = () => {
  const navigate = useNavigate();
  
  const [documents, setDocuments] = useState<DocumentType[]>([
    { id: "certificate", name: "หนังสือรับรอง (Certificate)", file: null, status: "idle" },
    { id: "passport", name: "หนังสือเดินทาง (Passport)", file: null, status: "idle" },
    { id: "visa", name: "หนังสือวีซ่า (Visa)", file: null, status: "idle" },
    { id: "workPermit", name: "หนังสืออนุญาตทำงาน (Work Permit)", file: null, status: "idle" },
  ]);

  const handleFileChange = (documentId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, file, status: "success" } 
            : doc
        )
      );
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (documentId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(documentId, e.dataTransfer.files);
  };

  const handleSubmit = () => {
    // In a real app, you would upload the files to your server
    // For now, let's just log the files and navigate to a success page
    const filesToUpload = documents.filter(doc => doc.file !== null);
    console.log("Files to upload:", filesToUpload);
    
    // Navigate to login page or show success message
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 md:py-16">
        <div className="container max-w-3xl">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/lovable-uploads/392eeb73-6b9a-4a3a-b51c-82b3660319f9.png"
              alt="FastLabor Logo"
              className="w-16 h-16 mr-4"
            />
            <h1 className="text-2xl md:text-3xl font-bold">อัพโหลดเอกสาร</h1>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <p className="text-center text-gray-600 mb-4">
              อัพโหลดเอกสารของคุณ (รองรับ PDF หรือ PNG)
            </p>
            
            <div className="space-y-6">
              {documents.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-3">{document.name}</h3>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      document.status === "success" ? "border-green-300 bg-green-50" : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(document.id, e)}
                  >
                    {document.file ? (
                      <div className="flex items-center justify-center">
                        <div className="bg-green-100 text-green-700 p-2 rounded-full mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm">{document.file.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">ลากและวางไฟล์ที่นี่</p>
                        <p className="text-xs text-gray-400">ขนาดไฟล์ไม่เกิน 20MB ต่อไฟล์ • PDF, PNG</p>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-2 flex justify-center">
                    <input
                      type="file"
                      id={`file-${document.id}`}
                      className="hidden"
                      accept=".pdf,.png"
                      onChange={(e) => handleFileChange(document.id, e.target.files)}
                    />
                    <label
                      htmlFor={`file-${document.id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
                    >
                      เลือกไฟล์
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              className="w-full md:w-auto px-8 bg-fastlabor-600 hover:bg-fastlabor-700"
            >
              ยืนยันการอัพโหลด
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadDocuments;
