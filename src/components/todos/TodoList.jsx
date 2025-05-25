import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';
import EmptyState from '../ui/EmptyState';
import { forwardRef, useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaThumbtack, FaEdit, FaTrashAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Define priority and category information
const PRIORITIES = {
  "HIGH": { id: "HIGH", label: "High", color: "#ef4444" },
  "MEDIUM": { id: "MEDIUM", label: "Medium", color:  "#f59e0b" },
  "LOW": { id: "LOW", label: "Low", color: "#10b981" },
};

const CATEGORIES = {
  "work": { id: "work", label: "Work", color: "#3b82f6" },
  "personal": { id: "personal", label: "Personal", color: "#8b5cf6" },
  "health": { id: "health", label: "Health", color: "#10b981" },
  "shopping": { id: "shopping", label: "Shopping", color: "#f59e0b" }, 
  "other": { id: "other", label: "Other", color: "#6b7280" },
};

const ActionButton = forwardRef(({ icon: Icon, onClick, label, active, className = "" }, ref) => {
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      whileHover={{ 
        scale: 1.1,
        backgroundColor: "rgba(59, 130, 246, 0.1)" 
      }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative p-2 rounded-full
        transition-colors duration-200
        ${active ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400'}
        hover:text-blue-600 dark:hover:text-blue-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ${className}
      `}
      title={label}
    >
      <span className="sr-only">{label}</span>
      <Icon className="w-5 h-5" />
      
      {/* Ripple effect on click */}
      <motion.span
        className="absolute inset-0 rounded-full bg-blue-400 opacity-0"
        whileTap={{
          opacity: [0, 0.3, 0],
          scale: [0.8, 1.1, 1],
          transition: { duration: 0.4 }
        }}
      />
    </motion.button>
  );
});

ActionButton.displayName = 'ActionButton';

const TodoGroup = forwardRef(({ children, title, count, themeStyle }, ref) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div ref={ref} className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-lg font-semibold ${themeStyle.textPrimary}`}>
          {title} <span className="text-sm text-gray-500">({count})</span>
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
            ${themeStyle.textSecondary}`}
        >
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3 },
              opacity: { duration: 0.2 }
            }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TodoGroup.displayName = 'TodoGroup';

const TodoList = ({ 
  todayTodos = [],
  upcomingTodos = [],
  completedTodos = [],
  onDeleteTodo,
  onToggleComplete,
  onEditTodo,
  onPinTodo,
  onMoveTodo,
  pinnedTodos = [],
  themeStyle,
}) => {
  // Add state for sections collapse
  const [collapsedSections, setCollapsedSections] = useState({
    today: false,
    upcoming: false,
    completed: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderTodoItems = (todos) => {
    if (!Array.isArray(todos)) return null;
    
    return todos.map((todo) => (
      <motion.div
        key={todo.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <TodoItem
          todo={todo}
          onDelete={onDeleteTodo}
          onToggleComplete={onToggleComplete}
          onEdit={onEditTodo}
          onPin={onPinTodo}
          onMove={onMoveTodo}
          isPinned={pinnedTodos.includes(todo.id)}
          themeStyle={themeStyle}
        />
      </motion.div>
    ));
  };

  return (
    <div className="space-y-6">
      <TodoGroup
        title="Today"
        count={todayTodos.length}
        isCollapsed={collapsedSections.today}
        onToggle={() => toggleSection('today')}
        themeStyle={themeStyle}
      >
        <AnimatePresence mode="popLayout">
          {todayTodos.length > 0 ? (
            renderTodoItems(todayTodos)
          ) : (
            <EmptyState message="No tasks for today" />
          )}
        </AnimatePresence>
      </TodoGroup>

      <TodoGroup
        title="Upcoming"
        count={upcomingTodos.length}
        isCollapsed={collapsedSections.upcoming}
        onToggle={() => toggleSection('upcoming')}
        themeStyle={themeStyle}
      >
        <AnimatePresence mode="popLayout">
          {upcomingTodos.length > 0 ? (
            renderTodoItems(upcomingTodos)
          ) : (
            <EmptyState message="No upcoming tasks" />
          )}
        </AnimatePresence>
      </TodoGroup>

      <TodoGroup
        title="Completed"
        count={completedTodos.length}
        isCollapsed={collapsedSections.completed}
        onToggle={() => toggleSection('completed')}
        themeStyle={themeStyle}
      >
        <AnimatePresence mode="popLayout">
          {completedTodos.length > 0 ? (
            renderTodoItems(completedTodos)
          ) : (
            <EmptyState message="No completed tasks" />
          )}
        </AnimatePresence>
      </TodoGroup>
    </div>
  );
};

export default TodoList;