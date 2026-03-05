import { useState, useRef } from "react";
import type { Todo } from "../types";

interface TodoDetailProps {
  todo: Todo;
  onUpdate: (id: number, title: string) => void;
  onClose: () => void;
}

function TodoDetail({ todo, onUpdate, onClose }: TodoDetailProps) {
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onUpdate(todo.id, title.trim());
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg mb-8 border-l-4 border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Todo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TodoDetail;
