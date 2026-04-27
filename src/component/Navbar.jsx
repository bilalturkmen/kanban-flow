import { Layout, Moon, Plus, Sun } from "lucide-react";
import { useKanban } from "../context/useKanban";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { dispatch, clearAllActions, isDark, toggleTheme } = useKanban();
  return (
    <nav className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Layout className="text-blue-600" size={24} />
        <h1 className="text-xl font-bold tracking-tight">KanbanFlow</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            clearAllActions();
            dispatch({ type: "ADD_COLUMN" });
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="hidden md:inline">Add New List</span>
        </button>
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
