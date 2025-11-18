'use client';

import type { City } from '../data/popular-cities';
import { useHourlyForecast } from '../hooks/useWeather';
import { useUnit } from '../contexts/UnitContext';
import { WiRaindrop } from 'react-icons/wi';

interface HourlyForecastProps {
  city: City | null;
  location?: { latitude: number; longitude: number } | null;
}

export default function HourlyForecast({ city, location }: HourlyForecastProps) {
  const lat = city?.lat || location?.latitude || null;
  const lon = city?.lon || location?.longitude || null;
  
  // Unit context
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
      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl min-w-[60px] shrink-0 animate-pulse bg-white/10">
              <div className="h-3 w-10 bg-white/20 rounded"></div>
              <div className="h-8 w-8 bg-white/20 rounded-full"></div>
              <div className="h-4 w-8 bg-white/20 rounded"></div>
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
      <h3 className="text-xs font-bold mb-2 text-white/90">
        24 Saatlik Tahmin
      </h3>
      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {hourlyForecast.map((item, index) => {
            const date = new Date(item.dt * 1000);
            const hour = date.getHours();
            const timeLabel = index === 0 ? 'Şimdi' : `${hour}:00`;
            
            return (
              <div
                key={item.dt}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl min-w-[60px] shrink-0 backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 ${
                  index === 0 ? 'bg-white/15' : 'bg-white/10'
                }`}
              >
                <div className="text-[10px] font-bold text-white/80">
                  {timeLabel}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0]?.icon}@2x.png`}
                  alt={item.weather[0]?.description}
                  className="w-8 h-8"
                />
                <div className="text-center">
                  <div className="text-sm font-black text-white">
                    {formatTemp(item.main.temp)}
                  </div>
                  {item.pop > 0 && (
                    <div className="flex items-center justify-center gap-0.5 text-[9px] text-blue-200 mt-0.5">
                      <WiRaindrop className="w-3 h-3" />
                      <span>{Math.round(item.pop * 100)}%</span>
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
