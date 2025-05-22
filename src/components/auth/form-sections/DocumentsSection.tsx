
import { useFormContext } from "react-hook-form";
import DocumentUpload from "@/components/upload/DocumentUpload";
import { useState } from "react";

interface DocumentsState {
  id_card: File | null;
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
  const nationality = form.watch("nationality");
  const isThai = nationality === "Thai";
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold pt-4">อัพโหลดเอกสาร</h2>
      
      {isThai ? (
        <DocumentUpload 
          title="สำเนาบัตรประชาชน (ID Card)" 
          onChange={(file) => onDocumentUpload("id_card", file)} 
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
