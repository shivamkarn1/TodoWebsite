import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaCalendarDay,
  FaCalendarWeek,
  FaCheckDouble,
} from "react-icons/fa";

const TodoGrouping = ({
  title,
  count,
  children,
  themeStyle,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Define section-specific styling with theme integration
  let sectionStyle = {
    bgColor: themeStyle.cardBg,
    borderColor: themeStyle.inputBorder,
    iconColor: themeStyle.textSecondary,
    countBgColor: themeStyle.inputBg,
    countTextColor: themeStyle.textPrimary,
    headerTextColor: themeStyle.textPrimary,
    icon: <FaCalendarDay />,
  };

  if (title === "Today") {
    const todayColors =
      themeStyle.sectionColors?.today || "border-blue-200 bg-blue-50/30";
    sectionStyle = {
      bgColor: `${themeStyle.cardBg} backdrop-blur-sm`,
      borderColor: todayColors,
      iconColor: `${themeStyle.accent}`,
      countBgColor: `bg-gradient-to-r ${themeStyle.buttonPrimary}`,
      countTextColor: "text-white font-bold",
      headerTextColor: `${themeStyle.textPrimary} font-bold`,
      icon: <FaCalendarDay />,
    };
  } else if (title === "Upcoming") {
    const upcomingColors =
      themeStyle.sectionColors?.upcoming || "border-purple-200 bg-purple-50/30";
    sectionStyle = {
      bgColor: `${themeStyle.cardBg} backdrop-blur-sm`,
      borderColor: upcomingColors,
      iconColor: `${themeStyle.accent}`,
      countBgColor: `bg-gradient-to-r ${themeStyle.buttonPrimary}`,
      countTextColor: "text-white font-bold",
      headerTextColor: `${themeStyle.textPrimary} font-bold`,
      icon: <FaCalendarWeek />,
    };
  } else if (title === "Completed") {
    const completedColors =
      themeStyle.sectionColors?.completed || "border-green-200 bg-green-50/30";
    sectionStyle = {
      bgColor: `${themeStyle.cardBg} backdrop-blur-sm`,
      borderColor: completedColors,
      iconColor: `${themeStyle.accent}`,
      countBgColor: `bg-gradient-to-r ${themeStyle.buttonPrimary}`,
      countTextColor: "text-white font-bold",
      headerTextColor: `${themeStyle.textPrimary} font-bold`,
      icon: <FaCheckDouble />,
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
          <span className={`${sectionStyle.iconColor}`}>
            {sectionStyle.icon}
          </span>
          <h3 className={`font-bold ${sectionStyle.headerTextColor}`}>
            {title}
          </h3>
          <span
            className={`
            px-2.5 py-0.5 rounded-full text-sm font-medium
            ${sectionStyle.countBgColor} ${sectionStyle.countTextColor}
          `}
          >
            {count}
          </span>
        </div>

        <div className="flex items-center">
          <span className={`text-sm mr-2 ${themeStyle.textSecondary}`}>
            {isOpen ? "Hide" : "Show"}
          </span>
          {isOpen ? (
            <FaChevronUp className={`${themeStyle.textSecondary}`} />
          ) : (
            <FaChevronDown className={`${themeStyle.textSecondary}`} />
          )}
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-3 space-y-3">{children}</div>
      </motion.div>
    </div>
  );
};

export default TodoGrouping;
