
import { useState } from "react";
import { Upload } from "lucide-react";
import { ReactNode } from "react";

interface DocumentUploadProps {
  title: string;
  onChange: (file: File | null) => void;
  icon?: ReactNode;
}

const DocumentUpload = ({ title, onChange, icon }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      setFile(uploadedFile);
      onChange(uploadedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      onChange(uploadedFile);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium mb-2 flex items-center">
        {icon && icon}
        {title}
      </h3>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : file
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? (
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
            <span className="text-sm">{file.name}</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">ลากแล้ววางไฟล์ที่นี่</p>
            <p className="text-xs text-gray-400">สูงสุด 20MB • PDF, PNG, JPG</p>
          </>
        )}
      </div>

      <div className="mt-2 flex justify-center">
        <input
          type="file"
          id={`file-${title}`}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        <label
          htmlFor={`file-${title}`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
        >
          {file ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
        </label>
      </div>
    </div>
  );
};

export default DocumentUpload;
