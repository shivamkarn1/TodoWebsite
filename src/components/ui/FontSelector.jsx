import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbLetterCase, TbChevronDown } from "react-icons/tb";

const FONT_OPTIONS = [
  {
    id: "inter",
    name: "Inter",
    display: "Aa",
    family: "Inter, sans-serif",
    className: "font-inter",
    description: "Modern & Clean",
  },
  {
    id: "poppins",
    name: "Poppins",
    display: "Aa",
    family: "Poppins, sans-serif",
    className: "font-poppins",
    description: "Friendly & Round",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    display: "Aa",
    family: "Montserrat, sans-serif",
    className: "font-montserrat",
    description: "Professional",
  },
  {
    id: "roboto",
    name: "Roboto",
    display: "Aa",
    family: "Roboto, sans-serif",
    className: "font-roboto",
    description: "Google Material",
  },
  {
    id: "bitcount",
    name: "Bitcount Grid",
    display: "Aa",
    family: "Bitcount Grid Single, monospace",
    className: "font-bitcount",
    description: "Pixel Perfect",
  },
  {
    id: "playwrite-de",
    name: "Playwrite DE",
    display: "Aa",
    family: "Playwrite DE Grund Guides, cursive",
    className: "font-playwrite-de",
    description: "Handwritten",
  },
  {
    id: "playwrite-au",
    name: "Playwrite AU",
    display: "Aa",
    family: "Playwrite AU TAS, cursive",
    className: "font-playwrite-au",
    description: "Elegant Script",
  },
  {
    id: "pacifico",
    name: "Pacifico",
    display: "Aa",
    family: "Pacifico, cursive",
    className: "font-pacifico",
    description: "Fun & Playful",
  },
  {
    id: "coiny",
    name: "Coiny",
    display: "Aa",
    family: "Coiny, cursive",
    className: "font-coiny",
    description: "Bold & Round",
  },
  {
    id: "source-code",
    name: "Source Code Pro",
    display: "Aa",
    family: "Source Code Pro, monospace",
    className: "font-source-code",
    description: "Developer Font",
  },
];

const FontSelector = ({ currentFont, setFont }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const selectedFont =
    FONT_OPTIONS.find((f) => f.id === currentFont) || FONT_OPTIONS[0];

  const handleFontSelect = (fontId) => {
    setFont(fontId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <TbLetterCase className="text-lg" />
        <span className="hidden sm:block text-sm font-medium">
          {selectedFont.name}
        </span>
        <TbChevronDown
          className={`text-sm transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-2 max-h-80 overflow-y-auto">
              {FONT_OPTIONS.map((font) => (
                <motion.button
                  key={font.id}
                  onClick={() => handleFontSelect(font.id)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between
                    ${
                      currentFont === font.id
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl font-bold ${font.className}`}
                      style={{ fontFamily: font.family }}
                    >
                      {font.display}
                    </span>
                    <div>
                      <div
                        className={`font-medium ${font.className}`}
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {font.description}
                      </div>
                    </div>
                  </div>
                  {currentFont === font.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FontSelector;
