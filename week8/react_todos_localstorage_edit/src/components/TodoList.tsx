import type { Todo } from "../types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  title: string;
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (todo: Todo) => void;
}

function TodoList({
  title,
  todos,
  onToggleComplete,
  onDelete,
  onSelect,
}: TodoListProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No todos yet!</p>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
