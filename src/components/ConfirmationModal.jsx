import React, { useEffect, useRef } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  themeStyle 
}) => {
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Close when clicking outside
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        ref={modalRef}
        className={`${themeStyle.cardBg} rounded-lg shadow-xl w-full max-w-md transform transition-all animate-fadeIn`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <h3 className={`text-lg font-medium ${themeStyle.textPrimary}`}>{title}</h3>
          </div>
          
          <p className={`mt-4 ${themeStyle.textSecondary}`}>{message}</p>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${themeStyle.buttonSecondary} text-white transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md ${themeStyle.buttonDanger} text-white transition-colors`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;