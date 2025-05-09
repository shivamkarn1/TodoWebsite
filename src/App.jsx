import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { MdPriorityHigh, MdLowPriority } from "react-icons/md";

// Priority levels with corresponding colors
const PRIORITIES = {
  HIGH: { label: "High", color: "#e53e3e", icon: <MdPriorityHigh /> },
  MEDIUM: { label: "Medium", color: "#dd6b20", icon: null },
  LOW: { label: "Low", color: "#38a169", icon: <MdLowPriority /> },
};

// Categories with colors
const CATEGORIES = [
  { id: "work", label: "Work", color: "#3182ce" },
  { id: "personal", label: "Personal", color: "#805ad5" },
  { id: "health", label: "Health", color: "#38a169" },
  { id: "shopping", label: "Shopping", color: "#d69e2e" },
  { id: "other", label: "Other", color: "#718096" },
];

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editMode, setEditMode] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");
  const [selectedCategory, setSelectedCategory] = useState("other");
  const [showCompletedTodos, setShowCompletedTodos] = useState(true);

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
    } else {
      localStorage.removeItem("todos");
    }
  }, [todos]);

  const handleAdd = useCallback(() => {
    if (todo.trim() !== "") {
      const newTodo = {
        id: uuidv4(),
        todo: todo.trim(),
        isCompleted: false,
        priority: selectedPriority,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
      };
      
      if (editMode) {
        setTodos((prevTodos) => 
          prevTodos.map((item) => item.id === editMode ? newTodo : item)
        );
        setEditMode(null);
      } else {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      }
      
      setTodo("");
      setSelectedPriority("MEDIUM");
      setSelectedCategory("other");
    }
  }, [todo, selectedPriority, selectedCategory, editMode]);

  const handleEdit = useCallback((id) => {
    const itemToEdit = todos.find((item) => item.id === id);
    if (itemToEdit) {
      setTodo(itemToEdit.todo);
      setSelectedPriority(itemToEdit.priority || "MEDIUM");
      setSelectedCategory(itemToEdit.category || "other");
      setEditMode(id);
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

  const filteredTodos = useMemo(() => {
    return todos
      .filter((item) => {
        // Filter by search term
        const matchesSearch = item.todo.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by completion status
        const matchesCompletion = 
          filter === "all" ? true : 
          filter === "completed" ? item.isCompleted : 
          !item.isCompleted;
          
        // Filter by priority
        const matchesPriority = 
          priorityFilter === "all" ? true : 
          priorityFilter === item.priority;
          
        // Filter by category
        const matchesCategory = 
          categoryFilter === "all" ? true : 
          categoryFilter === item.category;
          
        // Hide completed todos if showCompletedTodos is false
        const showBasedOnCompletion = showCompletedTodos ? true : !item.isCompleted;
        
        return matchesSearch && matchesCompletion && matchesPriority && matchesCategory && showBasedOnCompletion;
      })
      .sort((a, b) => {
        // Sort completed todos to the bottom
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        
        // Then sort by priority (HIGH > MEDIUM > LOW)
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        if (a.priority !== b.priority) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Then sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [todos, searchTerm, filter, priorityFilter, categoryFilter, showCompletedTodos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.isCompleted).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);

  const clearCompletedTodos = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.isCompleted));
  };

  const cancelEdit = () => {
    setEditMode(null);
    setTodo("");
    setSelectedPriority("MEDIUM");
    setSelectedCategory("other");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4 sm:px-6 max-w-4xl">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-gray-600">Total Tasks</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            <p className="text-gray-600">Pending</p>
          </div>
        </div>

        {/* Add/Edit Todo Section */}
        <div className="bg-white mb-6 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {editMode ? "Edit Todo" : "Add New Todo"}
          </h2>
          <div className="space-y-4">
            <div>
              <input
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="What needs to be done?"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              {/* Priority Selection */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(PRIORITIES).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category Selection */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              {editMode && (
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:from-blue-600 hover:to-teal-600 transition-colors flex items-center gap-2"
              >
                <FaPlus /> {editMode ? "Update" : "Add Task"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search Section */}
        <div className="bg-white mb-6 p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search todos..."
                className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              {Object.entries(PRIORITIES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label} Priority
                </option>
              ))}
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showCompleted"
                checked={showCompletedTodos}
                onChange={() => setShowCompletedTodos(!showCompletedTodos)}
                className="h-4 w-4"
              />
              <label htmlFor="showCompleted" className="text-sm text-gray-600">
                Show completed tasks
              </label>
            </div>
            
            <button
              onClick={clearCompletedTodos}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
              disabled={stats.completed === 0}
            >
              Clear completed
            </button>
          </div>
        </div>

        {/* Todo List Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Tasks</h2>
          
          <div className="space-y-4">
            {filteredTodos.length ? (
              filteredTodos.map((item) => {
                const priorityInfo = PRIORITIES[item.priority] || PRIORITIES.MEDIUM;
                const categoryInfo = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[4]; // Default to "Other"
                
                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden rounded-lg shadow-sm border-l-4 transition-all ${
                      item.isCompleted ? "bg-gray-50" : "bg-white"
                    }`}
                    style={{ borderLeftColor: priorityInfo.color }}
                  >
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3 flex-grow">
                        <div>
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => handleCheckbox(item.id)}
                            className="h-5 w-5 rounded-full border-2 focus:ring-blue-500 text-blue-600 transition"
                            style={{ borderColor: priorityInfo.color }}
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span
                              className={`${
                                item.isCompleted ? "line-through text-gray-500" : "text-gray-800"
                              } text-lg transition-all`}
                            >
                              {item.todo}
                            </span>
                            
                            {priorityInfo.icon && (
                              <span style={{ color: priorityInfo.color }}>{priorityInfo.icon}</span>
                            )}
                          </div>
                          
                          <div className="flex gap-2 mt-1">
                            <span
                              className="text-xs px-2 py-1 rounded-full text-white"
                              style={{ backgroundColor: categoryInfo.color }}
                            >
                              {categoryInfo.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          disabled={item.isCompleted}
                          className={`p-2 rounded-md text-white transition-colors ${
                            item.isCompleted
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                          title={item.isCompleted ? "Cannot edit completed tasks" : "Edit task"}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                          title="Delete task"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress indicator for completed tasks */}
                    {item.isCompleted && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-5xl mb-4">📝</div>
                <p className="text-gray-500 text-lg mb-2">No tasks found</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm || filter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                    ? "Try changing your filters or search term"
                    : "Start by adding a new task above"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;