import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaRegCalendarAlt } from 'react-icons/fa';
import { MdPriorityHigh, MdLowPriority } from 'react-icons/md';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';

const PRIORITIES = [
  { id: "HIGH", label: "High", color: "#ef4444", icon: <MdPriorityHigh /> },
  { id: "MEDIUM", label: "Medium", color: "#f59e0b", icon: null },
  { id: "LOW", label: "Low", color: "#10b981", icon: <MdLowPriority /> },
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
  themeStyle
}) => {
  const [isExpanded, setIsExpanded] = useState(!!editMode);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('other');
  
  const titleInputRef = useRef(null);
  
  // Initialize form if in edit mode
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.todo || '');
      setNotes(initialData.description || '');
      setPriority(initialData.priority || 'MEDIUM');
      setCategory(initialData.category || 'other');
      setIsAdvancedOpen(!!initialData.description || initialData.priority === 'HIGH' || initialData.priority === 'LOW');
      
      // Set due date if exists
      if (initialData.dueDate) {
        const dateObj = new Date(initialData.dueDate);
        const formattedDate = dateObj.toISOString().split('T')[0];
        setDueDate(formattedDate);
      }
      setIsExpanded(true);
    }
  }, [initialData]);
  
  // Auto focus title input when form is expanded
  useEffect(() => {
    if (isExpanded && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTask();
  };
  
  const saveTask = () => {
    if (!title.trim()) return;
    
    const todo = {
      todo: title.trim(),
      description: notes.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };
    
    if (editMode) {
      onUpdateTodo(todo);
    } else {
      onAddTodo(todo);
      // Clear form
      resetForm();
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setNotes('');
    setDueDate('');
    setPriority('MEDIUM');
    setCategory('other');
    setIsExpanded(false);
    setIsAdvancedOpen(false);
  };

  const handleCancel = () => {
    if (editMode) {
      onCancel();
    } else {
      resetForm();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift key and not in textarea
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      if (title.trim()) {
        e.preventDefault();
        saveTask();
      }
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  // Quick add todo without opening the advanced form
  const handleQuickAdd = () => {
    if (!title.trim()) {
      setIsExpanded(true);
      return;
    }
    
    const todo = {
      todo: title.trim(),
      description: "",
      priority: "MEDIUM",
      category: "other",
      dueDate: null,
    };
    
    onAddTodo(todo);
    resetForm();
  };

  // Collapsed simple input (quick add mode)
  if (!isExpanded && !editMode) {
    return (
      <motion.div 
        className={`${themeStyle.cardBg} mb-6 rounded-xl shadow-md overflow-hidden p-1`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center">
          <input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Add a new task..."
            className={`flex-1 p-3 border-0 focus:ring-0 ${themeStyle.inputBg} ${themeStyle.textPrimary}`}
          />
          
          <div className="flex items-center px-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="More options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
            
            <button
              onClick={handleQuickAdd}
              disabled={!title.trim()}
              className={`ml-1 p-2 rounded-full ${
                title.trim() 
                  ? `text-white bg-gradient-to-r ${themeStyle.buttonPrimary}` 
                  : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
              }`}
              title="Add task"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Expanded form
  return (
    <AnimatePresence>
      <motion.div
        className={`${themeStyle.cardBg} rounded-xl shadow-md mb-6 overflow-hidden`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${themeStyle.textPrimary}`}>
              {editMode ? "Edit Task" : "Add New Task"}
            </h2>
            {!editMode && (
              <button 
                type="button"
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            {/* Title input */}
            <div>
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="What needs to be done?"
                className={`w-full p-3 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                required
              />
              <small className={`text-xs italic mt-1 block ${themeStyle.textSecondary}`}>
                Press Enter to save quickly
              </small>
            </div>
            
            {/* Quick category selector */}
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1 ${
                    category === cat.id
                      ? 'text-white'
                      : `${themeStyle.textSecondary} border ${themeStyle.inputBorder} hover:bg-gray-50 dark:hover:bg-gray-700`
                  }`}
                  style={{ 
                    backgroundColor: category === cat.id ? cat.color : 'transparent'
                  }}
                >
                  {cat.label}
                  {category === cat.id && <span className="ml-1">✓</span>}
                </button>
              ))}
            </div>
            
            {/* Quick priority selector */}
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`flex-1 p-2 rounded-lg border ${
                    priority === p.id 
                      ? 'shadow-sm' 
                      : `${themeStyle.inputBorder}`
                  } transition-all`}
                  style={{
                    borderColor: priority === p.id ? p.color : undefined,
                    borderWidth: priority === p.id ? '2px' : '1px'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    ></span>
                    <span className={`text-sm ${themeStyle.textPrimary}`}>{p.label}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Simple due date picker with icon */}
            <div className="flex items-center border rounded-lg p-2 gap-2">
              <FaRegCalendarAlt className={`text-gray-400`} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`flex-1 border-0 p-1 ${themeStyle.inputBg} ${themeStyle.textPrimary} focus:ring-0`}
              />
            </div>
            
            {/* Toggle for advanced options */}
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`w-full text-left px-4 py-2 text-sm ${themeStyle.textSecondary} hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex justify-between items-center`}
            >
              <span>{isAdvancedOpen ? "Hide details" : "Add notes"}</span>
              <svg className={`transform transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} 
                width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Advanced options (collapsible) */}
            <AnimatePresence>
              {isAdvancedOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add details about your task..."
                      rows="3"
                      className={`w-full p-3 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.textPrimary}`}
                    ></textarea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className={`px-4 py-2 rounded-lg border ${themeStyle.inputBorder} ${themeStyle.textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${themeStyle.buttonPrimary} text-white font-medium shadow-sm hover:shadow-md transition-all flex gap-2 items-center`}
              >
                {editMode ? (
                  <>
                    <IoCheckmarkDoneSharp /> Update
                  </>
                ) : (
                  <>
                    <FaPlus /> Add Task
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoForm;