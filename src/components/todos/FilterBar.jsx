import { motion } from "framer-motion";

const FilterBar = ({
  showCompleted,
  onShowCompletedChange,
  onClearCompleted,
  hasCompletedTasks,
  themeStyle,
}) => {
  return (
    <motion.div
      className={`${themeStyle.cardBg} rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm relative overflow-hidden group`}
      style={{
        background: `linear-gradient(135deg, ${themeStyle.background} 0%, ${themeStyle.cardBg} 50%, ${themeStyle.background} 100%)`,
        boxShadow: `0 8px 32px -8px ${themeStyle.accentHex}15, 0 0 0 1px ${themeStyle.accentHex}08`,
      }}
      whileHover={{
        boxShadow: `0 12px 40px -8px ${themeStyle.accentHex}20, 0 0 20px ${themeStyle.accentHex}10`,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12"></div>

      {/* Actions */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={() => onShowCompletedChange(!showCompleted)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="showCompleted"
            className={`ml-2 text-sm ${themeStyle.textSecondary}`}
          >
            Show completed tasks
          </label>
        </div>

        <button
          onClick={onClearCompleted}
          disabled={!hasCompletedTasks}
          className={`text-sm bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 ${
            !hasCompletedTasks ? "opacity-50" : ""
          }`}
        >
          Clear completed
        </button>
      </div>
    </motion.div>
  );
};

export default FilterBar;
