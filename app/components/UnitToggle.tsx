'use client';

import { useState, useEffect } from 'react';
import AnimatedIcon from './ui/animated-icon';

export default function UnitToggle() {
  const [mounted, setMounted] = useState(false);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const savedUnit = localStorage.getItem('temperatureUnit') as 'celsius' | 'fahrenheit' | null;
        if (savedUnit) {
          setUnit(savedUnit);
        }
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const handleUnitChange = () => {
      try {
        const savedUnit = localStorage.getItem('temperatureUnit') as 'celsius' | 'fahrenheit' | null;
        if (savedUnit) {
          setUnit(savedUnit);
        }
      } catch (e) {
        // Ignore
      }
    };
    
    window.addEventListener('storage', handleUnitChange);
    window.addEventListener('unitChanged', handleUnitChange);
    
    return () => {
      window.removeEventListener('storage', handleUnitChange);
      window.removeEventListener('unitChanged', handleUnitChange);
    };
  }, [mounted]);

  const toggleUnit = () => {
    if (typeof window === 'undefined') return;
    
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    
    try {
      localStorage.setItem('temperatureUnit', newUnit);
      window.dispatchEvent(new Event('unitChanged'));
    } catch (e) {
      // Ignore
    }
  };

  if (!mounted) {
    return (
      <div className="px-4 py-2 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
        <span className="font-bold text-indigo-600 dark:text-indigo-400">°C</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleUnit}
      className="px-4 py-2 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      aria-label={`Sıcaklık birimi: ${unit === 'celsius' ? 'Fahrenheit\'a geç' : 'Celsius\'a geç'}`}
    >
      <AnimatedIcon hover>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {unit === 'celsius' ? '°C' : '°F'}
        </span>
      </AnimatedIcon>
    </button>
  );
}
