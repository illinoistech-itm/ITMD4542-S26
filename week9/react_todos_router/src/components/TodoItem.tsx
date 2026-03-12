import { Link } from 'react-router';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
        />
        <Link
          to={`/todos/${todo.id}`}
          className={`text-gray-800 hover:text-blue-600 ${todo.completed ? 'line-through text-gray-400' : ''}`}
        >
          {todo.title}
        </Link>
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
