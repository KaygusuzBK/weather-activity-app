'use client';

import type { City } from '../data/popular-cities';
import { useHourlyForecast } from '../hooks/useWeather';
import { useUnit } from '../contexts/UnitContext';
import AnimatedIcon from './ui/animated-icon';

interface HourlyForecastProps {
  city: City | null;
  location?: { latitude: number; longitude: number } | null;
}

export default function HourlyForecast({ city, location }: HourlyForecastProps) {
  const lat = city?.lat || location?.latitude || null;
  const lon = city?.lon || location?.longitude || null;
  
  // Unit context - optional for SSR
  let formatTemp = (c: number) => `${Math.round(c)}°C`;
  try {
    const unitContext = useUnit();
    formatTemp = unitContext.formatTemp;
  } catch (e) {
    // Context not available, use defaults
  }
  
  const { hourlyForecast, loading, error } = useHourlyForecast({
    lat,
    lon,
    enabled: !!(lat && lon),
  });

  if (loading) {
    return (
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl min-w-[70px] shrink-0 animate-pulse" style={{ backgroundColor: 'rgba(128, 154, 111, 0.1)' }}>
              <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-6 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !hourlyForecast || hourlyForecast.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">
        24 Saatlik Tahmin
      </h3>
      <div className="overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3">
        <div className="flex gap-3 min-w-max">
          {hourlyForecast.map((item, index) => {
            const date = new Date(item.dt * 1000);
            const hour = date.getHours();
            const timeLabel = index === 0 ? 'Şimdi' : `${hour}:00`;
            
            return (
              <div
                key={item.dt}
                className="flex flex-col items-center gap-2 p-3 rounded-xl min-w-[70px] shrink-0"
                style={{
                  backgroundColor: index === 0 ? 'rgba(128, 154, 111, 0.2)' : 'rgba(128, 154, 111, 0.1)',
                }}
              >
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 opacity-80">
                  {timeLabel}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0]?.icon}@2x.png`}
                  alt={item.weather[0]?.description}
                  className="w-10 h-10"
                />
                <div className="text-center">
                  <div className="text-base font-black text-gray-800 dark:text-gray-200">
                    {formatTemp(item.main.temp)}
                  </div>
                  {item.pop > 0 && (
                    <div className="text-xs text-gray-700 dark:text-gray-300 opacity-70">
                      {Math.round(item.pop * 100)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

