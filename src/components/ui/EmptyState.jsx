import { FaRegSadTear } from "react-icons/fa";
import { motion } from "framer-motion";

const EmptyState = ({
  message = "No items found",
  icon = <FaRegSadTear />,
  themeStyle,
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl backdrop-blur-sm relative overflow-hidden group ${
        themeStyle?.inputBg || "bg-gray-50 dark:bg-gray-800/50"
      }`}
      style={{
        background: `linear-gradient(135deg, ${
          themeStyle?.background || "transparent"
        } 0%, ${themeStyle?.cardBg || "transparent"} 50%, ${
          themeStyle?.background || "transparent"
        } 100%)`,
        boxShadow: `0 8px 32px -8px ${
          themeStyle?.accent || "rgba(0,0,0,0.1)"
        }10, 0 0 0 1px ${themeStyle?.accent || "rgba(0,0,0,0.1)"}05`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        boxShadow: `0 12px 40px -8px ${
          themeStyle?.accent || "rgba(0,0,0,0.1)"
        }15, 0 0 20px ${themeStyle?.accent || "rgba(0,0,0,0.1)"}08`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12"></div>
      <motion.div
        className={`${
          themeStyle?.textSecondary || "text-gray-400 dark:text-gray-500"
        } text-4xl mb-3 relative z-10`}
        animate={{
          rotate: [0, -10, 10, -5, 5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      >
        {icon}
      </motion.div>
      <motion.p
        className={`${
          themeStyle?.textSecondary || "text-gray-500 dark:text-gray-400"
        } relative z-10`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default EmptyState;
