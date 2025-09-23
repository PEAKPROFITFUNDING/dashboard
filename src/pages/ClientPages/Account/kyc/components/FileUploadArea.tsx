import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  Upload,
  X,
} from "lucide-react";
import Label from "../../../../../components/form/Label";
import { Image } from "antd";
import { FilePreview, KycFormData, KycFormErrors } from "./KYCForm";

type FileUploadAreaProps = {
  fieldName: keyof KycFormData;
  label: string;
  currentFile: File | null;
  preview: FilePreview | null;
  inputRef: React.RefObject<HTMLInputElement>;
  removeFile: (fieldName: keyof KycFormData) => void;
  errors: KycFormErrors;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof KycFormData
  ) => void;
};

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  fieldName,
  label,
  currentFile,
  preview,
  inputRef,
  removeFile,
  errors,
  handleFileUpload,
}) => (
  <div>
    <Label className="mb-3 block">
      {label} <span className="text-red-500">*</span>
    </Label>

    {!currentFile ? (
      <div
        onClick={() => {
          inputRef.current?.click();
        }}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          PNG, JPG or PDF (max. 10MB)
        </p>
      </div>
    ) : (
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {preview?.type === "application/pdf" ? (
              <FileText className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {preview?.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => removeFile(fieldName)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {preview?.type !== "application/pdf" && (
          <div className="flex items-center gap-2">
            <Image
              width={80}
              height={60}
              src={preview?.url}
              className="rounded border object-cover"
              preview={{
                mask: (
                  <div className="flex items-center justify-center">
                    <Eye className="h-4 w-4" />
                  </div>
                ),
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Change file
            </button>
          </div>
        )}

        {preview?.type === "application/pdf" && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Change file
          </button>
        )}
      </div>
    )}

    <input
      ref={inputRef}
      type="file"
      accept="image/*,.pdf"
      onChange={(e) => handleFileUpload(e, fieldName)}
      className="hidden"
    />

    {errors[fieldName] && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {errors[fieldName]}
      </p>
    )}
  </div>
);
