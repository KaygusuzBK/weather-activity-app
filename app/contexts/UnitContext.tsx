'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface UnitContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  convertTemp: (celsius: number) => number;
  formatTemp: (celsius: number) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // LocalStorage'dan birim tercihini yükle
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit | null;
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    localStorage.setItem('temperatureUnit', unit);
    window.dispatchEvent(new Event('unitChanged'));
  }, [unit, mounted]);

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const convertTemp = (celsius: number): number => {
    if (unit === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  };

  const formatTemp = (celsius: number): string => {
    const temp = convertTemp(celsius);
    return `${temp}°${unit === 'celsius' ? 'C' : 'F'}`;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <UnitContext.Provider value={{ unit, toggleUnit, convertTemp, formatTemp }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
}

