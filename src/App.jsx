import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCheck, FaRegClock, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { MdPriorityHigh, MdLowPriority, MdDescription } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

import ConfirmationModal from './components/ConfirmationModal';

// Priority levels with corresponding colors
const PRIORITIES = {
  HIGH: { label: "High", color: "#b81442", icon: <MdPriorityHigh /> },
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

// Theme variants
const THEME_VARIANTS = {
  light: {
    bgGradient: "from-blue-50 to-teal-50",
    cardBg: "bg-white",
    completedBg: "bg-gray-50",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
      buttonPrimary: "from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800"
  },
  dark: {
    bgGradient: "from-gray-900 to-slate-800",
    cardBg: "bg-gray-800",
    completedBg: "bg-gray-700",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    buttonPrimary: "from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700",
    buttonSecondary: "bg-gray-600 hover:bg-gray-700",
    buttonDanger: "bg-red-600 hover:bg-red-700",
    inputBg: "bg-gray-700",
    inputBorder: "border-gray-600",
    inputText: "text-white"
  },
  "red-white": {
    bgGradient: "from-red-50 to-slate-50",
    cardBg: "bg-white",
    completedBg: "bg-red-50/50",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    buttonPrimary: "from-red-500 to-red-400 hover:from-red-600 hover:to-red-500",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-600 hover:bg-red-700",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800"
  },
  nature: {
    bgGradient: "from-green-100 to-emerald-50",
    cardBg: "bg-white",
    completedBg: "bg-green-50/50",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    buttonPrimary: "from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800"
  },
  ocean: {
    bgGradient: "from-blue-100 to-cyan-50",
    cardBg: "bg-white",
    completedBg: "bg-blue-50/50",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    buttonPrimary: "from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800"
  },
  winter: {
    bgGradient: "from-slate-100 to-blue-50",
    cardBg: "bg-white",
    completedBg: "bg-blue-50/30",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    buttonPrimary: "from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800"
  },
  candy: {
    bgGradient: "from-pink-50 to-purple-50",
    cardBg: "bg-white",
    completedBg: "bg-pink-50/50",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    buttonPrimary: "from-pink-500 to-purple-400 hover:from-pink-600 hover:to-purple-500",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800"
  },
  rainbow: {
    bgGradient: "from-purple-50 via-pink-50 to-orange-50",
    cardBg: "bg-white",
    completedBg: "bg-purple-50/30",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    buttonPrimary: "from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800"
  },
};

function App() {
  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editMode, setEditMode] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");
  const [selectedCategory, setSelectedCategory] = useState("other");
  const [showCompletedTodos, setShowCompletedTodos] = useState(true);
  const [expandedTodo, setExpandedTodo] = useState(null);
  const [theme, setTheme] = useState(() => {
    // Try to get saved theme or use system preference
    const savedTheme = localStorage.getItem("todo-theme");
    if (savedTheme) return savedTheme;
    
    // Check for system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    return "light";
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: null, id: null });

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

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("todo-theme", theme);
    
    // Update body class
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light", "red-white", "nature", "ocean", "winter", "candy", "rainbow");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add(theme);
    }
    
    console.log("Theme changed to:", theme);
  }, [theme]);

  const handleAdd = useCallback(() => {
    if (todo.trim() !== "") {
      const newTodo = {
        id: uuidv4(),
        todo: todo.trim(),
        description: description.trim(),
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
        toast.success("Task updated successfully!");
      } else {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        toast.success("Task added successfully!");
      }
      
      setTodo("");
      setDescription("");
      setSelectedPriority("MEDIUM");
      setSelectedCategory("other");
    }
  }, [todo, description, selectedPriority, selectedCategory, editMode]);

  const handleEdit = useCallback((id) => {
    const itemToEdit = todos.find((item) => item.id === id);
    if (itemToEdit) {
      setTodo(itemToEdit.todo);
      setDescription(itemToEdit.description || "");
      setSelectedPriority(itemToEdit.priority || "MEDIUM");
      setSelectedCategory(itemToEdit.category || "other");
      setEditMode(id);
      
      // Scroll to the edit form
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [todos]);

  const handleDelete = useCallback((id) => {
    // Instead of deleting immediately, show confirmation
    setConfirmAction({ type: 'delete', id });
    setShowConfirmModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (confirmAction.type === 'delete' && confirmAction.id) {
      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== confirmAction.id));
      toast.info("Task deleted");
    } else if (confirmAction.type === 'clearCompleted') {
      const completedCount = todos.filter(todo => todo.isCompleted).length;
      setTodos(prevTodos => prevTodos.filter(todo => !todo.isCompleted));
      toast.info(`Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`);
    }
    
    // Close the modal
    setShowConfirmModal(false);
  }, [confirmAction, todos]);

  const handleCheckbox = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) => {
        if (item.id === id) {
          const newState = !item.isCompleted;
          if (newState) {
            toast.success("Task completed! 🎉");
          }
          return { ...item, isCompleted: newState };
        }
        return item;
      })
    );
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default form submission
      handleAdd();
    }
  };

  const toggleExpandTodo = (id) => {
    setExpandedTodo(expandedTodo === id ? null : id);
  };

  const filteredTodos = useMemo(() => {
    return todos
      .filter((item) => {
        // Filter by search term (match either title or description)
        const matchesSearch = 
          item.todo.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
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
    
    let byPriority = {
      HIGH: todos.filter(t => t.priority === "HIGH").length,
      MEDIUM: todos.filter(t => t.priority === "MEDIUM").length,
      LOW: todos.filter(t => t.priority === "LOW").length,
    };
    
    let byCategory = {};
    CATEGORIES.forEach(cat => {
      byCategory[cat.id] = todos.filter(t => t.category === cat.id).length;
    });
    
    return { total, completed, pending, byPriority, byCategory };
  }, [todos]);

  const clearCompletedTodos = () => {
    const completedCount = todos.filter(todo => todo.isCompleted).length;
    if (completedCount === 0) return;
    
    // Show confirmation dialog
    setConfirmAction({ type: 'clearCompleted' });
    setShowConfirmModal(true);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setTodo("");
    setDescription("");
    setSelectedPriority("MEDIUM");
    setSelectedCategory("other");
  };

  // Get current theme styles
  const themeStyle = THEME_VARIANTS[theme] || THEME_VARIANTS.light;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeStyle.bgGradient} transition-colors duration-500`}>
      <Navbar currentTheme={theme} setTheme={setTheme} />
      <div className="container mx-auto py-6 px-4 sm:px-6 max-w-4xl">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`${themeStyle.cardBg} p-4 rounded-lg shadow-md text-center stats-card`}>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className={`${themeStyle.textSecondary}`}>Total Tasks</p>
          </div>
          <div className={`${themeStyle.cardBg} p-4 rounded-lg shadow-md text-center stats-card`}>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className={`${themeStyle.textSecondary}`}>Completed</p>
          </div>
          <div className={`${themeStyle.cardBg} p-4 rounded-lg shadow-md text-center stats-card`}>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            <p className={`${themeStyle.textSecondary}`}>Pending</p>
          </div>
        </div>

        {/* Add/Edit Todo Section */}
        <div className={`${themeStyle.cardBg} mb-6 p-6 rounded-lg shadow-md add-todo-form`}>
          <h2 className={`text-2xl font-bold mb-4 ${themeStyle.textPrimary}`}>
            {editMode ? "Edit Task" : "Add New Task"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}>Task Title*</label>
              <input
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="What needs to be done?"
                className={`w-full p-3 border ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${themeStyle.inputBg} ${themeStyle.inputText}`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}>
                Description <span className="text-xs opacity-70">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about your task"
                rows="3"
                className={`w-full p-3 border ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${themeStyle.inputBg} ${themeStyle.inputText}`}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              {/* Priority Selection */}
              <div className="flex-1 min-w-[150px]">
                <label className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}>Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className={`w-full p-2 border ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
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
                <label className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full p-2 ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                >
                  {CATEGORIES.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className={`${themeStyle.textSecondary}`}>Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> to save</p>
            </div>
            
            <div className="flex gap-3 justify-end">
              {editMode && (
                <button
                  onClick={cancelEdit}
                  className={`action-button px-4 py-2 ${themeStyle.buttonSecondary} text-white rounded-md transition-colors`}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleAdd}
                className={`action-button px-4 py-2 bg-gradient-to-r ${themeStyle.buttonPrimary} text-white rounded-md transition-colors flex items-center gap-2`}
              >
                <FaPlus /> {editMode ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search Section */}
        <div className={`${themeStyle.cardBg} mb-6 p-6 rounded-lg shadow-md`}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className={`w-full pl-10 p-3 border ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`p-3 border ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={`p-3 ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
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
              className={`p-3 ${themeStyle.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
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
              <label htmlFor="showCompleted" className={`text-sm ${themeStyle.textSecondary}`}>
                Show completed tasks
              </label>
            </div>
            
            <button
              onClick={clearCompletedTodos}
              className={`text-sm ${themeStyle.buttonDanger} text-white rounded-md transition-colors ${stats.completed === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={stats.completed === 0}
            >
              Clear completed
            </button>
          </div>
        </div>

        {/* Todo List Section */}
        <div className={`${themeStyle.cardBg} p-6 rounded-lg shadow-md task-list`}>
          <h2 className={`text-2xl font-bold mb-6 ${themeStyle.textPrimary}`}>Your Tasks</h2>
          
          <div className="space-y-4">
            {filteredTodos.length ? (
              filteredTodos.map((item) => {
                const priorityInfo = PRIORITIES[item.priority] || PRIORITIES.MEDIUM;
                const categoryInfo = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[4]; // Default to "Other"
                const itemDate = new Date(item.createdAt);
                const isHighPriority = item.priority === "HIGH" && !item.isCompleted;
                
                return (
                  <div
                    key={item.id}
                    className={`todo-item relative overflow-hidden rounded-lg shadow-sm border-l-4 transition-all ${
                      item.isCompleted ? themeStyle.completedBg : themeStyle.cardBg
                    } ${isHighPriority ? 'animate-pulse-subtle high-priority-glow' : ''}`}
                    style={{ borderLeftColor: priorityInfo.color }}
                  >
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3 flex-grow">
                        <div className="priority-indicator">
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => handleCheckbox(item.id)}
                            className="todo-checkbox h-5 w-5 rounded-full border-2 focus:ring-blue-500 text-blue-600 transition"
                            style={{ borderColor: priorityInfo.color }}
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span
                              className={`${
                                item.isCompleted ? `line-through ${themeStyle.textSecondary}` : themeStyle.textPrimary
                              } text-lg transition-all`}
                            >
                              {item.todo}
                            </span>
                            
                            {priorityInfo.icon && (
                              <span style={{ color: priorityInfo.color }}>{priorityInfo.icon}</span>
                            )}

                            {item.description && (
                              <button 
                                onClick={() => toggleExpandTodo(item.id)}
                                className={`ml-2 text-sm ${themeStyle.textSecondary} hover:text-blue-500 transition-colors`}
                                title={expandedTodo === item.id ? "Hide description" : "Show description"}
                              >
                                {expandedTodo === item.id ? <FaAngleUp /> : <FaAngleDown />}
                              </button>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span
                              className="text-xs px-2 py-1 rounded-full text-white"
                              style={{ backgroundColor: categoryInfo.color }}
                            >
                              {categoryInfo.label}
                            </span>
                            <span className={`text-xs ${themeStyle.textSecondary} flex items-center gap-1`}>
                              <FaRegClock className="inline-block text-xs" />
                              {itemDate.toLocaleDateString()} {itemDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          
                          {expandedTodo === item.id && item.description && (
                            <div className={`mt-3 p-3 rounded-md ${themeStyle.textSecondary} text-sm bg-gray-50 dark:bg-gray-700/50 border-l-2`} style={{ borderLeftColor: priorityInfo.color }}>
                              <div className="flex items-start gap-2">
                                <MdDescription className="text-gray-400 mt-0.5" />
                                <p className="whitespace-pre-line">{item.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          disabled={item.isCompleted}
                          className={`action-button p-2 rounded-md text-white transition-colors ${
                            item.isCompleted
                              ? "bg-gray-400 cursor-not-allowed"
                              : themeStyle.buttonSecondary
                          }`}
                          title={item.isCompleted ? "Cannot edit completed tasks" : "Edit task"}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`action-button ${themeStyle.buttonDanger} text-white p-2 rounded-md transition-colors`}
                          title="Delete task"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress indicator for completed tasks */}
                    {item.isCompleted && (
                      <div className="todo-progress absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="empty-state text-center py-8">
                <div className={`${themeStyle.textSecondary} text-5xl mb-4`}>📝</div>
                <p className={`${themeStyle.textPrimary} text-lg mb-2`}>No tasks found</p>
                <p className={`${themeStyle.textSecondary} text-sm`}>
                  {searchTerm || filter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                    ? "Try changing your filters or search term"
                    : "Start by adding a new task above"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        theme={theme === "dark" ? "dark" : "light"}
      />
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title={confirmAction.type === 'delete' ? "Delete Task" : "Clear Completed Tasks"}
          message={
            confirmAction.type === 'delete' 
              ? "Are you sure you want to delete this task? This action cannot be undone."
              : "Are you sure you want to clear all completed tasks? This action cannot be undone."
          }
          themeStyle={themeStyle}
        />
      )}
    </div>
  );
}

export default App;