'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import AnimatedIcon from './ui/animated-icon';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  // ThemeContext'ten tema ve toggle fonksiyonunu al
  let theme: 'light' | 'dark' = 'light';
  let toggleTheme = () => {};
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (e) {
    // Context yoksa fallback
    console.warn('ThemeContext not available');
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2.5 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
        <FiMoon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      aria-label={theme === 'light' ? 'Dark mode aç' : 'Light mode aç'}
      title={theme === 'light' ? 'Koyu tema' : 'Açık tema'}
    >
      <AnimatedIcon hover rotate>
        {theme === 'light' ? (
          <FiMoon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        ) : (
          <FiSun className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        )}
      </AnimatedIcon>
    </button>
  );
}
