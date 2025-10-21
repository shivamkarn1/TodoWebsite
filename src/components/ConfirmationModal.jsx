import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  themeStyle,
}) => {
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Focus trap to keep focus inside modal for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop with theme-aware overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              backgroundColor:
                themeStyle.background === "rgba(255, 255, 255, 0.8)"
                  ? "rgba(0, 0, 0, 0.4)"
                  : "rgba(0, 0, 0, 0.6)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative ${themeStyle.cardBg} rounded-xl shadow-2xl max-w-md w-full overflow-hidden border-2 ${themeStyle.inputBorder}`}
            ref={modalRef}
          >
            {/* Header */}
            <div className={`p-6 border-b ${themeStyle.inputBorder}`}>
              <h3 className={`text-xl font-semibold ${themeStyle.textPrimary}`}>
                {title}
              </h3>
            </div>

            {/* Content */}
            <div className={`p-6 ${themeStyle.textSecondary}`}>
              <p className="leading-relaxed">{message}</p>
            </div>

            {/* Actions */}
            <div
              className={`p-6 ${themeStyle.inputBg} border-t ${themeStyle.inputBorder} flex justify-end space-x-3`}
            >
              <button
                onClick={onClose}
                className={`px-6 py-2.5 rounded-lg border-2 ${
                  themeStyle.inputBorder
                } ${themeStyle.inputBg} ${
                  themeStyle.textPrimary
                } hover:${themeStyle.inputBorder
                  .replace("border-", "bg-")
                  .replace("-300", "-100")
                  .replace(
                    "-600",
                    "-700"
                  )} transition-all duration-200 font-medium`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-6 py-2.5 rounded-lg ${themeStyle.buttonDanger} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default ConfirmationModal;
