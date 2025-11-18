'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import AnimatedIcon from './ui/animated-icon';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'dark' : 'light');
        }
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignore
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const handleThemeChange = () => {
      try {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (e) {
        // Ignore
      }
    };
    
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', newTheme);
        window.dispatchEvent(new Event('themeChanged'));
      } catch (e) {
        // Ignore
      }
    }
  };

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
