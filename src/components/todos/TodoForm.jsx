import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaClock,
} from "react-icons/fa";

const PRIORITIES = [
  { id: "HIGH", label: "High", color: "#ef4444" },
  { id: "MEDIUM", label: "Medium", color: "#f59e0b" },
  { id: "LOW", label: "Low", color: "#10b981" },
];

const CATEGORIES = [
  { id: "work", label: "Work", color: "#3b82f6" },
  { id: "personal", label: "Personal", color: "#8b5cf6" },
  { id: "health", label: "Health", color: "#10b981" },
  { id: "shopping", label: "Shopping", color: "#f59e0b" },
  { id: "other", label: "Other", color: "#6b7280" },
];

const TodoForm = ({
  onAddTodo,
  onUpdateTodo,
  onCancel,
  editMode,
  initialData = null,
  themeStyle,
}) => {
  const [isExpanded, setIsExpanded] = useState(!!editMode);
  const [showDetails, setShowDetails] = useState(!!editMode);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("other");

  const inputRef = useRef(null);

  // Initialize form if in edit mode
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.todo || "");
      setNotes(initialData.description || "");
      setPriority(initialData.priority || "MEDIUM");
      setCategory(initialData.category || "other");
      setShowDetails(true);

      // Set due date if exists
      if (initialData.dueDate) {
        const dateObj = new Date(initialData.dueDate);
        const formattedDate = dateObj.toISOString().split("T")[0];
        setDueDate(formattedDate);
      }
      setIsExpanded(true);
    }
  }, [initialData]);

  // Auto-focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!title.trim()) return;

    const todoData = {
      todo: title.trim(),
      description: notes.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    // When in edit mode, we're updating an existing todo
    if (editMode) {
      // Preserve the createdAt timestamp from the original todo
      todoData.createdAt = initialData.createdAt;
      // Call onUpdateTodo with the updated data
      onUpdateTodo(todoData);
    } else {
      // Add creation timestamp when creating a new todo
      todoData.createdAt = new Date().toISOString();
      onAddTodo(todoData);
      // Clear form
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setNotes("");
    setDueDate("");
    setPriority("MEDIUM");
    setCategory("other");
    setIsExpanded(false);
    setShowDetails(false);
  };

  const handleCancel = () => {
    if (editMode) {
      onCancel();
    } else {
      resetForm();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      // If Enter is pressed without modifier keys and not in the textarea
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.altKey &&
        e.target.tagName !== "TEXTAREA"
      ) {
        // Only if title exists and isn't just whitespace
        if (title.trim()) {
          e.preventDefault();
          handleSubmit();
        }
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [
      title,
      notes,
      priority,
      category,
      dueDate,
      editMode,
      onUpdateTodo,
      onAddTodo,
    ]
  );

  // Quick add form
  if (!isExpanded && !editMode) {
    return (
      <motion.div
        className={`${themeStyle.cardBg} rounded-xl overflow-hidden backdrop-blur-sm relative group`}
        style={{
          background: `linear-gradient(135deg, ${themeStyle.background} 0%, ${themeStyle.cardBg} 50%, ${themeStyle.background} 100%)`,
          boxShadow: `0 4px 24px -4px ${themeStyle.accent}12, 0 0 0 1px ${themeStyle.accent}08`,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          boxShadow: `0 8px 32px -4px ${themeStyle.accent}18, 0 0 20px ${themeStyle.accent}10`,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col">
          <div className="flex items-center">
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="What needs to be done?"
              className={`flex-grow p-4 border-0 focus:ring-0 ${themeStyle.inputBg} ${themeStyle.inputText}`}
            />
            <div className="pr-3">
              <motion.button
                type="button"
                onClick={() => {
                  if (title.trim()) handleSubmit();
                }}
                disabled={!title.trim()}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  title.trim()
                    ? `bg-gradient-to-r ${themeStyle.buttonPrimary} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105`
                    : `${themeStyle.inputBg} ${themeStyle.textSecondary} cursor-not-allowed opacity-50`
                }`}
                whileHover={title.trim() ? { scale: 1.05 } : {}}
                whileTap={title.trim() ? { scale: 0.95 } : {}}
              >
                <FaPlus className="text-sm" />
                <span>Add</span>
              </motion.button>
            </div>
          </div>

          {/* New clearer button for adding more details */}
          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              setShowDetails(true);
            }}
            className={`w-full py-2 text-sm font-medium ${themeStyle.accent} hover:${themeStyle.inputBg} flex items-center justify-center gap-1 transition-colors border-t ${themeStyle.inputBorder}`}
          >
            <FaChevronDown size={12} />
            <span>Add more details</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // Expanded form
  return (
    <AnimatePresence>
      <motion.div
        className={`${themeStyle.cardBg} rounded-xl overflow-hidden backdrop-blur-sm relative group mb-8`}
        style={{
          background: `linear-gradient(135deg, ${themeStyle.background} 0%, ${themeStyle.cardBg} 50%, ${themeStyle.background} 100%)`,
          boxShadow: `0 8px 32px -8px ${themeStyle.accentHex}15, 0 0 0 1px ${themeStyle.accentHex}08`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{
          boxShadow: `0 12px 40px -8px ${themeStyle.accentHex}20, 0 0 20px ${themeStyle.accentHex}10`,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`p-6 border-b ${themeStyle.inputBorder} flex justify-between items-center`}
        >
          <h2 className={`text-lg font-semibold ${themeStyle.textPrimary}`}>
            {editMode ? "Edit Task" : "Add New Task"}
          </h2>
          {!editMode && (
            <button
              type="button"
              onClick={handleCancel}
              className={`${themeStyle.textSecondary} hover:${themeStyle.textPrimary} transition-colors`}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-6 pb-4">
          {/* Title input */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${themeStyle.textSecondary} mb-2`}
            >
              Task Title*
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="What needs to be done?"
                className={`flex-grow p-3 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                required
              />
              {!showDetails && !editMode && (
                <motion.button
                  type="submit"
                  disabled={!title.trim()}
                  className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                    title.trim()
                      ? `bg-gradient-to-r ${themeStyle.buttonPrimary} text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105`
                      : `${themeStyle.inputBg} ${themeStyle.textSecondary} cursor-not-allowed opacity-50`
                  }`}
                  whileHover={title.trim() ? { scale: 1.05 } : {}}
                  whileTap={title.trim() ? { scale: 0.95 } : {}}
                >
                  <FaPlus />
                </motion.button>
              )}
            </div>
          </div>

          {/* Toggle details section */}
          {!editMode && (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className={`w-full text-center py-2 mb-3 text-sm ${themeStyle.textSecondary} hover:${themeStyle.inputBg} rounded-lg flex items-center justify-center gap-2 transition-all border ${themeStyle.inputBorder}`}
            >
              {showDetails ? (
                <>
                  Hide details <FaChevronUp />
                </>
              ) : (
                <>
                  Show details <FaChevronDown />
                </>
              )}
            </button>
          )}

          {/* Details section - conditionally shown */}
          <AnimatePresence>
            {(showDetails || editMode) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-6">
                  {/* Due date & Priority row */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <label
                        className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-3 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}
                      >
                        Priority
                      </label>
                      <div className="flex gap-2">
                        {PRIORITIES.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPriority(p.id)}
                            className={`flex-1 p-2 rounded-lg border ${
                              priority === p.id
                                ? "border-2 border-blue-500 shadow-sm"
                                : `${themeStyle.inputBorder}`
                            } transition-all`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: p.color }}
                              ></span>
                              <span
                                className={`text-sm ${themeStyle.textPrimary}`}
                              >
                                {p.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category chips */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}
                    >
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            category === cat.id
                              ? "text-white"
                              : `${themeStyle.textSecondary} border ${themeStyle.inputBorder}`
                          }`}
                          style={{
                            backgroundColor:
                              category === cat.id ? cat.color : "transparent",
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes textarea */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}
                    >
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional details..."
                      rows="3"
                      className={`w-full p-3 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                    ></textarea>
                    <small
                      className={`text-xs italic mt-1 block ${themeStyle.textSecondary}`}
                    >
                      Press Shift+Enter for line breaks
                    </small>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons - only show if details are expanded or in edit mode */}
          {(showDetails || editMode) && (
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className={`px-4 py-2 rounded-lg border ${themeStyle.inputBorder} ${themeStyle.textPrimary} hover:${themeStyle.inputBg} transition-colors`}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={!title.trim()}
                className={`px-6 py-2.5 rounded-lg bg-gradient-to-r ${
                  themeStyle.buttonPrimary
                } text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ${
                  !title.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "transform hover:scale-105"
                }`}
                whileHover={title.trim() ? { scale: 1.05 } : {}}
                whileTap={title.trim() ? { scale: 0.95 } : {}}
              >
                <FaPlus className="text-sm" />
                <span>{editMode ? "Update Task" : "Add Task"}</span>
              </motion.button>
            </div>
          )}
        </form>

        {/* Creation timestamp display - fix position and styling */}
        <div className="px-4 pb-4 pt-1">
          {!editMode && (
            <div className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <FaClock size={10} />
              <span>
                Task will be recorded at{" "}
                {new Date().toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          )}

          {editMode && initialData?.createdAt && (
            <div className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <FaClock size={10} />
              <span>
                Created on{" "}
                {new Date(initialData.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoForm;
