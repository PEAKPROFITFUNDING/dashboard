import { Paperclip, Download } from "lucide-react";

interface FileAttachmentProps {
  filename: string;
  onDownload?: (filename: string) => void; // ✅ accepts filename
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  filename,
  onDownload,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm hover:shadow-md transition dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2 overflow-hidden">
        <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        <span className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
          {filename}
        </span>
      </div>
      {onDownload && (
        <button
          onClick={() => onDownload(filename)} // ✅ pass filename
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
        >
          <Download className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FileAttachment;
