import { AnimatePresence } from "framer-motion";
import TodoItem from "./TodoItem";
import TodoGrouping from "./TodoGrouping";
import EmptyState from "../ui/EmptyState";

// Define priority and category information
const PRIORITIES = {
  HIGH: { id: "HIGH", label: "High", color: "#ef4444" },
  MEDIUM: { id: "MEDIUM", label: "Medium", color: "#f59e0b" },
  LOW: { id: "LOW", label: "Low", color: "#10b981" },
};

const CATEGORIES = {
  work: { id: "work", label: "Work", color: "#3b82f6" },
  personal: { id: "personal", label: "Personal", color: "#8b5cf6" },
  health: { id: "health", label: "Health", color: "#10b981" },
  shopping: { id: "shopping", label: "Shopping", color: "#f59e0b" },
  other: { id: "other", label: "Other", color: "#6b7280" },
};

const TodoList = ({
  todayTodos = [], // Add default empty arrays
  upcomingTodos = [],
  completedTodos = [],
  onDeleteTodo,
  onToggleComplete,
  onEditTodo,
  onMoveUp,
  onMoveDown,
  onTogglePin,
  themeStyle,
}) => {
  // Helper function to get priority info
  const getPriorityInfo = (priorityId) => {
    return PRIORITIES[priorityId] || PRIORITIES.MEDIUM;
  };

  // Helper function to get category info
  const getCategoryInfo = (categoryId) => {
    return CATEGORIES[categoryId] || CATEGORIES.other;
  };

  return (
    <div className="space-y-6">
      {/* Today's todos */}
      <TodoGrouping
        title="Today"
        count={todayTodos?.length || 0} // Use optional chaining and fallback
        themeStyle={themeStyle}
        defaultOpen={true}
      >
        {todayTodos?.length > 0 ? (
          <AnimatePresence>
            {todayTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDeleteTodo}
                onToggleComplete={onToggleComplete}
                onEdit={() => onEditTodo(todo)} // Ensure we're passing the whole todo object
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onTogglePin={onTogglePin}
                themeStyle={themeStyle}
                priorityInfo={getPriorityInfo(todo.priority)}
                categoryInfo={getCategoryInfo(todo.category)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState message="No tasks for today" themeStyle={themeStyle} />
        )}
      </TodoGrouping>

      {/* Upcoming todos */}
      <TodoGrouping
        title="Upcoming"
        count={upcomingTodos?.length || 0} // Use optional chaining and fallback
        themeStyle={themeStyle}
        defaultOpen={upcomingTodos?.length > 0}
      >
        {upcomingTodos?.length > 0 ? (
          <AnimatePresence>
            {upcomingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDeleteTodo}
                onToggleComplete={onToggleComplete}
                onEdit={() => onEditTodo(todo)} // Ensure we're passing the whole todo object
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onTogglePin={onTogglePin}
                themeStyle={themeStyle}
                priorityInfo={getPriorityInfo(todo.priority)}
                categoryInfo={getCategoryInfo(todo.category)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState message="No upcoming tasks" themeStyle={themeStyle} />
        )}
      </TodoGrouping>

      {/* Completed todos */}
      <TodoGrouping
        title="Completed"
        count={completedTodos?.length || 0} // Use optional chaining and fallback
        themeStyle={themeStyle}
        defaultOpen={false}
      >
        {completedTodos?.length > 0 ? (
          <AnimatePresence>
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDeleteTodo}
                onToggleComplete={onToggleComplete}
                onEdit={() => onEditTodo(todo)} // Ensure we're passing the whole todo object
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onTogglePin={onTogglePin}
                themeStyle={themeStyle}
                priorityInfo={getPriorityInfo(todo.priority)}
                categoryInfo={getCategoryInfo(todo.category)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState
            message="No completed tasks yet"
            themeStyle={themeStyle}
          />
        )}
      </TodoGrouping>
    </div>
  );
};

export default TodoList;
