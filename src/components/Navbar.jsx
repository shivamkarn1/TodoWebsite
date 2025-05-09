import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { TbSunFilled, TbMoonFilled, TbLeaf, TbFlame, TbSnowflake, TbCandy, TbRainbow } from 'react-icons/tb';
import { WiRaindrops } from 'react-icons/wi';

const ThemeOptions = [
  { id: 'light', name: 'Light', icon: <TbSunFilled />, colors: { primary: 'from-blue-500 to-teal-500', text: 'text-gray-800' } },
  { id: 'dark', name: 'Dark', icon: <TbMoonFilled />, colors: { primary: 'from-gray-800 to-gray-900', text: 'text-white' } },
  { id: 'red-white', name: 'Red & White', icon: <TbFlame />, colors: { primary: 'from-red-600 to-red-500', text: 'text-white' } },
  { id: 'nature', name: 'Nature', icon: <TbLeaf />, colors: { primary: 'from-green-600 to-emerald-500', text: 'text-white' } },
  { id: 'ocean', name: 'Ocean', icon: <WiRaindrops />, colors: { primary: 'from-blue-700 to-cyan-500', text: 'text-white' } },
  { id: 'winter', name: 'Winter', icon: <TbSnowflake />, colors: { primary: 'from-indigo-500 to-blue-300', text: 'text-white' } },
  { id: 'candy', name: 'Candy', icon: <TbCandy />, colors: { primary: 'from-pink-500 to-purple-400', text: 'text-white' } },
  { id: 'rainbow', name: 'Rainbow', icon: <TbRainbow />, colors: { primary: 'from-purple-600 via-pink-500 to-orange-400', text: 'text-white' } },
];

const Navbar = ({ currentTheme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && !event.target.closest('.theme-dropdown-container')) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedTheme = ThemeOptions.find(t => t.id === currentTheme) || ThemeOptions[0];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md' 
          : `bg-gradient-to-r ${selectedTheme.colors.primary}`
        }`}
    >
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FaCheckCircle className={`text-2xl ${scrolled ? 'text-blue-600' : 'text-white'}`} />
            <h1 className={`text-2xl font-bold ${scrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`}>
              SHIVAM's ToDo
            </h1>
          </div>
          
          {/* Theme Selector - Simplified */}
          <div className="theme-dropdown-container relative">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {selectedTheme.icon}
              <span className="hidden sm:inline-block">{selectedTheme.name}</span>
            </button>
            
            {/* Absolutely positioned dropdown */}
            {isOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-[100]"
                style={{
                  maxHeight: '80vh',
                  overflowY: 'auto'
                }}
              >
                {ThemeOptions.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      currentTheme === theme.id ? 'bg-blue-50 dark:bg-gray-700 font-medium' : ''
                    }`}
                  >
                    <span className="text-lg">{theme.icon}</span>
                    <span>{theme.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;