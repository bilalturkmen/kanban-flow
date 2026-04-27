import { useEffect, useRef, useState } from "react";
import { useKanban } from "../context/useKanban";
import { User } from "lucide-react";

export default function UserMenu() {
  const { clearAllActions } = useKanban();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.preventDefault();
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
      clearAllActions();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);
    document.addEventListener("mousedown", (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) handleClose();
    });
    return () => document.removeEventListener("mousedown", handleClose);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onMouseDown={toggleMenu}
        className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-yellow-400 transition-all"
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: "translateX(-87%)",
          }}
          className="w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 py-2 z-9999 animate-in fade-in zoom-in duration-150 origin-top"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-700/50">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              User Name
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              info@example.com
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              Profile Settings
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              Workspace Config
            </button>
            <div className="h-px bg-slate-50 dark:bg-slate-700/50 my-1 mx-2" />
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <div className="w-1 h-1 rounded-full bg-red-500" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
