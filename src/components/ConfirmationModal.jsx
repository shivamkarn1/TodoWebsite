import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, themeStyle }) => {
  const modalRef = useRef(null);
  
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
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
      if (e.key === 'Tab') {
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
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);
  
  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`${themeStyle.cardBg} rounded-xl shadow-lg max-w-md w-full overflow-hidden`}
            ref={modalRef}
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${themeStyle.textPrimary}`}>{title}</h3>
            </div>
            
            <div className={`p-5 ${themeStyle.textSecondary}`}>
              <p>{message}</p>
            </div>
            
            <div className="p-5 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border ${themeStyle.inputBorder} ${themeStyle.textPrimary} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg ${themeStyle.buttonDanger} text-white font-medium shadow-sm hover:shadow-md transition-all`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
  
  return createPortal(content, document.body);
};

export default ConfirmationModal;