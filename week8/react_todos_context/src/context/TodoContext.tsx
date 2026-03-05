import { createContext, useContext } from "react";

interface TodoActions {
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoContext = createContext<TodoActions | null>(null);

export function TodoProvider({
  children,
  onToggleComplete,
  onDelete,
}: TodoActions & { children: React.ReactNode }) {
  return (
    <TodoContext.Provider value={{ onToggleComplete, onDelete }}>
      {children}
    </TodoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodoActions(): TodoActions {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoActions must be used within a TodoProvider");
  }
  return context;
}
