import { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import TodoForm from "./components/todos/TodoForm";
import TodoList from "./components/todos/TodoList";
import FilterBar from "./components/todos/FilterBar";
import ConfirmationModal from './components/ConfirmationModal';

const PRIORITIES = {
  HIGH: { label: "High", color: "#ef4444", },
  MEDIUM: { label: "Medium", color: "#f59e0b" },
  LOW: { label: "Low", color: "#10b981" },  
};

const CATEGORIES = [
  { id: "work", label: "Work", color: "#3b82f6" },
  { id: "personal", label: "Personal", color: "#8b5cf6" },
  { id: "health", label: "Health", color: "#10b981" },
  { id: "shopping", label: "Shopping", color: "#f59e0b" },
  { id: "other", label: "Other", color: "#6b7280" },
];

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
    const savedTheme = localStorage.getItem("todo-theme");
    if (savedTheme) return savedTheme;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    if (todos.length) {
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      localStorage.removeItem("todos");
    }
  }, [todos]);

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

  const handleAddTodo = useCallback((todoData) => {
    const newTodo = {
      id: uuidv4(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      ...todoData
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    toast.success('Task added successfully!');
  }, [todos]);

  const handleUpdateTodo = useCallback((updatedTodoData) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === editMode) {
        return { 
          ...todo,
          ...updatedTodoData,
          updatedAt: new Date().toISOString()
        };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    
    setEditMode(null);
    
    toast.success('Task updated successfully!');
  }, [todos, editMode]);

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

  const handleEdit = useCallback((todo) => {
    setEditMode(todo.id);
  }, []);

  const handleDelete = useCallback((id) => {
    setConfirmAction({ type: 'delete', id });
    setShowConfirmModal(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditMode(null);
  }, []);

  const handleClearCompleted = useCallback(() => {
    const completedCount = todos.filter(todo => todo.isCompleted).length;
    if (completedCount === 0) return;
    
    setConfirmAction({ type: 'clearCompleted' });
    setShowConfirmModal(true);
  }, [todos]);

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

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.isCompleted).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  }, [todos]);

  const todoBeingEdited = useMemo(() => {
    if (!editMode) return null;
    return todos.find(todo => todo.id === editMode);
  }, [editMode, todos]);

  const themeStyle = THEME_VARIANTS[theme] || THEME_VARIANTS.light;

  const { todayTodos, upcomingTodos, completedTodos } = useMemo(() => {
    let filteredTodos = [...todos];
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => 
        todo.todo.toLowerCase().includes(searchLower) ||
        (todo.description && todo.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (priorityFilter !== "all") {
      filteredTodos = filteredTodos.filter(todo => todo.priority === priorityFilter);
    }
    
    if (categoryFilter !== "all") {
      filteredTodos = filteredTodos.filter(todo => todo.category === categoryFilter);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      todayTodos: filteredTodos.filter(todo => {
        if (todo.isCompleted) return false;
        if (!todo.dueDate) return true;
        
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() <= today.getTime();
      }).sort((a, b) => {
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return priorityOrder[a.priority || 'MEDIUM'] - priorityOrder[b.priority || 'MEDIUM'];
      }),
      
      upcomingTodos: filteredTodos.filter(todo => {
        if (todo.isCompleted) return false;
        if (!todo.dueDate) return false;
        
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() > today.getTime();
      }).sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      }),
      
      completedTodos: showCompletedTodos 
        ? filteredTodos.filter(todo => todo.isCompleted)
            .sort((a, b) => {
              const dateA = a.completedAt ? new Date(a.completedAt) : new Date(0);
              const dateB = b.completedAt ? new Date(b.completedAt) : new Date(0);
              return dateB - dateA;
            })
        : []
    };
  }, [todos, searchTerm, priorityFilter, categoryFilter, showCompletedTodos]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeStyle.bgGradient} transition-colors duration-500`}>
      <Navbar currentTheme={theme} setTheme={setTheme} />
      
      <div className="container mx-auto py-6 px-4 sm:px-6 max-w-4xl">
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

        <TodoForm
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
          onCancel={handleCancelEdit}
          editMode={editMode !== null}
          initialData={todoBeingEdited}
          themeStyle={themeStyle}
        />

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
        
        <TodoList
          todayTodos={todayTodos}
          upcomingTodos={upcomingTodos}
          completedTodos={completedTodos}
          onDeleteTodo={handleDelete}
          onToggleComplete={handleToggleComplete}
          onEditTodo={handleEdit}
          themeStyle={themeStyle}
        />
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