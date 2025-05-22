import { useFormContext } from "react-hook-form";
import DocumentUpload from "@/components/upload/DocumentUpload";
import { useState, useEffect } from "react";

interface DocumentsState {
  id_card: File | null;
  passport: File | null;
  visa: File | null;
  work_permit: File | null;
}

interface DocumentsSectionProps {
  onDocumentUpload: (type: keyof DocumentsState, file: File | null) => void;
  nationality?: string; // Make nationality optional and allow it to be passed directly
}

const DocumentsSection = ({ 
  onDocumentUpload,
  nationality: externalNationality 
}: DocumentsSectionProps) => {
  // Try to use the form context if available
  const formContext = useFormContext();
  
  // Get nationality from form if available, otherwise use the prop
  const [isThai, setIsThai] = useState<boolean>(false);
  
  useEffect(() => {
    // If we have form context, use it to watch nationality
    if (formContext) {
      const nationality = formContext.watch("nationality");
      setIsThai(nationality === "Thai");
    } else if (externalNationality) {
      // Otherwise use the prop directly
      setIsThai(externalNationality === "Thai");
    }
  }, [formContext, externalNationality]);
  
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
