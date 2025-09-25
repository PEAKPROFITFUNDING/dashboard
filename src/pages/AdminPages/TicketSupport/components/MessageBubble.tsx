import FileAttachment from "./FileAttachment";

export const MessageBubble = ({ reply, isFromSupport }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDownload = (filename) => {
    // Implementation for file download
    window.open(`/api/attachments/${filename}`, "_blank");
  };

  const supportMessageRoundedClass = "rounded-t-xl rounded-bl-xl";
  const userMessageRoundedClass = " rounded-b-xl rounded-tr-xl";

  return (
    <div
      className={`flex gap-3 mb-4 ${
        isFromSupport ? "justify-end" : "justify-start"
      }`}
    >
      {/* {!isFromSupport && <Avatar name={reply.user.name} size="sm" />} */}
      <div className={`min-w-72 ${isFromSupport ? "order-first" : ""}`}>
        <div
          className={`rounded-xs px-4 py-3 shadow-sm ${
            isFromSupport
              ? `bg-blue-500 text-white self-start ${supportMessageRoundedClass}`
              : `bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white self-end ${userMessageRoundedClass}`
          }`}
        >
          <div className="flex flex-col space-y-1">
            {/* Sender Name */}
            <span className="text-xs font-semibold opacity-90">
              {isFromSupport ? "Support" : reply.user.name}
            </span>

            {/* Message */}
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {reply.message}
            </p>

            {/* Attachments */}
            {reply.attachments && reply.attachments.length > 0 && (
              <div className="space-y-2 mt-2">
                {reply.attachments.map((attachment, index) => (
                  <FileAttachment
                    key={index}
                    filename={attachment.originalName || attachment.filename}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}

            {/* Timestamp */}
            <span
              className={`text-[10px] mt-1 self-end ${
                isFromSupport
                  ? "text-blue-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {formatDate(reply.createdAt)}
            </span>
          </div>
        </div>
      </div>
      {/* {isFromSupport && <Avatar name="Support" size="sm" />} */}
    </div>
  );
};
