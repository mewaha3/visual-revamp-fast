
import { useFormContext } from "react-hook-form";
import DocumentUpload from "@/components/upload/DocumentUpload";
import { useState } from "react";

interface DocumentsState {
  certificate: File | null;
  passport: File | null;
  visa: File | null;
  work_permit: File | null;
}

const DocumentsSection = ({ 
  onDocumentUpload 
}: { 
  onDocumentUpload: (type: keyof DocumentsState, file: File | null) => void 
}) => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold pt-4">อัพโหลดเอกสาร</h2>
      {/* Show ID Card upload only for Thai nationals */}
      {form.watch("nationality") === "Thai" ? (
        <DocumentUpload 
          title="สำเนาบัตรประชาชน (ID Card)" 
          onChange={(file) => onDocumentUpload("certificate", file)} 
        />
      ) : (
        <>
          <DocumentUpload 
            title="หนังสือเดินทาง (Passport)" 
            onChange={(file) => onDocumentUpload("passport", file)} 
          />
          <DocumentUpload 
            title="หนังสือวีซ่า (Visa)" 
            onChange={(file) => onDocumentUpload("visa", file)} 
          />
          <DocumentUpload 
            title="หนังสืออนุญาตทำงาน (Work Permit)" 
            onChange={(file) => onDocumentUpload("work_permit", file)} 
          />
        </>
      )}
    </div>
  );
};

export default DocumentsSection;
