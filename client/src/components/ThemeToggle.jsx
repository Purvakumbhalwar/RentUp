import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full 
                 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                 transition-all duration-300 ease-in-out transform hover:scale-105
                 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <FaSun 
          className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 transform
                     ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`}
        />
        <FaMoon 
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 transform
                     ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
        />
      </div>
    </button>
  );
}
