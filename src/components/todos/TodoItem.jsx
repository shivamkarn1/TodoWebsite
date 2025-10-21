import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrashAlt,
  FaEdit,
  FaCheck,
  FaCalendar,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaArrowUp,
  FaArrowDown,
  FaThumbtack,
} from "react-icons/fa";

// Helper function to format date and time
const formatDateTime = (dateString) => {
  if (!dateString)
    return { formattedDate: "Unknown date", formattedTime: "Unknown time" };

  const date = new Date(dateString);

  // Format date as "Mon, Jan 15, 2023"
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time as "3:42 PM"
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { formattedDate, formattedTime };
};

// Helper function to get theme-aware colors for badges
const getThemeAwareBadgeColors = (themeStyle, type = "category") => {
  const baseColors = {
    primary: themeStyle.accent?.replace("text-", "") || "blue-600",
    secondary: themeStyle.textSecondary?.replace("text-", "") || "gray-600",
    success: "green-600",
    warning: "amber-600",
    danger: "red-600",
  };

  return {
    high: baseColors.danger,
    medium: baseColors.warning,
    low: baseColors.success,
    work: baseColors.primary,
    personal: "purple-600",
    health: baseColors.success,
    shopping: baseColors.warning,
    other: baseColors.secondary,
  };
};

// Default values for priority and category
const DEFAULT_PRIORITY = { id: "MEDIUM", label: "Medium" };
const DEFAULT_CATEGORY = { id: "other", label: "Other" };

