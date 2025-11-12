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
      <div className="p-2 rounded-full shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center" style={{ backgroundColor: 'rgba(128, 154, 111, 0.1)' }}>
        <FiMoon className="w-5 h-5" style={{ color: '#809A6F' }} />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-opacity-20 transition-all shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(128, 154, 111, 0.1)' }}
      aria-label={theme === 'light' ? 'Dark mode aç' : 'Light mode aç'}
    >
      <AnimatedIcon hover rotate>
        {theme === 'light' ? (
          <FiMoon className="w-5 h-5" style={{ color: '#809A6F' }} />
        ) : (
          <FiSun className="w-5 h-5" style={{ color: '#809A6F' }} />
        )}
      </AnimatedIcon>
    </button>
  );
}

