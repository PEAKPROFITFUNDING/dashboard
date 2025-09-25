import { useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import Button from "../../../../components/ui/button/Button";
import toast from "react-hot-toast";

// Internal Notes Component
export const InternalNotes = ({ ticketId, notes, onNoteAdded }) => {
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/admin/ticketNote/${ticketId}`, {
        note: newNote,
      });
      setNewNote("");
      onNoteAdded();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] border-gray-200  rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Internal Notes
      </h3>

      {notes && notes.length > 0 && (
        <div className="space-y-3 mb-5">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 min-h-28 flex flex-col justify-between"
            >
              <div>
                <span className="font-medium text-sm text-gray-00 dark:text-gray-200">
                  {note.admin.name}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {note.note}
                </p>
              </div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {formatDate(note.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddNote} className="space-y-3  ">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write an internal note..."
          rows={3}
          className="w-full p-3 border border-gray-300 text-sm rounded-lg resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <Button
          size="sm"
          type="submit"
          disabled={!newNote.trim() || loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding..." : "Add Note"}
        </Button>
      </form>
    </div>
  );
};
