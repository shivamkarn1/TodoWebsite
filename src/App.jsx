import { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import TodoForm from "./components/todos/TodoForm";
import TodoList from "./components/todos/TodoList";
import ConfirmationModal from "./components/ConfirmationModal";

const PRIORITIES = {
  HIGH: { label: "High", color: "#ef4444" },
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
    bgGradient: "from-gray-100 to-blue-50",
    background: "rgba(255, 255, 255, 0.8)",
    cardBg: "bg-white/90",
    completedBg: "bg-gray-50",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    buttonPrimary:
      "from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600",
    buttonSecondary: "bg-gray-500 hover:bg-gray-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    inputText: "text-gray-800",
    accent: "text-blue-600",
    accentHex: "#2563eb",
    toastTheme: {
      success: "#10b981",
      error: "#ef4444",
      info: "#3b82f6",
      warning: "#f59e0b",
    },
    priorityColors: {
      HIGH: "bg-red-500/10 text-red-700 border-red-200",
      MEDIUM: "bg-amber-500/10 text-amber-700 border-amber-200",
      LOW: "bg-green-500/10 text-green-700 border-green-200",
    },
    sectionColors: {
      today: "border-blue-200 bg-blue-50/30",
      upcoming: "border-purple-200 bg-purple-50/30",
      completed: "border-green-200 bg-green-50/30",
    },
  },
  dark: {
    bgGradient: "from-gray-900 to-slate-800",
    background: "rgba(31, 41, 55, 0.8)",
    cardBg: "bg-gray-800/90",
    completedBg: "bg-gray-700",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    buttonPrimary:
      "from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700",
    buttonSecondary: "bg-gray-600 hover:bg-gray-700",
    buttonDanger: "bg-red-600 hover:bg-red-700",
    inputBg: "bg-gray-700",
    inputBorder: "border-gray-600",
    inputText: "text-white",
    accent: "text-blue-400",
    accentHex: "#60a5fa",
    toastTheme: {
      success: "#10b981",
      error: "#ef4444",
      info: "#60a5fa",
      warning: "#f59e0b",
    },
    priorityColors: {
      HIGH: "bg-red-500/20 text-red-300 border-red-500/30",
      MEDIUM: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      LOW: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    sectionColors: {
      today: "border-blue-500/30 bg-blue-500/10",
      upcoming: "border-purple-500/30 bg-purple-500/10",
      completed: "border-green-500/30 bg-green-500/10",
    },
  },
  nature: {
    bgGradient: "from-green-200 to-emerald-100",
    background: "rgba(254, 255, 254, 0.8)",
    cardBg: "bg-white/90",
    completedBg: "bg-green-50/50",
    textPrimary: "text-green-900",
    textSecondary: "text-green-700",
    buttonPrimary:
      "from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600",
    buttonSecondary: "bg-green-500 hover:bg-green-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-green-50",
    inputBorder: "border-green-300",
    inputText: "text-green-900",
    accent: "text-green-600",
    accentHex: "#059669",
    toastTheme: {
      success: "#047857",
      error: "#dc2626",
      info: "#059669",
      warning: "#d97706",
    },
    priorityColors: {
      HIGH: "bg-rose-500/15 text-rose-800 border-rose-300",
      MEDIUM: "bg-green-700/15 text-green-800 border-green-400",
      LOW: "bg-emerald-500/15 text-emerald-800 border-emerald-300",
    },
    sectionColors: {
      today: "border-emerald-300 bg-emerald-50/50",
      upcoming: "border-teal-300 bg-teal-50/50",
      completed: "border-green-300 bg-green-50/50",
    },
  },
  winter: {
    bgGradient: "from-slate-200 to-blue-100",
    background: "rgba(248, 250, 252, 0.8)",
    cardBg: "bg-white/90",
    completedBg: "bg-blue-50/30",
    textPrimary: "text-slate-800",
    textSecondary: "text-slate-600",
    buttonPrimary:
      "from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500",
    buttonSecondary: "bg-slate-500 hover:bg-slate-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-300",
    inputText: "text-slate-800",
    accent: "text-indigo-600",
    accentHex: "#4f46e5",
    toastTheme: {
      success: "#0ea5e9",
      error: "#dc2626",
      info: "#4f46e5",
      warning: "#f59e0b",
    },
    priorityColors: {
      HIGH: "bg-red-500/15 text-red-800 border-red-300",
      MEDIUM: "bg-indigo-500/15 text-indigo-800 border-indigo-300",
      LOW: "bg-cyan-500/15 text-cyan-800 border-cyan-300",
    },
    sectionColors: {
      today: "border-indigo-300 bg-indigo-50/50",
      upcoming: "border-blue-300 bg-blue-50/50",
      completed: "border-slate-300 bg-slate-50/50",
    },
  },
  sunset: {
    bgGradient: "from-orange-200 to-red-100",
    background: "rgba(255, 251, 235, 0.8)",
    cardBg: "bg-white/90",
    completedBg: "bg-orange-50/50",
    textPrimary: "text-orange-900",
    textSecondary: "text-orange-700",
    buttonPrimary:
      "from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500",
    buttonSecondary: "bg-orange-500 hover:bg-orange-600",
    buttonDanger: "bg-red-600 hover:bg-red-700",
    inputBg: "bg-orange-50",
    inputBorder: "border-orange-300",
    inputText: "text-orange-900",
    accent: "text-orange-600",
    accentHex: "#ea580c",
    toastTheme: {
      success: "#ea580c",
      error: "#dc2626",
      info: "#f97316",
      warning: "#f59e0b",
    },
    priorityColors: {
      HIGH: "bg-red-500/15 text-red-900 border-red-400",
      MEDIUM: "bg-orange-500/15 text-orange-900 border-orange-400",
      LOW: "bg-yellow-500/15 text-yellow-900 border-yellow-400",
    },
    sectionColors: {
      today: "border-orange-300 bg-orange-50/50",
      upcoming: "border-red-300 bg-red-50/50",
      completed: "border-amber-300 bg-amber-50/50",
    },
  },
  neon: {
    bgGradient: "from-purple-200 to-pink-100",
    background: "rgba(253, 244, 255, 0.8)",
    cardBg: "bg-white/90",
    completedBg: "bg-purple-50/50",
    textPrimary: "text-purple-900",
    textSecondary: "text-purple-700",
    buttonPrimary:
      "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    buttonSecondary: "bg-purple-500 hover:bg-purple-600",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-purple-50",
    inputBorder: "border-purple-300",
    inputText: "text-purple-900",
    accent: "text-purple-600",
    accentHex: "#9333ea",
    toastTheme: {
      success: "#9333ea",
      error: "#dc2626",
      info: "#a855f7",
      warning: "#f59e0b",
    },
    priorityColors: {
      HIGH: "bg-fuchsia-500/15 text-fuchsia-900 border-fuchsia-400",
      MEDIUM: "bg-purple-500/15 text-purple-900 border-purple-400",
      LOW: "bg-pink-500/15 text-pink-900 border-pink-400",
    },
    sectionColors: {
      today: "border-purple-300 bg-purple-50/50",
      upcoming: "border-fuchsia-300 bg-fuchsia-50/50",
      completed: "border-pink-300 bg-pink-50/50",
    },
  },
  coffee: {
    bgGradient: "from-amber-200 to-yellow-100",
    background: "rgba(255, 251, 235, 0.8)",
    cardBg: "bg-white/90",
    completedBg: "bg-amber-50/50",
    textPrimary: "text-amber-900",
    textSecondary: "text-amber-700",
    buttonPrimary:
      "from-amber-700 to-yellow-600 hover:from-amber-800 hover:to-yellow-700",
    buttonSecondary: "bg-amber-600 hover:bg-amber-700",
    buttonDanger: "bg-red-500 hover:bg-red-600",
    inputBg: "bg-amber-50",
    inputBorder: "border-amber-300",
    inputText: "text-amber-900",
    accent: "text-amber-700",
    accentHex: "#d97706",
    toastTheme: {
      success: "#d97706",
      error: "#dc2626",
      info: "#f59e0b",
      warning: "#f59e0b",
    },
    priorityColors: {
      HIGH: "bg-red-500/15 text-red-900 border-red-400",
      MEDIUM: "bg-amber-500/15 text-amber-900 border-amber-400",
      LOW: "bg-green-500/15 text-green-900 border-green-400",
    },
    sectionColors: {
      today: "border-amber-300 bg-amber-50/50",
      upcoming: "border-yellow-300 bg-yellow-50/50",
      completed: "border-orange-300 bg-orange-50/50",
    },
  },
};

function App() {
  const [todos, setTodos] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [showCompletedTodos, setShowCompletedTodos] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: null, id: null });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("todo-theme");
    if (savedTheme) return savedTheme;

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });
  const [font, setFont] = useState(() => {
    const savedFont = localStorage.getItem("todo-font");
    return savedFont || "inter";
  });

  // Theme-aware toast helper
  const showThemedToast = useCallback(
    (type, message, options = {}) => {
      const currentThemeStyle = THEME_VARIANTS[theme] || THEME_VARIANTS.light;
      const toastColors = currentThemeStyle.toastTheme;

      // Theme-specific background colors
      const getThemeBackground = () => {
        const isDark = theme === "dark";
        switch (theme) {
          case "dark":
            return {
              bg: "#1f2937",
              text: "#f3f4f6",
              accent: toastColors[type] || toastColors.info,
            };
          case "nature":
            return {
              bg:
                type === "success"
                  ? "#f0fdf4"
                  : type === "error"
                  ? "#fef2f2"
                  : "#f0fdf4",
              text: "#14532d",
              accent: toastColors[type] || toastColors.info,
            };
          case "winter":
            return {
              bg:
                type === "success"
                  ? "#f0f9ff"
                  : type === "error"
                  ? "#fef2f2"
                  : "#f1f5f9",
              text: "#0f172a",
              accent: toastColors[type] || toastColors.info,
            };
          case "sunset":
            return {
              bg:
                type === "success"
                  ? "#fff7ed"
                  : type === "error"
                  ? "#fef2f2"
                  : "#fff7ed",
              text: "#9a3412",
              accent: toastColors[type] || toastColors.info,
            };
          case "neon":
            return {
              bg:
                type === "success"
                  ? "#faf5ff"
                  : type === "error"
                  ? "#fef2f2"
                  : "#faf5ff",
              text: "#581c87",
              accent: toastColors[type] || toastColors.info,
            };
          case "coffee":
            return {
              bg:
                type === "success"
                  ? "#fffbeb"
                  : type === "error"
                  ? "#fef2f2"
                  : "#fffbeb",
              text: "#92400e",
              accent: toastColors[type] || toastColors.info,
            };
          default: // light
            return {
              bg:
                type === "success"
                  ? "#f0f9ff"
                  : type === "error"
                  ? "#fef2f2"
                  : type === "warning"
                  ? "#fffbeb"
                  : "#f8fafc",
              text: "#1e293b",
              accent: toastColors[type] || toastColors.info,
            };
        }
      };

      const themeColors = getThemeBackground();

      const toastOptions = {
        style: {
          background: `linear-gradient(135deg, ${themeColors.bg} 0%, ${themeColors.bg}dd 100%)`,
          color: themeColors.text,
          border: `2px solid ${themeColors.accent}`,
          borderLeft: `6px solid ${themeColors.accent}`,
          borderRadius: "16px",
          fontSize: "16px",
          fontWeight: "600",
          padding: "20px 24px",
          minHeight: "70px",
          minWidth: "350px",
          maxWidth: "450px",
          boxShadow: `0 12px 40px -8px ${themeColors.accent}40, 0 8px 16px -4px ${themeColors.accent}20, 0 0 0 1px ${themeColors.accent}15`,
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        },
        duration: 4000, // Longer duration for bigger toasts
        ...options,
      };

      // Add theme-appropriate emojis and styling
      const getIcon = () => {
        switch (type) {
          case "success":
            return theme === "nature"
              ? "🌱"
              : theme === "winter"
              ? "❄️"
              : theme === "sunset"
              ? "🌅"
              : theme === "neon"
              ? "💜"
              : theme === "coffee"
              ? "☕"
              : "✅";
          case "error":
            return "❌";
          case "info":
            return theme === "nature"
              ? "🍃"
              : theme === "winter"
              ? "🔮"
              : theme === "sunset"
              ? "🔥"
              : theme === "neon"
              ? "⚡"
              : theme === "coffee"
              ? "📋"
              : "ℹ️";
          case "warning":
            return "⚠️";
          default:
            return "💭";
        }
      };

      const iconizedMessage = `${getIcon()} ${message}`;

      switch (type) {
        case "success":
          return toast.success(iconizedMessage, toastOptions);
        case "error":
          return toast.error(iconizedMessage, toastOptions);
        case "info":
          return toast.info(iconizedMessage, toastOptions);
        case "warning":
          return toast.warning(iconizedMessage, toastOptions);
        default:
          return toast(iconizedMessage, toastOptions);
      }
    },
    [theme]
  );

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
    // Simple and immediate theme change
    localStorage.setItem("todo-theme", theme);

    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove(
        "light",
        "nature",
        "winter",
        "sunset",
        "neon",
        "coffee"
      );
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add(theme);
      document.body.classList.remove(
        ...Object.keys(THEME_VARIANTS).filter((t) => t !== theme)
      );
    }
  }, [theme]); // Font management effect
  useEffect(() => {
    localStorage.setItem("todo-font", font);

    const fontFamilyMap = {
      inter: "var(--font-inter)",
      poppins: "var(--font-poppins)",
      montserrat: "var(--font-montserrat)",
      roboto: "var(--font-roboto)",
      bitcount: "var(--font-bitcount)",
      "playwrite-de": "var(--font-playwrite-de)",
      "playwrite-au": "var(--font-playwrite-au)",
      pacifico: "var(--font-pacifico)",
      coiny: "var(--font-coiny)",
      "source-code": "var(--font-source-code)",
    };

    const selectedFont = fontFamilyMap[font] || fontFamilyMap.inter;
    document.documentElement.style.setProperty("--current-font", selectedFont);
  }, [font]);

  const handleAddTodo = useCallback(
    (todoData) => {
      const newTodo = {
        id: uuidv4(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        ...todoData,
      };

      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      showThemedToast("success", "Task added successfully!");
    },
    [todos, showThemedToast]
  );

  const handleUpdateTodo = useCallback(
    (updatedTodoData) => {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === editMode) {
          return {
            ...todo,
            ...updatedTodoData,
            updatedAt: new Date().toISOString(),
          };
        }
        return todo;
      });

      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      setEditMode(null);

      showThemedToast("success", "Task updated successfully!");
    },
    [todos, editMode, showThemedToast]
  );

  const handleToggleComplete = useCallback(
    (id) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            const newState = !todo.isCompleted;
            if (newState) {
              showThemedToast("success", "Task completed!");
            }
            return {
              ...todo,
              isCompleted: newState,
              completedAt: newState ? new Date().toISOString() : null,
            };
          }
          return todo;
        })
      );
    },
    [showThemedToast]
  );

  const handleEdit = useCallback((todo) => {
    setEditMode(todo.id);
  }, []);

  const handleDelete = useCallback((id) => {
    setConfirmAction({ type: "delete", id });
    setShowConfirmModal(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditMode(null);
  }, []);

  const handleClearCompleted = useCallback(() => {
    const completedCount = todos.filter((todo) => todo.isCompleted).length;
    if (completedCount === 0) return;

    setConfirmAction({ type: "clearCompleted" });
    setShowConfirmModal(true);
  }, [todos]);

  const confirmDelete = useCallback(() => {
    if (confirmAction.type === "delete" && confirmAction.id) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== confirmAction.id)
      );
      showThemedToast("info", "Task deleted");
    } else if (confirmAction.type === "clearCompleted") {
      const completedCount = todos.filter((todo) => todo.isCompleted).length;
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.isCompleted));
      showThemedToast(
        "info",
        `Cleared ${completedCount} completed ${
          completedCount === 1 ? "task" : "tasks"
        }`
      );
    }

    setShowConfirmModal(false);
  }, [confirmAction, todos, showThemedToast]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    const pending = total - completed;

    return { total, completed, pending };
  }, [todos]);

  const todoBeingEdited = useMemo(() => {
    if (!editMode) return null;
    return todos.find((todo) => todo.id === editMode);
  }, [editMode, todos]);

  const themeStyle = THEME_VARIANTS[theme] || THEME_VARIANTS.light;

  const { todayTodos, upcomingTodos, completedTodos } = useMemo(() => {
    let filteredTodos = [...todos];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      todayTodos: filteredTodos
        .filter((todo) => {
          if (todo.isCompleted) return false;
          if (!todo.dueDate) return true;

          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() <= today.getTime();
        })
        .sort((a, b) => {
          const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return (
            priorityOrder[a.priority || "MEDIUM"] -
            priorityOrder[b.priority || "MEDIUM"]
          );
        }),

      upcomingTodos: filteredTodos
        .filter((todo) => {
          if (todo.isCompleted) return false;
          if (!todo.dueDate) return false;

          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() > today.getTime();
        })
        .sort((a, b) => {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          return dateA - dateB;
        }),

      completedTodos: showCompletedTodos
        ? filteredTodos
            .filter((todo) => todo.isCompleted)
            .sort((a, b) => {
              const dateA = a.completedAt
                ? new Date(a.completedAt)
                : new Date(0);
              const dateB = b.completedAt
                ? new Date(b.completedAt)
                : new Date(0);
              return dateB - dateA;
            })
        : [],
    };
  }, [todos, showCompletedTodos]);

  return (
    <motion.div
      key={`theme-${theme}`}
      className={`min-h-screen bg-gradient-to-br ${themeStyle.bgGradient} relative overflow-hidden`}
      initial={{ opacity: 0.95 }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3, // Smooth and simple
        ease: "easeOut",
      }}
    >
      {/* Simple subtle background enhancement */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${themeStyle.accentHex}05, transparent)`,
        }}
        animate={{
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <Navbar
        currentTheme={theme}
        setTheme={setTheme}
        currentFont={font}
        setFont={setFont}
      />

      <motion.div
        className="container mx-auto py-8 px-6 sm:px-8 max-w-5xl relative z-10"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          delay: 0.1,
        }}
      >
        <motion.div
          className="grid grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            delay: 0.2,
          }}
        >
          <motion.div
            className={`${themeStyle.cardBg} p-4 rounded-xl backdrop-blur-sm text-center relative overflow-hidden group`}
            style={{
              background: `linear-gradient(135deg, ${themeStyle.background} 0%, ${themeStyle.cardBg} 50%, ${themeStyle.background} 100%)`,
              boxShadow: `0 8px 32px -8px ${themeStyle.accentHex}20, 0 0 0 1px ${themeStyle.accentHex}10`,
            }}
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12"></div>
            <p
              className={`text-xl sm:text-2xl font-bold ${themeStyle.accent} relative z-10`}
            >
              {stats.total}
            </p>
            <p
              className={`font-medium text-sm sm:text-base ${themeStyle.textPrimary} relative z-10`}
            >
              Total Tasks
            </p>
          </motion.div>

          <motion.div
            className={`${themeStyle.cardBg} p-4 rounded-xl backdrop-blur-sm text-center relative overflow-hidden group`}
            style={{
              background: `linear-gradient(135deg, ${themeStyle.background} 0%, ${themeStyle.cardBg} 50%, ${themeStyle.background} 100%)`,
              boxShadow:
                "0 8px 32px -8px rgba(34, 197, 94, 0.2), 0 0 0 1px rgba(34, 197, 94, 0.1)",
            }}
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12"></div>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 relative z-10">
              {stats.completed}
            </p>
            <p
              className={`font-medium text-sm sm:text-base ${themeStyle.textPrimary} relative z-10`}
            >
              Completed
            </p>
          </motion.div>

          <motion.div
            className={`${themeStyle.cardBg} p-4 rounded-xl backdrop-blur-sm text-center relative overflow-hidden group`}
            style={{
              background: `linear-gradient(135deg, ${themeStyle.background} 0%, ${themeStyle.cardBg} 50%, ${themeStyle.background} 100%)`,
              boxShadow:
                "0 8px 32px -8px rgba(245, 158, 11, 0.2), 0 0 0 1px rgba(245, 158, 11, 0.1)",
            }}
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12"></div>
            <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 relative z-10">
              {stats.pending}
            </p>
            <p
              className={`font-medium text-sm sm:text-base ${themeStyle.textPrimary} relative z-10`}
            >
              Pending
            </p>
          </motion.div>
        </motion.div>

        <TodoForm
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
          onCancel={handleCancelEdit}
          editMode={editMode !== null}
          initialData={todoBeingEdited}
          themeStyle={themeStyle}
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
      </motion.div>

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand={true}
        visibleToasts={3}
        offset="32px"
        theme={theme === "dark" ? "dark" : "light"}
        toastOptions={{
          style: {
            fontSize: "16px",
            fontWeight: "600",
            padding: "20px 24px",
            borderRadius: "16px",
            minHeight: "70px",
            minWidth: "350px",
            maxWidth: "450px",
          },
          duration: 4000,
        }}
      />

      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title={
            confirmAction.type === "delete"
              ? "Delete Task"
              : "Clear Completed Tasks"
          }
          message={
            confirmAction.type === "delete"
              ? "Are you sure you want to delete this task? This action cannot be undone."
              : "Are you sure you want to clear all completed tasks? This action cannot be undone."
          }
          themeStyle={themeStyle}
        />
      )}
    </motion.div>
  );
}

export default App;
