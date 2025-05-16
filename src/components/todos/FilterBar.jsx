import { useState } from 'react';
import { FaSearch, FaFilter, FaChevronDown, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FilterBar = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  showCompleted,
  onShowCompletedChange,
  onClearCompleted,
  hasCompletedTasks,
  themeStyle,
  priorities,
  categories
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const isFiltered = 
    filter !== "all" || 
    priorityFilter !== "all" || 
    categoryFilter !== "all" || 
    searchTerm;
  
  return (
    <div className={`${themeStyle.cardBg} rounded-xl shadow-md p-4 mb-6`}>
      {/* Search bar with filter toggle */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className={`w-full pl-10 p-2.5 rounded-lg border ${themeStyle.inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-lg border ${themeStyle.inputBorder} ${
            isFiltered ? 'text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700' : 
            `${themeStyle.textSecondary}`
          } focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2`}
        >
          <FaFilter />
          <span className="hidden sm:inline">Filters</span>
          {isFiltered && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs rounded-full px-1.5 py-0.5">
              {/* Count active filters */}
              {(filter !== "all" ? 1 : 0) + 
               (priorityFilter !== "all" ? 1 : 0) + 
               (categoryFilter !== "all" ? 1 : 0) +
               (searchTerm ? 1 : 0)}
            </span>
          )}
          <FaChevronDown className="text-xs" />
        </button>
      </div>
      
      {/* Filter options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t mt-4 border-gray-100 dark:border-gray-700">
              {/* Status filter */}
              <div>
                <label className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}>Status</label>
                <select
                  value={filter}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className={`w-full p-2 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {/* Priority filter */}
              <div>
                <label className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}>Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => onPriorityFilterChange(e.target.value)}
                  className={`w-full p-2 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                >
                  <option value="all">All Priorities</option>
                  {Object.entries(priorities).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label} Priority
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category filter */}
              <div>
                <label className={`block text-sm font-medium ${themeStyle.textSecondary} mb-1`}>Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => onCategoryFilterChange(e.target.value)}
                  className={`w-full p-2 border ${themeStyle.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeStyle.inputBg} ${themeStyle.inputText}`}
                >
                  <option value="all">All Categories</option>
                  {categories.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Show completed checkbox & Clear completed button */}
              <div className="flex flex-col">
                <div className="flex items-center h-9 mb-1">
                  <input
                    type="checkbox"
                    id="showCompleted"
                    checked={showCompleted}
                    onChange={() => onShowCompletedChange(!showCompleted)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showCompleted" className={`ml-2 text-sm ${themeStyle.textSecondary}`}>
                    Show completed tasks
                  </label>
                </div>
                
                <button
                  onClick={onClearCompleted}
                  disabled={!hasCompletedTasks}
                  className={`mt-auto text-sm ${themeStyle.buttonDanger} text-white px-3 py-2 rounded-lg transition-colors ${!hasCompletedTasks ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Clear completed
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;