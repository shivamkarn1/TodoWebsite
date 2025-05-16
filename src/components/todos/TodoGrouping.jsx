import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaCalendarDay, FaCalendarWeek, FaCheckDouble } from 'react-icons/fa';

const TodoGrouping = ({ title, count, children, themeStyle, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Define section-specific styling and icons
  let sectionStyle = {
    bgColor: 'bg-white dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    iconColor: 'text-gray-400 dark:text-gray-500',
    countBgColor: 'bg-gray-200 dark:bg-gray-700',
    countTextColor: 'text-gray-700 dark:text-gray-300',
    icon: <FaCalendarDay />
  };
  
  if (title === "Today") {
    sectionStyle = {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-500 dark:text-blue-400',
      countBgColor: 'bg-blue-500 dark:bg-blue-600',
      countTextColor: 'text-white',
      icon: <FaCalendarDay />
    };
  } else if (title === "Upcoming") {
    sectionStyle = {
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-500 dark:text-amber-400',
      countBgColor: 'bg-amber-500 dark:bg-amber-600',
      countTextColor: 'text-white',
      icon: <FaCalendarWeek />
    };
  } else if (title === "Completed") {
    sectionStyle = {
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-500 dark:text-green-400',
      countBgColor: 'bg-green-500 dark:bg-green-600',
      countTextColor: 'text-white',
      icon: <FaCheckDouble />
    };
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl 
          shadow-sm hover:shadow transition-all border-2
          ${sectionStyle.bgColor} ${sectionStyle.borderColor}
        `}
      >
        <div className="flex items-center gap-3">
          <span className={`${sectionStyle.iconColor}`}>{sectionStyle.icon}</span>
          <h3 className={`font-bold text-gray-800 dark:text-white`}>{title}</h3>
          <span className={`
            px-2.5 py-0.5 rounded-full text-sm font-medium
            ${sectionStyle.countBgColor} ${sectionStyle.countTextColor}
          `}>
            {count}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className={`text-sm mr-2 text-gray-600 dark:text-gray-400`}>
            {isOpen ? "Hide" : "Show"}
          </span>
          {isOpen ? 
            <FaChevronUp className="text-gray-600 dark:text-gray-400" /> : 
            <FaChevronDown className="text-gray-600 dark:text-gray-400" />
          }
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-3 space-y-3">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default TodoGrouping;