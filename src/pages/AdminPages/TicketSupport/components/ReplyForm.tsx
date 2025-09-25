import { useRef, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import Button from "../../../../components/ui/button/Button";
import { Paperclip, Send } from "lucide-react";

export const ReplyForm = ({ ticketId, onReplyAdded }) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", message);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await axiosInstance.post(`/ticket/${ticketId}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("");
      setAttachments([]);
      onReplyAdded();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply... (Ctrl+Enter to send)"
          rows={2}
          className="w-full outline-none p-3 border border-gray-300 rounded-lg resize-none bg-white dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white"
          disabled={loading}
        />

        {attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Attachments:
            </h4>
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <Button
              size="sm"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={loading}
            >
              <Paperclip size={16} />
              Attach Files
            </Button>
            <span className="text-xs text-gray-500 ">
              {message.length}/5000 characters
            </span>
          </div>

          <Button
            size="sm"
            type="submit"
            disabled={!message.trim() || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reply"}
            <Send size={16} />
          </Button>
        </div>
      </div>
    </form>
  );
};
