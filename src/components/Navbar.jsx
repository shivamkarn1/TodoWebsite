import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbSunFilled,
  TbMoonFilled,
  TbLeaf,
  TbFlame,
  TbSnowflake,
  TbCandy,
  TbRainbow,
  TbSunset,
  TbBulb,
  TbCoffee,
} from "react-icons/tb";
import { WiRaindrops } from "react-icons/wi";
import FontSelector from "./ui/FontSelector";

const ThemeOptions = [
  {
    id: "light",
    name: "Light",
    icon: <TbSunFilled />,
    colors: {
      primary: "from-blue-500 to-teal-500",
      text: "text-gray-800",
      gradient: "#3b82f6, #14b8a6",
    },
  },
  {
    id: "dark",
    name: "Dark",
    icon: <TbMoonFilled />,
    colors: {
      primary: "from-gray-800 to-gray-900",
      text: "text-white",
      gradient: "#1f2937, #111827",
    },
  },
  {
    id: "nature",
    name: "Nature",
    icon: <TbLeaf />,
    colors: {
      primary: "from-green-600 to-emerald-500",
      text: "text-white",
      gradient: "#16a34a, #10b981",
    },
  },
  {
    id: "winter",
    name: "Winter",
    icon: <TbSnowflake />,
    colors: {
      primary: "from-indigo-500 to-blue-300",
      text: "text-white",
      gradient: "#6366f1, #93c5fd",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    icon: <TbSunset />,
    colors: {
      primary: "from-orange-500 to-red-400",
      text: "text-white",
      gradient: "#f97316, #f87171",
    },
  },
  {
    id: "neon",
    name: "Neon",
    icon: <TbBulb />,
    colors: {
      primary: "from-purple-600 to-pink-600",
      text: "text-white",
      gradient: "#9333ea, #db2777",
    },
  },
  {
    id: "coffee",
    name: "Coffee",
    icon: <TbCoffee />,
    colors: {
      primary: "from-amber-700 to-yellow-600",
      text: "text-white",
      gradient: "#b45309, #ca8a04",
    },
  },
];

const Navbar = ({ currentTheme, setTheme, currentFont, setFont }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedTheme =
    ThemeOptions.find((t) => t.id === currentTheme) || ThemeOptions[0];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-gradient-to-r ${
        selectedTheme.colors.primary
      } ${scrolled ? "shadow-lg backdrop-blur-sm" : "shadow-md"}`}
    >
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-2xl text-white" />
            <h1 className="text-2xl font-bold text-white">SHIVAM's ToDo</h1>
          </div>

          {/* Font and Theme Selectors */}
          <div className="flex items-center gap-3">
            {/* Font Selector */}
            <FontSelector currentFont={currentFont} setFont={setFont} />

            {/* Theme Selector - Enhanced */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="p-2.5 rounded-lg transition-all flex items-center gap-2 shadow-sm bg-white/20 text-white hover:bg-white/30"
              >
                <span className="w-5 h-5">{selectedTheme.icon}</span>
                <span className="hidden sm:inline font-medium">
                  {selectedTheme.name}
                </span>

                {/* Dropdown arrow */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Absolutely positioned dropdown with improved visibility */}
              {isOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg 
                shadow-xl py-1 z-[100] border-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">
                      Select Theme
                    </h3>
                  </div>

                  <div className="py-1 max-h-[60vh] overflow-y-auto">
                    {ThemeOptions.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setTheme(theme.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        ${
                          currentTheme === theme.id
                            ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
                            : ""
                        }
                      `}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                          style={{
                            background: `linear-gradient(to right, ${theme.colors.gradient})`,
                          }}
                        >
                          <span className="text-white">{theme.icon}</span>
                        </div>
                        <span
                          className={`font-medium 
                        ${
                          theme.id === "light"
                            ? "text-gray-800"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                        >
                          {theme.name}
                        </span>
                        {currentTheme === theme.id && (
                          <svg
                            className="h-5 w-5 ml-auto text-blue-600 dark:text-blue-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
