import { useState, forwardRef, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaTrashAlt, FaEdit, FaCheck, FaCalendar, FaClock, FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown, FaThumbtack } from 'react-icons/fa';

// Helper function to format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return { formattedDate: 'Unknown date', formattedTime: 'Unknown time' };
  
  const date = new Date(dateString);
  
  // Format date as "Mon, Jan 15, 2023"
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  // Format time as "3:42 PM"
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return { formattedDate, formattedTime };
};

// Default values for priority and category
const DEFAULT_PRIORITY = { id: "MEDIUM", label: "Medium", color: "#f59e0b" };
const DEFAULT_CATEGORY = { id: "other", label: "Other", color: "#6b7280" };

const todoVariants = {
  initial: (direction) => ({
    x: direction === 'up' ? -300 : 300,
    opacity: 0,
    scale: 0.8,
    rotate: direction === 'up' ? -10 : 10,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 1,
    }
  },
  exit: (direction) => ({
    x: direction === 'up' ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotate: direction === 'up' ? 10 : -10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    }
  }),
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
  }
};

const TodoItem = forwardRef(({ 
  todo, 
  onDelete, 
  onToggleComplete, 
  onEdit, 
  themeStyle,
  priorityInfo,
  categoryInfo,
  onPin,
  onMove,
  isPinned,
}, ref) => {
  const [moveDirection, setMoveDirection] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const controls = useAnimation();
  const itemRef = useRef(null);

  // Handle move with animation
  const handleMove = (direction) => {
    // Call the move function immediately - don't wait for animation
    onMove(todo.id, direction);
    
    // Simple visual feedback animation
    controls.start({
      y: direction === 'up' ? -5 : 5,
      transition: { duration: 0.1 }
    }).then(() => {
      controls.start({
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 500, 
          damping: 30
        }
      });
    });
  };

  // Cleanup the useEffect to be simpler
  useEffect(() => {
    return () => {
      // Cleanup animation when component unmounts
      controls.stop();
    };
  }, [controls]);

  // Add default values to prevent the undefined error
  const safeCategory = categoryInfo || DEFAULT_CATEGORY;
  const safePriority = priorityInfo || DEFAULT_PRIORITY;

  // Check if the task is overdue
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;
  
  const { formattedDate: dueDate } = todo.dueDate ? formatDateTime(todo.dueDate) : { formattedDate: null };
  const { formattedDate: createdDate, formattedTime: createdTime } = 
    todo.createdAt ? formatDateTime(todo.createdAt) : { formattedDate: '', formattedTime: '' };
  
  // Determine if we should automatically show details
  const hasDetails = todo.description || todo.createdAt;
  
  return (
    <motion.div
      ref={(node) => {
        // Combine refs
        if (ref) {
          if (typeof ref === 'function') ref(node);
          else ref.current = node;
        }
        itemRef.current = node;
      }}
      layout
      layoutId={todo.id}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className={`rounded-xl shadow-sm border overflow-hidden transition-colors ${
        isPinned ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${
        todo.isCompleted 
          ? `${themeStyle.completedBg} border-gray-200 dark:border-gray-700` 
          : `${themeStyle.cardBg} border-gray-200 dark:border-gray-700 ${
              isOverdue ? 'border-red-300 dark:border-red-700' : ''
            }`
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(todo.id)}
            className="mt-0.5 flex-shrink-0"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
              todo.isCompleted 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {todo.isCompleted && <FaCheck className="text-white text-xs" />}
            </div>
          </button>
          
          {/* Content */}
          <div className="flex-grow min-w-0">
            <h3 className={`text-base font-medium break-words ${
              todo.isCompleted 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : themeStyle.textPrimary
            }`}>
              {todo.todo}
            </h3>
            
            {/* Category and priority badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Category badge */}
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: safeCategory.color }}
              >
                {safeCategory.label}
              </span>
              
              {/* Priority badge */}
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: safePriority.color }}
              >
                {safePriority.label}
              </span>
              
              {/* Due date badge - if exists */}
              {todo.dueDate && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 
                  ${isOverdue && !todo.isCompleted 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
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
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  {todo.description && (
                    <p className={`text-sm ${themeStyle.textSecondary} mb-3 whitespace-pre-wrap`}>
                      {todo.description}
                    </p>
                  )}
                  
                  {/* Creation timestamp */}
                  {todo.createdAt && (
                    <div className={`text-xs italic ${themeStyle.textSecondary} flex items-center gap-1 mt-2 border-t pt-2 border-gray-200 dark:border-gray-700`}>
                      <FaClock size={10} className="opacity-70" />
                      Created on {createdDate} at {createdTime}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9,
                transition: { duration: 0.1 } 
              }}
              onClick={() => handleMove('up')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative overflow-hidden"
            >
              <FaArrowUp className="text-gray-500 dark:text-gray-400 relative z-10" />
              <motion.span
                className="absolute inset-0 bg-blue-400/20 rounded-full z-0"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ 
                  scale: 1.5, 
                  opacity: 1,
                  transition: { duration: 0.3 } 
                }}
                exit={{ scale: 0, opacity: 0 }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9,
                transition: { duration: 0.1 } 
              }}
              onClick={() => handleMove('down')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative overflow-hidden"
            >
              <FaArrowDown className="text-gray-500 dark:text-gray-400 relative z-10" />
              <motion.span
                className="absolute inset-0 bg-blue-400/20 rounded-full z-0"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ 
                  scale: 1.5, 
                  opacity: 1,
                  transition: { duration: 0.3 } 
                }}
                exit={{ scale: 0, opacity: 0 }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPin(todo.id)}
              className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ${
                isPinned ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <FaThumbtack className={isPinned ? 'transform -rotate-45' : ''} />
            </motion.button>
            
            <button
              onClick={() => onEdit(todo)} // Pass the entire todo object
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-gray-400 hover:text-red-500"
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;