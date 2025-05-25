import { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Components
import Navbar from "./components/Navbar";
import TodoForm from "./components/todos/TodoForm";
import TodoList from "./components/todos/TodoList";
import FilterBar from "./components/todos/FilterBar";
import ConfirmationModal from './components/ConfirmationModal';

// Priority levels with corresponding colors
const PRIORITIES = {
  HIGH: { label: "High", color: "#ef4444", },
  MEDIUM: { label: "Medium", color: "#f59e0b" },
  LOW: { label: "Low", color: "#10b981" },  
};

// Categories with colors
const CATEGORIES = [
  { id: "work", label: "Work", color: "#3b82f6" },
  { id: "personal", label: "Personal", color: "#8b5cf6" },
  { id: "health", label: "Health", color: "#10b981" },
  { id: "shopping", label: "Shopping", color: "#f59e0b" },
  { id: "other", label: "Other", color: "#6b7280" },
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

const isTodayTodo = (todo) => {
  if (todo.isCompleted) return false;
  if (!todo.dueDate) return true; // Tasks with no due date go to today
  
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dueDate.getTime() <= today.getTime();
};

const isUpcomingTodo = (todo) => {
  if (todo.isCompleted) return false;
  if (!todo.dueDate) return false;
  
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dueDate.getTime() > today.getTime();
};

function App() {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editMode, setEditMode] = useState(null);
  const [showCompletedTodos, setShowCompletedTodos] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: null, id: null });
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
  const [pinnedTodos, setPinnedTodos] = useState(() => {
    const saved = localStorage.getItem("pinned-todos");
    return saved ? JSON.parse(saved) : [];
  });

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

  // Save theme preference and update body class
  useEffect(() => {
    localStorage.setItem("todo-theme", theme);
    
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light", "red-white", "nature", "ocean", "winter", "candy", "rainbow");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add(theme);
    }
  }, [theme]);

  // Save pinned todos to localStorage
  useEffect(() => {
    localStorage.setItem("pinned-todos", JSON.stringify(pinnedTodos));
  }, [pinnedTodos]);

  // Add new todo
  const handleAddTodo = useCallback((todoData) => {
    const newTodo = {
      id: uuidv4(),
      isCompleted: false,
      createdAt: new Date().toISOString(), // Add timestamp
      ...todoData
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    toast.success('Task added successfully!');
  }, [todos]);

  // Update existing todo
  const handleUpdateTodo = useCallback((updatedTodoData) => {
    // Find the todo being edited and update it
    const updatedTodos = todos.map(todo => {
      // Match by ID (editMode contains the ID of the todo being edited)
      if (todo.id === editMode) {
        return { 
          ...todo, // Keep the existing fields (especially the ID)
          ...updatedTodoData, // Apply the updates
          updatedAt: new Date().toISOString() // Add update timestamp
        };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    
    // Clear edit mode
    setEditMode(null);
    
    toast.success('Task updated successfully!');
  }, [todos, editMode]);

  // Toggle todo completion status
  const handleToggleComplete = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => {
        if (todo.id === id) {
          const newState = !todo.isCompleted;
          if (newState) {
            toast.success("Task completed! 🎉");
          }
          return { 
            ...todo, 
            isCompleted: newState,
            completedAt: newState ? new Date().toISOString() : null
          };
        }
        return todo;
      })
    );
  }, []);

  // Setup todo for editing
  const handleEdit = useCallback((todo) => {
    // Set the editMode to the ID of the todo being edited
    setEditMode(todo.id);
    // This will cause the todoBeingEdited useMemo to run and get the todo data
  }, []);

  // Prepare delete confirmation
  const handleDelete = useCallback((id) => {
    setConfirmAction({ type: 'delete', id });
    setShowConfirmModal(true);
  }, []);

  // Cancel edit mode
  const handleCancelEdit = useCallback(() => {
    setEditMode(null);
  }, []);

  // Prepare clear completed confirmation
  const handleClearCompleted = useCallback(() => {
    const completedCount = todos.filter(todo => todo.isCompleted).length;
    if (completedCount === 0) return;
    
    setConfirmAction({ type: 'clearCompleted' });
    setShowConfirmModal(true);
  }, [todos]);

  // Handle confirmation actions (delete or clear completed)
  const confirmDelete = useCallback(() => {
    if (confirmAction.type === 'delete' && confirmAction.id) {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== confirmAction.id));
      toast.info("Task deleted");
    } else if (confirmAction.type === 'clearCompleted') {
      const completedCount = todos.filter(todo => todo.isCompleted).length;
      setTodos(prevTodos => prevTodos.filter(todo => !todo.isCompleted));
      toast.info(`Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`);
    }
    
    setShowConfirmModal(false);
  }, [confirmAction, todos]);

  // Pin or unpin a todo
  const handlePinTodo = useCallback((id) => {
    if (pinnedTodos.includes(id)) {
      setPinnedTodos(prev => prev.filter(pinId => pinId !== id));
      toast.info("Todo unpinned");
    } else {
      setPinnedTodos(prev => [...prev, id]);
      toast.info("Todo pinned");
    }
  }, [pinnedTodos]);

  // Move todo up or down
  const handleMoveTodo = useCallback((id, direction) => {
    setTodos(prevTodos => {
      // Find the index of the todo to move
      const index = prevTodos.findIndex(todo => todo.id === id);
      if (index === -1) return prevTodos;
      
      // Create a copy of the todos array
      const newTodos = [...prevTodos];
      const currentTodo = newTodos[index];
      
      // Handle moving up
      if (direction === 'up') {
        // If at the top, move to the bottom (circular movement)
        if (index === 0) {
          // Check pin constraints
          const lastIndex = newTodos.length - 1;
          if (pinnedTodos.includes(currentTodo.id) && 
              !pinnedTodos.includes(newTodos[lastIndex].id)) {
            toast.info("Can't move pinned task below unpinned tasks");
            return prevTodos;
          }
          
          // Move from top to bottom
          newTodos.splice(0, 1);
          newTodos.push(currentTodo);
        } else {
          // Normal upward movement
          const targetIndex = index - 1;
          
          // Prevent moving unpinned todos above pinned ones
          if (!pinnedTodos.includes(currentTodo.id) && 
              pinnedTodos.includes(newTodos[targetIndex].id)) {
            toast.info("Can't move unpinned task above pinned tasks");
            return prevTodos;
          }
          
          // Simple swap without extra properties
          [newTodos[index], newTodos[targetIndex]] = 
          [newTodos[targetIndex], newTodos[index]];
        }
      } 
      // Handle moving down
      else if (direction === 'down') {
        // If at the bottom, move to the top (circular movement)
        if (index === newTodos.length - 1) {
          // Check pin constraints
          if (!pinnedTodos.includes(currentTodo.id) && 
              pinnedTodos.includes(newTodos[0].id)) {
            toast.info("Can't move unpinned task above pinned tasks");
            return prevTodos;
          }
          
          // Move from bottom to top
          newTodos.pop();
          newTodos.unshift(currentTodo);
        } else {
          // Normal downward movement
          const targetIndex = index + 1;
          
          // Prevent moving pinned todos below unpinned ones
          if (pinnedTodos.includes(currentTodo.id) && 
              !pinnedTodos.includes(newTodos[targetIndex].id)) {
            toast.info("Can't move pinned task below unpinned tasks");
            return prevTodos;
          }
          
          // Simple swap without extra properties
          [newTodos[index], newTodos[targetIndex]] = 
          [newTodos[targetIndex], newTodos[index]];
        }
      }
      
      return newTodos;
    });
  }, [pinnedTodos, toast]);

  // Stats for UI display
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.isCompleted).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  }, [todos]);

  // Find the todo being edited
  const todoBeingEdited = useMemo(() => {
    if (!editMode) return null;
    return todos.find(todo => todo.id === editMode);
  }, [editMode, todos]);

  // Get current theme styles
  const themeStyle = THEME_VARIANTS[theme] || THEME_VARIANTS.light;

  // Add this useMemo to properly sort the todos
  const { todayTodos, upcomingTodos, completedTodos } = useMemo(() => {
    // First apply search and filters
    const filtered = todos.filter(todo => {
      const matchesSearch = !searchTerm || 
        todo.todo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "all" || 
        todo.priority === priorityFilter;
      const matchesCategory = categoryFilter === "all" || 
        todo.category === categoryFilter;
      
      return matchesSearch && matchesPriority && matchesCategory;
    });

    // Then sort by pinned status
    const sortedTodos = [...filtered].sort((a, b) => {
      if (pinnedTodos.includes(a.id) && !pinnedTodos.includes(b.id)) return -1;
      if (!pinnedTodos.includes(a.id) && pinnedTodos.includes(b.id)) return 1;
      return 0;
    });

    // Finally, categorize todos
    return {
      todayTodos: sortedTodos.filter(todo => !todo.isCompleted && isTodayTodo(todo))
        .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0)),
      upcomingTodos: sortedTodos.filter(todo => !todo.isCompleted && isUpcomingTodo(todo))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
      completedTodos: showCompletedTodos ? sortedTodos.filter(todo => todo.isCompleted)
        .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0)) : []
    };
  }, [todos, searchTerm, priorityFilter, categoryFilter, pinnedTodos, showCompletedTodos]);

  // Add these handlers in your App component
  const onUpdateTodayTodos = (updatedTodos) => {
    setTodos(prev => {
      const otherTodos = prev.filter(todo => !isTodayTodo(todo));
      return [...updatedTodos, ...otherTodos];
    });
  };

  const onUpdateUpcomingTodos = (updatedTodos) => {
    setTodos(prev => {
      const otherTodos = prev.filter(todo => !isUpcomingTodo(todo));
      return [...updatedTodos, ...otherTodos];
    });
  };

  const onUpdateCompletedTodos = (updatedTodos) => {
    setTodos(prev => {
      const otherTodos = prev.filter(todo => !todo.isCompleted);
      return [...updatedTodos, ...otherTodos];
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeStyle.bgGradient} transition-colors duration-500`}>
      <Navbar currentTheme={theme} setTheme={setTheme} />
      
      <div className="container mx-auto py-6 px-4 sm:px-6 max-w-4xl">
        {/* Stats Summary with improved visibility */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div 
            className={`${themeStyle.cardBg} p-4 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700`}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-500">{stats.total}</p>
            <p className={`font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200`}>Total Tasks</p>
          </motion.div>
          
          <motion.div 
            className={`${themeStyle.cardBg} p-4 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700`}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-500">{stats.completed}</p>
            <p className={`font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200`}>Completed</p>
          </motion.div>
          
          <motion.div 
            className={`${themeStyle.cardBg} p-4 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700`}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-500">{stats.pending}</p>
            <p className={`font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200`}>Pending</p>
          </motion.div>
        </div>

        {/* Todo Form - Conditionally rendered based on edit mode */}
        <TodoForm
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
          onCancel={handleCancelEdit}
          editMode={editMode !== null}
          initialData={todoBeingEdited}
          themeStyle={themeStyle}
        />

        {/* Filters Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          showCompleted={showCompletedTodos}
          onShowCompletedChange={setShowCompletedTodos}
          onClearCompleted={handleClearCompleted}
          hasCompletedTasks={stats.completed > 0}
          themeStyle={themeStyle}
          priorities={PRIORITIES}
          categories={CATEGORIES}
        />
        
        {/* Todo List */}
        <TodoList
          todayTodos={todayTodos}
          upcomingTodos={upcomingTodos}
          completedTodos={completedTodos}
          onDeleteTodo={handleDelete}
          onToggleComplete={handleToggleComplete}
          onEditTodo={handleEdit}
          onPinTodo={handlePinTodo}
          onMoveTodo={handleMoveTodo}
          pinnedTodos={pinnedTodos}
          themeStyle={themeStyle}
          onUpdateTodayTodos={onUpdateTodayTodos}
          onUpdateUpcomingTodos={onUpdateUpcomingTodos}
          onUpdateCompletedTodos={onUpdateCompletedTodos}
        />
      </div>
      
      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme={theme === "dark" ? "dark" : "light"}
      />
      
      {/* Confirmation modal */}
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