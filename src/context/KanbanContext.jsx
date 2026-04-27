import { createContext, useLayoutEffect, useReducer, useState } from "react";

const KanbanContext = createContext(null);
const DEFAULT_DATA = [
  {
    id: createId("column"),
    title: "To Do",
    tasks: [
      {
        id: createId("task"),
        content: "Design new landing page",
        createdAt: new Date("2026-04-23T20:10:00"),
      },
      {
        id: createId("task"),
        content: "Set up database schema",
        createdAt: new Date("2026-04-24T12:20:00"),
      },
    ],
  },
  { id: createId("column"), title: "In Progress", tasks: [] },
  { id: createId("column"), title: "Done", tasks: [] },
];

function createId(prefix = "id") {
  return `${prefix}-${crypto.randomUUID()}`;
}

function columnsReducer(state, action) {
  switch (action.type) {
    case "ADD_COLUMN":
      return [
        ...state,
        { id: `col-${crypto.randomUUID()}`, title: "New List", tasks: [] },
      ];
    case "DELETE_COLUMN":
      return state.filter((col) => col.id !== action.id);
    case "UPDATE_COLUMN_TITLE":
      return state.map((col) =>
        col.id === action.id ? { ...col, title: action.title } : col,
      );
    case "ADD_TASK":
      return state.map((col) =>
        col.id === action.id
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                {
                  id: `task-${crypto.randomUUID()}`,
                  content: "New task...",
                  createdAt: new Date(),
                },
              ],
            }
          : col,
      );
    case "UPDATE_TASK":
      return state.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === action.id ? { ...t, content: action.content } : t,
        ),
      }));
    case "DELETE_TASK":
      return state.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== action.id),
      }));
    case "MOVE_TASK": {
      const { taskId, targetColumnId } = action;
      let taskToMove = null;

      // 1. Taskı mevcut yerinden bul ve çıkar
      const newState = state.map((col) => {
        const task = col.tasks.find((t) => t.id === taskId);
        if (task) taskToMove = task; // Taskı hafızaya al
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId), // Taskı buradan sil
        };
      });

      // 2. Taskı hedef kolona ekle
      return newState.map((col) => {
        if (col.id === targetColumnId && taskToMove) {
          return {
            ...col,
            tasks: [...col.tasks, taskToMove],
          };
        }
        return col;
      });
    }
    default:
      return state;
  }
}

function KanbanProvider({ children }) {
  const [columns, dispatch] = useReducer(columnsReducer, DEFAULT_DATA);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [movingTaskId, setMovingTaskId] = useState(null);

  const clearAllActions = () => {
    setEditingTaskId(null);
    setDeletingTaskId(null);
    setMovingTaskId(null);
  };

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const value = {
    columns,
    dispatch,
    isDark,
    toggleTheme,
    editingTaskId,
    setEditingTaskId,
    deletingTaskId,
    setDeletingTaskId,
    movingTaskId,
    setMovingTaskId,
    clearAllActions,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
}

export { KanbanContext, KanbanProvider };
