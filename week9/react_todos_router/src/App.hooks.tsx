import { useState, useEffect } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import type { Todo } from './types';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [loading, setLoading] = useState(() => todos.length === 0);

  useEffect(() => {
    if (todos.length === 0) {
      fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
        .then(response => response.json())
        .then((data: Todo[]) => {
          setTodos(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching todos:', error);
          setLoading(false);
        });
    }
  }, []);

  const handleAddTodo = (title: string) => {
    // Calculate next ID from existing todos
    const maxId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;
    const newTodo: Todo = {
      userId: 1,
      id: maxId + 1,
      title,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          React Todos App
        </h1>

        <AddTodo onAdd={handleAddTodo} />

        <div className="grid md:grid-cols-2 gap-6">
          <TodoList
            title="Active Todos"
            todos={incompleteTodos}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />

          <TodoList
            title="Completed Todos"
            todos={completedTodos}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