const TodoItem = ({
  todo,
  onDelete,
  onToggleComplete,
  onEdit,
  onMoveUp,
  onMoveDown,
  onTogglePin,
  themeStyle,
  priorityInfo,
  categoryInfo,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Add default values to prevent the undefined error
  const safeCategory = categoryInfo || DEFAULT_CATEGORY;
  const safePriority = priorityInfo || DEFAULT_PRIORITY;

  // Check if the task is overdue
  const isOverdue =
    todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;

  const { formattedDate: dueDate } = todo.dueDate
    ? formatDateTime(todo.dueDate)
    : { formattedDate: null };
  const { formattedDate: createdDate, formattedTime: createdTime } =
    todo.createdAt
      ? formatDateTime(todo.createdAt)
      : { formattedDate: "", formattedTime: "" };

  // Determine if we should automatically show details
  const hasDetails = todo.description || todo.createdAt;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1 ${
        todo.isCompleted
          ? `${themeStyle.completedBg} opacity-75 hover:opacity-90`
          : isOverdue
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-red-200/50 dark:shadow-red-900/30"
          : `${themeStyle.cardBg} ${themeStyle.inputBorder} hover:shadow-blue-200/30 dark:hover:shadow-blue-900/20`
      }${
        todo.isPinned
          ? " ring-2 ring-yellow-400/50 dark:ring-yellow-500/40"
          : ""
      }`}
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Pinned indicator */}
      {todo.isPinned && (
        <div
          className={`absolute top-2 left-2 ${themeStyle.textPrimary} opacity-70`}
        >
          <FaThumbtack
            size={12}
            className="rotate-45 text-yellow-600 dark:text-yellow-400"
          />
        </div>
      )}

      <div className={`p-4 ${todo.isPinned ? "pt-6" : ""}`}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(todo.id)}
            className="mt-0.5 flex-shrink-0"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                todo.isCompleted
                  ? "bg-green-500 border-green-500"
                  : `${themeStyle.inputBorder} hover:border-opacity-60`
              }`}
            >
              {todo.isCompleted && <FaCheck className="text-white text-xs" />}
            </div>
          </button>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <h3
              className={`text-base font-medium break-words ${
                todo.isCompleted
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : themeStyle.textPrimary
              }`}
            >
              {todo.todo}
            </h3>

            {/* Category and priority badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Category badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                  safeCategory.id === "work"
                    ? `text-blue-700 bg-blue-100 border-blue-300 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700`
                    : safeCategory.id === "personal"
                    ? `text-purple-700 bg-purple-100 border-purple-300 dark:text-purple-300 dark:bg-purple-900/30 dark:border-purple-700`
                    : safeCategory.id === "health"
                    ? `text-green-700 bg-green-100 border-green-300 dark:text-green-300 dark:bg-green-900/30 dark:border-green-700`
                    : safeCategory.id === "shopping"
                    ? `text-amber-700 bg-amber-100 border-amber-300 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700`
                    : `${themeStyle.textSecondary} ${themeStyle.inputBg} ${themeStyle.inputBorder}`
                }`}
              >
                {safeCategory.label}
              </span>

              {/* Priority badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                  themeStyle.priorityColors?.[safePriority.id] ||
                  (safePriority.id === "HIGH"
                    ? "bg-red-500/10 text-red-700 border-red-200"
                    : safePriority.id === "MEDIUM"
                    ? "bg-amber-500/10 text-amber-700 border-amber-200"
                    : "bg-green-500/10 text-green-700 border-green-200")
                }`}
              >
                {safePriority.label}
              </span>

              {/* Due date badge - if exists */}
              {todo.dueDate && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 border ${
                    themeStyle.inputBorder
                  }
                  ${
                    isOverdue && !todo.isCompleted
                      ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-300"
                      : `${themeStyle.inputBg} ${themeStyle.textSecondary}`
                  }`}
                >
                  <FaCalendar size={10} />
                  {dueDate}
                </span>
              )}
            </div>

            {/* Toggle button for details if description exists */}
            {hasDetails && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`mt-2 text-xs flex items-center gap-1 ${themeStyle.textSecondary} hover:underline`}
              >
                {showDetails ? (
                  <>
                    <FaChevronUp size={10} /> Hide details
                  </>
                ) : (
                  <>
                    <FaChevronDown size={10} /> Show details
                  </>
                )}
              </button>
            )}

            {/* Description and timestamp - expanded view */}
            <AnimatePresence>
              {showDetails && hasDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  {todo.description && (
                    <p
                      className={`text-sm ${themeStyle.textSecondary} mb-3 whitespace-pre-wrap`}
                    >
                      {todo.description}
                    </p>
                  )}

                  {/* Creation timestamp */}
                  {todo.createdAt && (
                    <div
                      className={`text-xs italic ${themeStyle.textSecondary} flex items-center gap-1 mt-2 border-t pt-2 ${themeStyle.inputBorder}`}
                    >
                      <FaClock size={10} className="opacity-70" />
                      Created on {createdDate} at {createdTime}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons - 2x2 Grid Layout */}
          <div className="flex flex-shrink-0 ml-2">
            <div className="grid grid-cols-2 gap-2 min-w-[88px]">
              {/* Top row: Pin and Move Up */}
              <button
                onClick={() => onTogglePin(todo.id)}
                className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  todo.isPinned
                    ? `bg-yellow-100 ${themeStyle.textPrimary} shadow-sm border border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700`
                    : `hover:${themeStyle.inputBg} ${themeStyle.textSecondary} hover:${themeStyle.textPrimary} border border-transparent hover:border-gray-200 dark:hover:border-gray-600`
                }`}
                title={todo.isPinned ? "Unpin todo" : "Pin todo"}
              >
                <FaThumbtack
                  className={`transition-transform ${
                    todo.isPinned
                      ? "rotate-45 text-yellow-600 dark:text-yellow-400"
                      : ""
                  }`}
                  size={14}
                />
              </button>

              <button
                onClick={() => onMoveUp(todo.id)}
                className={`p-2.5 rounded-lg ${themeStyle.textSecondary} hover:${themeStyle.textPrimary} hover:${themeStyle.inputBg} transition-all duration-200 flex items-center justify-center border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
                title="Move up"
              >
                <FaArrowUp size={14} />
              </button>

              {/* Bottom row: Edit and Move Down */}
              <button
                onClick={() => onEdit(todo)} // Pass the entire todo object
                className={`p-2.5 hover:${themeStyle.inputBg} rounded-lg ${themeStyle.textSecondary} hover:${themeStyle.textPrimary} transition-all duration-200 flex items-center justify-center border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
                title="Edit todo"
              >
                <FaEdit size={14} />
              </button>

              <button
                onClick={() => onMoveDown(todo.id)}
                className={`p-2.5 rounded-lg ${themeStyle.textSecondary} hover:${themeStyle.textPrimary} hover:${themeStyle.inputBg} transition-all duration-200 flex items-center justify-center border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
                title="Move down"
              >
                <FaArrowDown size={14} />
              </button>
            </div>

            {/* Delete button - separate on the right */}
            <button
              onClick={() => onDelete(todo.id)}
              className={`ml-2 p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg ${themeStyle.textSecondary} hover:text-red-500 transition-all duration-200 flex items-center justify-center border border-transparent hover:border-red-200 dark:hover:border-red-700`}
              title="Delete todo"
            >
              <FaTrashAlt size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;
