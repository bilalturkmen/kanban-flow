import { useKanban } from "./context/useKanban";
import Navbar from "./component/Navbar";
import KanbanColumn from "./component/KanbanColumn";
import FooterAttribution from "./component/FooterAttribution";

export default function App() {
  const { columns } = useKanban();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header>
        <Navbar />
      </header>
      <main className="p-4 md:p-6 h-[calc(100vh-140px)]">
        <div className="flex flex-col md:flex-row gap-6 md:overflow-x-auto h-full pb-6 items-start">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
          <div className="min-w-px h-1 md:h-full" />
        </div>
      </main>
      <footer>
        <FooterAttribution />
      </footer>
    </div>
  );
}
