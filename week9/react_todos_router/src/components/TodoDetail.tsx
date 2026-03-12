import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { Todo } from '../types';

interface TodoDetailProps {
  todos: Todo[];
  onUpdate: (id: number, title: string) => void;
}

function TodoDetail({ todos, onUpdate }: TodoDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const todo = todos.find(t => t.id === Number(id));
  const [title, setTitle] = useState(todo?.title ?? '');

  if (!todo) {
    return <p className="text-center text-gray-500 py-8">Todo not found.</p>;
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (title.trim()) {
      onUpdate(todo.id, title.trim());
      navigate(-1);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Todo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
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
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TodoDetail;
