
import { useState } from "react";
import { Upload } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DocumentType {
  id: string;
  name: string;
  file: File | null;
  status: "idle" | "uploading" | "success" | "error";
}

export default function UploadDocuments() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentType[]>([
    { id: "ID", name: "บัตรประชาชน", file: null, status: "idle" },
    { id: "passport", name: "หนังสือเดินทาง (Passport)", file: null, status: "idle" },
    { id: "visa", name: "หนังสือวีซ่า (Visa)", file: null, status: "idle" },
    { id: "workPermit", name: "หนังสืออนุญาตทำงาน (Work Permit)", file: null, status: "idle" },
  ]);

  function handleFileChange(documentId: string, files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, file, status: "success" } : doc
        )
      );
      toast({
        title: "อัพโหลดสำเร็จ",
        description: `อัพโหลดไฟล์ ${file.name} สำเร็จแล้ว`,
      });
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(documentId: string, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFileChange(documentId, e.dataTransfer.files);
  }

  async function handleSubmit() {
    // Count uploaded documents
    const uploadedCount = documents.filter(doc => doc.file).length;
    
    if (uploadedCount === 0) {
      toast({
        title: "กรุณาอัพโหลดเอกสาร",
        description: "คุณยังไม่ได้อัพโหลดเอกสารใดๆ",
        variant: "destructive"
      });
      return;
    }

    // Simulate submission
    toast({
      title: "ส่งเอกสารสำเร็จ",
      description: `ส่งเอกสารจำนวน ${uploadedCount} รายการสำเร็จแล้ว`,
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-16">
        <div className="container max-w-3xl space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            อัพโหลดเอกสาร
          </h1>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2" /> อัพโหลดเอกสาร
            </h2>
            <p className="text-center text-gray-600 mb-6">
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

            <div className="mt-8 flex justify-center">
              <Button onClick={handleSubmit} className="bg-fastlabor-600 hover:bg-fastlabor-700">
                ส่งเอกสารทั้งหมด
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
