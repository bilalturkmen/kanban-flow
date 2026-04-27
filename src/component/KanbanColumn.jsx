import { useState } from "react";
import { useKanban } from "../context/useKanban";
import { Plus, Trash2 } from "lucide-react";
import KanbanTask from "./KanbanTask";

const getStatusColor = (title) => {
  const t = title.toLowerCase();
  if (t.includes("to do"))
    return "border-t-slate-400 text-slate-500 bg-slate-400";
  if (t.includes("progress"))
    return "border-t-amber-500 text-amber-600 bg-amber-500";
  if (t.includes("done"))
    return "border-t-emerald-500 text-emerald-600 bg-emerald-500";
  return "border-t-blue-500 text-blue-600 bg-blue-500"; // Default
};

export default function KanbanColumn({ column }) {
  const { dispatch, clearAllActions } = useKanban();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(column.title);
  const statusColors = getStatusColor(column.title);
  return (
    <section
      className={`flex flex-col w-full md:min-w-[320px] md:max-w-[320px] bg-slate-100 dark:bg-slate-900/50 rounded-2xl border-slate-300 border-t-4 border-x border-b dark:border-slate-800 max-h-full shrink-0 ${statusColors.split(" ")[0]}`}
    >
      <header className="p-4 flex items-center justify-between group/header">
        <div className="flex-1 mr-2 overflow-hidden">
          {isEditingTitle ? (
            <input
              autoFocus
              className="w-full bg-white dark:bg-slate-800 px-2 py-1 rounded border border-blue-500 outline-none text-sm"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={() => {
                dispatch({
                  type: "UPDATE_COLUMN_TITLE",
                  id: column.id,
                  title: tempTitle,
                });
                setIsEditingTitle(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          ) : (
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`w-2 h-2 shrink-0 rounded-full ${statusColors.split(" ")[2]}`}
              />
              <h3
                onClick={() => setIsEditingTitle(true)}
                className={`font-black text-xs uppercase tracking-[0.2em] cursor-pointer truncate ${statusColors.split(" ")[1]}`}
              >
                {column.title}
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold shrink-0">
                {column.tasks.length}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 bg-slate-200/30 dark:bg-slate-900/30 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 transition-all group-hover/header:bg-slate-200/60 dark:group-hover/header:bg-slate-700/60">
          <button
            onClick={() => {
              clearAllActions();
              dispatch({ type: "ADD_TASK", id: column.id });
            }}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-all active:scale-90 shadow-sm shadow-transparent hover:shadow-blue-200/20"
            title="Add Task"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => dispatch({ type: "DELETE_COLUMN", id: column.id })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-50 group-hover/header:opacity-100 active:scale-90"
            title="Delete Column"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-12.5 custom-scrollbar">
        {column.tasks.map((task) => (
          <KanbanTask key={task.id} task={task} columnId={column.id} />
        ))}
      </div>
      <div className="h-4 shrink-0" />
    </section>
  );
}
