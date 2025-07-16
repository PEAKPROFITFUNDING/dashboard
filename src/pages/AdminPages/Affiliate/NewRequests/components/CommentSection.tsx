import { useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import TextArea from "../../../../../components/form/input/TextArea";
import { AffiliateRequest, Comment } from "./types";

interface CommentSectionProps {
  request: AffiliateRequest;
  onCommentAdd: (id: number, comment: Comment) => void;
}

export default function CommentSection({
  request,
  onCommentAdd,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    onCommentAdd(request.id, comment);
    setNewComment("");
  };

  return (
    <div className="space-y-4 ">
      {/* Add Comment */}
      <div className="">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Add Internal Comment
        </label>
        <div className="flex gap-2">
          <TextArea
            value={newComment}
            onChange={setNewComment}
            placeholder="Add an internal comment..."
            rows={3}
            className="flex-1"
          />
          <Button
            size="sm"
            variant="primary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="self-end"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Comments Log */}
      {request.comments && request.comments.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comment History
          </label>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {request.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
              >
                <p className="text-gray-900 dark:text-white text-sm mb-1">
                  {comment.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
