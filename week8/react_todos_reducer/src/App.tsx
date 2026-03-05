import { useState, useEffect, useReducer } from "react";
import type { Todo } from "./types";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";

// const initialTodos: Todo[] = [
//   {
//     userId: 1,
//     id: 1,
//     title: "delectus aut autem",
//     completed: false,
//   },
//   {
//     userId: 1,
//     id: 2,
//     title: "quis ut nam facilis et officia qui",
//     completed: false,
//   },
//   {
//     userId: 1,
//     id: 3,
//     title: "fugiat veniam minus",
//     completed: false,
//   },
//   {
//     userId: 1,
//     id: 4,
//     title: "et porro tempora",
//     completed: true,
//   },
//   {
//     userId: 1,
//     id: 5,
//     title: "laboriosam mollitia et enim quasi adipisci quia provident illum",
//     completed: false,
//   },
// ];

type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "DELETE_TODO"; payload: number };

const STORAGE_KEY = "todos";

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "SET_TODOS":
      return action.payload;
    case "ADD_TODO": {
      const maxId =
        state.length > 0 ? Math.max(...state.map((todo) => todo.id)) : 0;
      return [
        ...state,
        { userId: 1, id: maxId + 1, title: action.payload, completed: false },
      ];
    }
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo,
      );
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(
    () => !localStorage.getItem(STORAGE_KEY),
  );

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Fetch todos from API on component mount
      fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
        .then((response) => response.json())
        .then((data: Todo[]) => {
          dispatch({ type: "SET_TODOS", payload: data });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching todos:", error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (title: string) => {
    dispatch({ type: "ADD_TODO", payload: title });
  };

  const handleToggleComplete = (id: number) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const handleDelete = (id: number) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">
          Loading todos...
        </div>
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
