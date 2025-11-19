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
    <div className="w-full h-full">
      <MagicCard 
        gradientSize={400}
        gradientColor="#ec4899"
        gradientOpacity={0.4}
      >
        <div className="bg-gradient-to-br from-pink-500/95 via-rose-500/95 to-red-600/95 dark:from-pink-600/95 dark:via-rose-600/95 dark:to-red-700/95 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 p-5 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] h-full flex flex-col">
          {/* Header */}
          <div className="mb-5 text-center">
            <div className="inline-block">
              <h2 className="text-2xl font-black text-white drop-shadow-lg mb-1">
                5 Günlük Tahmin
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
            </div>
          </div>
          
          {/* Forecast Cards */}
          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-1">
            {forecast.map((day, index) => {
              const date = new Date(day.date);
              const dayName = index === 0 ? 'Yarın' : dayNames[date.getDay()];
              const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
              
              return (
                <MagicCard 
                  key={day.date}
                  gradientSize={250}
                  gradientColor="#f472b6"
                  gradientOpacity={0.5}
                >
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/30 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl">
                    {/* Mobile Layout */}
                    <div className="flex flex-col gap-3 sm:hidden">
                      {/* Top Row - Day & Temp */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                            <div className="text-xl">{index === 0 ? '🌅' : ['🌙','⭐','✨','💫','🌟'][index % 5]}</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{dayName}</div>
                            <div className="text-[10px] text-white/80 font-medium">{dateStr}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                            alt={day.weather.description}
                            className="w-14 h-14 drop-shadow-lg group-hover:scale-110 transition-transform"
                          />
                          <div className="text-right">
                            <div className="text-2xl font-black text-white drop-shadow-lg">
                              {formatTemp(day.temp_max)}
                            </div>
                            <div className="text-sm text-white/80 font-semibold">
                              {formatTemp(day.temp_min)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/20">
                        <div className="capitalize text-xs text-white/90 font-medium truncate max-w-[110px]">{day.weather.description}</div>
                        <div className="flex items-center gap-3 text-xs">
                          {day.pop > 0 && (
                            <div className="flex items-center gap-1 bg-blue-400/20 px-2 py-1 rounded-lg">
                              <WiRaindrop className="w-4 h-4 text-blue-200" />
                              <span className="font-semibold">{Math.round(day.pop * 100)}%</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 bg-cyan-400/20 px-2 py-1 rounded-lg">
                            <WiHumidity className="w-4 h-4 text-cyan-200" />
                            <span className="font-semibold">{day.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-1 bg-purple-400/20 px-2 py-1 rounded-lg">
                            <WiStrongWind className="w-4 h-4 text-purple-200" />
                            <span className="font-semibold">{Math.round(day.wind_speed * 3.6)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      {/* Left - Day & Weather */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                            <div className="text-2xl">{index === 0 ? '🌅' : ['🌙','⭐','✨','💫','🌟'][index % 5]}</div>
                          </div>
                          <div className="min-w-[90px]">
                            <div className="text-sm font-bold text-white">{dayName}</div>
                            <div className="text-[10px] text-white/80 font-medium">{dateStr}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                            alt={day.weather.description}
                            className="w-14 h-14 drop-shadow-xl group-hover:scale-110 transition-transform"
                          />
                          <div className="max-w-[130px]">
                            <div className="text-xl font-black text-white mb-0.5 drop-shadow-lg">
                              {formatTemp(day.temp_max)} / {formatTemp(day.temp_min)}
                            </div>
                            <div className="text-[11px] capitalize text-white/90 truncate font-medium">
                              {day.weather.description}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Stats */}
                      <div className="flex items-center gap-2 text-xs">
                        {day.pop > 0 && (
                          <div className="text-center min-w-[50px] bg-blue-400/25 backdrop-blur-sm px-2.5 py-2 rounded-xl group-hover:scale-110 transition-transform">
                            <div className="flex items-center justify-center mb-1">
                              <WiRaindrop className="w-5 h-5 text-blue-100" />
                            </div>
                            <div className="font-black text-white text-xs">{Math.round(day.pop * 100)}%</div>
                          </div>
                        )}
                        
                        <div className="text-center min-w-[50px] bg-cyan-400/25 backdrop-blur-sm px-2.5 py-2 rounded-xl group-hover:scale-110 transition-transform">
                          <div className="flex items-center justify-center mb-1">
                            <WiHumidity className="w-5 h-5 text-cyan-100" />
                          </div>
                          <div className="font-black text-white text-xs">{day.humidity}%</div>
                        </div>
                        
                        <div className="text-center min-w-[50px] bg-purple-400/25 backdrop-blur-sm px-2.5 py-2 rounded-xl group-hover:scale-110 transition-transform">
                          <div className="flex items-center justify-center mb-1">
                            <WiStrongWind className="w-5 h-5 text-purple-100" />
                          </div>
                          <div className="font-black text-white text-xs">{Math.round(day.wind_speed * 3.6)}</div>
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
