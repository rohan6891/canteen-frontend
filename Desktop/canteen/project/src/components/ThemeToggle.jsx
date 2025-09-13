import React from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 group hover:scale-105"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f59332 0%, #e35d05 100%)'
      }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Track */}
      <div className="absolute inset-0 rounded-full shadow-inner">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
      </div>
      
      {/* Toggle Circle */}
      <div
        className={`relative w-5 h-5 rounded-full shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center ${
          isDarkMode ? 'translate-x-3' : '-translate-x-3'
        }`}
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
        }}
      >
        {/* Icon */}
        <div className={`transition-all duration-300 ${isDarkMode ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}>
          {/* Moon Icon */}
          <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className={`absolute transition-all duration-300 ${isDarkMode ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
          {/* Sun Icon */}
          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
        isDarkMode ? 'opacity-0' : 'opacity-100'
      } bg-gradient-to-r from-primary-400/20 to-primary-600/20 blur-sm group-hover:opacity-100`}></div>
    </button>
  )
}

export default ThemeToggle