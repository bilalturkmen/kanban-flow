import { useState } from "react";
import { useKanban } from "../context/useKanban";
import { Check, SquarePen, Trash2, X } from "lucide-react";
import MoveToDropdown from "./MoveToDropdown";

export default function KanbanTask({ task, columnId }) {
  const {
    columns,
    dispatch,
    editingTaskId,
    setEditingTaskId,
    deletingTaskId,
    setDeletingTaskId,
  } = useKanban();

  const [tempContent, setTempContent] = useState(task.content);

  // Global State Checks
  const isEditing = editingTaskId === task.id;
  const isDeleting = deletingTaskId === task.id;

  // Actions
  const handleCancel = () => {
    setTempContent(task.content);
    setEditingTaskId(null);
  };

  const handleSave = () => {
    if (tempContent.trim() === "") return handleCancel();
    dispatch({ type: "UPDATE_TASK", id: task.id, content: tempContent });
    setEditingTaskId(null);
  };

  const startEditing = () => {
    setDeletingTaskId(null); // Close any open delete confirm
    setTempContent(task.content);
    setEditingTaskId(task.id);
  };

  const startDeleting = () => {
    setEditingTaskId(null); // Close any open edit mode
    setDeletingTaskId(task.id);
  };

  // 1. EDIT MODE
  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border-2 border-blue-500 animate-in fade-in zoom-in duration-200">
        <textarea
          autoFocus
          className="w-full bg-transparent resize-none outline-none text-sm min-h-20 text-slate-600 dark:text-slate-300"
          value={tempContent}
          onChange={(e) => setTempContent(e.target.value)}
          onBlur={handleCancel}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) handleSave();
            if (e.key === "Escape") handleCancel();
          }}
        />
        <div className="flex justify-between items-center mt-3 pt-3 border-t dark:border-slate-700">
          <span className="text-[10px] text-slate-400 font-medium italic">
            Ctrl+Enter to save
          </span>
          <div className="flex gap-2">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCancel}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <X
                size={14}
                className="text-slate-400 group-hover:text-red-500 transition-colors"
              />
              Cancel
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSave}
              className="flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm"
            >
              <Check size={14} strokeWidth={3} />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. DELETE CONFIRMATION MODE
  if (isDeleting) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border-2 border-red-100 dark:border-red-900/30 animate-in slide-in-from-right duration-200 font-sans">
        <p className="text-[11px] font-bold text-red-600 dark:text-red-400 mb-3 text-center uppercase tracking-tighter">
          Delete this task permanently?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setDeletingTaskId(null)}
            className="flex-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-2 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            No, keep it
          </button>
          <button
            onClick={() => {
              dispatch({ type: "DELETE_TASK", id: task.id });
              setDeletingTaskId(null);
            }}
            className="flex-1 bg-red-500 text-white py-2 rounded-xl text-[11px] font-bold shadow-sm hover:bg-red-600 transition-colors"
          >
            Yes, delete
          </button>
        </div>
      </div>
    );
  }

  // 3. NORMAL VIEW
  return (
    <div className="group relative bg-white dark:bg-slate-800 p-5 rounded-2xl  border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
      <div className="absolute -top-1 -right-1 w-16 h-16 bg-blue-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-5 leading-relaxed wrap-break-word">
        {task.content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tighter">
            Created
          </span>
          <span className="text-[10px] text-slate-400 font-medium italic">
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
            {" - "}
            {new Date(task.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl">
          {/* MOVE */}
          <MoveToDropdown
            task={task}
            columnId={columnId}
            columns={columns}
            onMove={(targetId) =>
              dispatch({
                type: "MOVE_TASK",
                taskId: task.id,
                targetColumnId: targetId,
              })
            }
          />

          {/* EDIT */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              startEditing();
            }}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm transition-all"
            title="Edit Task"
          >
            <SquarePen size={14} />
          </button>

          {/* DELETE */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              startDeleting();
            }}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 shadow-sm transition-all"
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
