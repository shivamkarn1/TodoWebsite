import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleAdd = useCallback(() => {
    if (todo.trim() !== "") {
      const newTodo = { id: uuidv4(), todo: todo.trim(), isCompleted: false };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTodo("");
    }
  }, [todo]);

  const handleEdit = useCallback((id) => {
    const itemToEdit = todos.find((item) => item.id === id);
    if (itemToEdit) {
      setTodo(itemToEdit.todo);
      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== id));
    }
  }, [todos]);

  const handleDelete = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((item) => item.id !== id));
  }, []);

  const handleCheckbox = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-4 p-5 bg-gray-100 rounded-lg shadow-md min-h-[80vh]">
        {/* Add Todo Section */}
        <div className="addTodo mb-6">
          <h2 className="text-2xl font-bold mb-2">Add A Todo</h2>
          <div className="flex gap-3">
            <input
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Enter your todo..."
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAdd}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Save
            </button>
          </div>
        </div>

        {/* Todo List Section */}
        <h2 className="text-2xl font-bold mb-4">Your Todos</h2>
        <div className="todos space-y-4">
          {todos.length ? (
            todos.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white ${
                  item.isCompleted ? "bg-gray-200" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => handleCheckbox(item.id)}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                  />
                  <span
                    className={`${
                      item.isCompleted ? "line-through text-gray-500" : ""
                    } text-lg`}
                  >
                    {item.todo}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No todos yet. Start adding some!</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
