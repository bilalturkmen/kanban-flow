import { useEffect, useRef, useState } from "react";
import { useKanban } from "../context/useKanban";
import { ArrowRightLeft, ChevronRight } from "lucide-react";

export default function MoveToDropdown({ task, columnId, columns, onMove }) {
  const { movingTaskId, setMovingTaskId, clearAllActions } = useKanban();
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const isMoving = movingTaskId === task.id;

  useEffect(() => {
    if (!isMoving) return;

    const handleClose = () => setMovingTaskId(null);
    document.addEventListener("mousedown", (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        handleClose();
    });
    window.addEventListener("scroll", handleClose, true);

    return () => {
      document.removeEventListener("mousedown", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, [isMoving, setMovingTaskId]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isMoving) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
      clearAllActions();
      setMovingTaskId(task.id);
    } else {
      setMovingTaskId(null);
    }
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onMouseDown={toggleDropdown}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isMoving
            ? "bg-blue-600 text-white shadow-lg scale-110"
            : "text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm"
        }`}
        title="Move Task"
      >
        <ArrowRightLeft size={14} />
      </button>

      {isMoving && (
        <div
          style={{
            position: "fixed",
            top: `${coords.top - 8}px`,
            left: `${coords.left}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="w-44 bg-white dark:bg-slate-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 py-2 z-9999 animate-in fade-in zoom-in duration-150"
        >
          <div className="px-3 py-1.5 mb-1 border-b border-slate-50 dark:border-slate-700/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Move To
            </span>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {columns
              .filter((col) => col.id !== columnId)
              .map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    onMove(col.id);
                    setMovingTaskId(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all group"
                >
                  {col.title}
                  <ChevronRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  />
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
