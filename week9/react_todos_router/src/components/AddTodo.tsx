import { useState, useRef } from 'react';

interface AddTodoProps {
  onAdd: (title: string) => void;
}

function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Todo</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTodo;
