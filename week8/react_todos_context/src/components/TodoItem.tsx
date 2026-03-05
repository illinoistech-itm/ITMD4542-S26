import { useTodoActions } from "../context/TodoContext";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
}

function TodoItem({ todo }: TodoItemProps) {
  const { onToggleComplete, onDelete } = useTodoActions();

  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
        />
        <span
          className={`text-gray-800 ${todo.completed ? "line-through text-gray-400" : ""}`}
        >
          {todo.title}
        </span>
      </div>
      {todo.completed && (
        <button
          onClick={() => onDelete(todo.id)}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default TodoItem;
