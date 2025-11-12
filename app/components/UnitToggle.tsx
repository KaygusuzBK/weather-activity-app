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
    
    // Context'ten unit'i dinle
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
      <div className="px-3 py-1.5 rounded-full font-medium text-sm shrink-0 min-w-[60px] flex items-center justify-center" style={{
        backgroundColor: 'rgba(128, 154, 111, 0.2)',
        color: '#2C2C2C',
        border: '1px solid rgba(128, 154, 111, 0.3)',
      }}>
        <span className="font-bold">°C</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleUnit}
      className="px-3 py-1.5 rounded-full font-medium transition-all text-sm shrink-0 min-w-[60px]"
      style={{
        backgroundColor: 'rgba(128, 154, 111, 0.2)',
        color: '#2C2C2C',
        border: '1px solid rgba(128, 154, 111, 0.3)',
      }}
      aria-label={`Sıcaklık birimi: ${unit === 'celsius' ? 'Fahrenheit\'a geç' : 'Celsius\'a geç'}`}
    >
      <AnimatedIcon hover>
        <span className="font-bold">{unit === 'celsius' ? '°C' : '°F'}</span>
      </AnimatedIcon>
    </button>
  );
}

