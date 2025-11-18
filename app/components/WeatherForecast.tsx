'use client';

import type { City } from '../data/popular-cities';
import { useForecast } from '../hooks/useWeather';
import { useUnit } from '../contexts/UnitContext';
import WeatherForecastSkeleton from './WeatherForecastSkeleton';
import ErrorFallback from './ErrorFallback';
import { normalizeError } from '../lib/error-handler';
import { MagicCard } from './ui/magic-card';
import { WiHumidity, WiStrongWind, WiRaindrop } from 'react-icons/wi';
import AnimatedIcon from './ui/animated-icon';

interface WeatherForecastProps {
  city: City | null;
  location?: { latitude: number; longitude: number } | null;
}

export default function WeatherForecast({ city, location }: WeatherForecastProps) {
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
  
  const { forecast, loading, error, mutate } = useForecast({
    lat,
    lon,
    enabled: !!(lat && lon),
  });

  const handleRetry = () => {
    mutate();
  };

  if (loading && !forecast) {
    return <WeatherForecastSkeleton />;
  }

  if (error) {
    return (
      <ErrorFallback
        error={normalizeError(error)}
        onRetry={handleRetry}
        title="Tahmin Yüklenemedi"
      />
    );
  }

  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
    return null;
  }

  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  return (
    <div className="w-full">
      <MagicCard 
        gradientSize={300}
        gradientColor="#ec4899"
        gradientOpacity={0.3}
      >
        <div className="bg-gradient-to-br from-pink-500/90 to-rose-600/90 dark:from-pink-600/90 dark:to-rose-700/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 p-4 sm:p-5 shadow-2xl">
          {/* Header */}
          <h2 className="text-xl font-black text-white mb-4 text-center drop-shadow-lg">
            5 Günlük Tahmin
          </h2>
          
          {/* Forecast Cards */}
          <div className="space-y-2">
            {forecast.map((day, index) => {
              const date = new Date(day.date);
              const dayName = index === 0 ? 'Yarın' : dayNames[date.getDay()];
              const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
              
              return (
                <MagicCard 
                  key={day.date}
                  gradientSize={200}
                  gradientColor="#f472b6"
                  gradientOpacity={0.4}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    {/* Mobile Layout */}
                    <div className="flex flex-col gap-3 sm:hidden">
                      {/* Top Row - Day & Temp */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-bold text-white">{dayName}</div>
                            <div className="text-[10px] text-white/70">{dateStr}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                            alt={day.weather.description}
                            className="w-12 h-12"
                          />
                          <div className="text-right">
                            <div className="text-xl font-black text-white">
                              {formatTemp(day.temp_max)}
                            </div>
                            <div className="text-xs text-white/70">
                              {formatTemp(day.temp_min)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - Stats */}
                      <div className="flex items-center justify-between text-[10px] text-white/80">
                        <div className="capitalize truncate max-w-[100px]">{day.weather.description}</div>
                        <div className="flex items-center gap-2">
                          {day.pop > 0 && (
                            <div className="flex items-center gap-1">
                              <WiRaindrop className="w-4 h-4" />
                              <span>{Math.round(day.pop * 100)}%</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <WiHumidity className="w-4 h-4" />
                            <span>{day.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <WiStrongWind className="w-4 h-4" />
                            <span>{Math.round(day.wind_speed * 3.6)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      {/* Left - Day & Weather */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="min-w-[80px]">
                          <div className="text-sm font-bold text-white">{dayName}</div>
                          <div className="text-[10px] text-white/70">{dateStr}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                            alt={day.weather.description}
                            className="w-12 h-12"
                          />
                          <div className="max-w-[120px]">
                            <div className="text-lg font-black text-white mb-0.5">
                              {formatTemp(day.temp_max)} / {formatTemp(day.temp_min)}
                            </div>
                            <div className="text-[10px] capitalize text-white/80 truncate">
                              {day.weather.description}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Stats */}
                      <div className="flex items-center gap-3 text-xs">
                        {day.pop > 0 && (
                          <div className="text-center min-w-[45px]">
                            <div className="flex items-center justify-center mb-0.5">
                              <WiRaindrop className="w-4 h-4 text-blue-200" />
                            </div>
                            <div className="font-bold text-white text-[10px]">{Math.round(day.pop * 100)}%</div>
                          </div>
                        )}
                        
                        <div className="text-center min-w-[45px]">
                          <div className="flex items-center justify-center mb-0.5">
                            <WiHumidity className="w-4 h-4 text-cyan-200" />
                          </div>
                          <div className="font-bold text-white text-[10px]">{day.humidity}%</div>
                        </div>
                        
                        <div className="text-center min-w-[50px]">
                          <div className="flex items-center justify-center mb-0.5">
                            <WiStrongWind className="w-4 h-4 text-purple-200" />
                          </div>
                          <div className="font-bold text-white text-[10px]">{Math.round(day.wind_speed * 3.6)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </MagicCard>
              );
            })}
          </div>
        </div>
      </MagicCard>
    </div>
  );
}
