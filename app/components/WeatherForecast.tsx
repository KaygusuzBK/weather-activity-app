'use client';

import type { City } from '../data/popular-cities';
import { useForecast } from '../hooks/useWeather';
import { useUnit } from '../contexts/UnitContext';
import WeatherForecastSkeleton from './WeatherForecastSkeleton';
import ErrorFallback from './ErrorFallback';
import { normalizeError } from '../lib/error-handler';

interface WeatherForecastProps {
  city: City | null;
  location?: { latitude: number; longitude: number } | null;
}

export default function WeatherForecast({ city, location }: WeatherForecastProps) {
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
    <div className="hidden lg:block rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #CC9C75, #D5D8B5)' }}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: '#809A6F' }}></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: '#A25B5B' }}></div>
      </div>

      <div className="relative z-10 flex flex-col">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 drop-shadow-lg shrink-0 text-center" style={{ color: '#2C2C2C' }}>
          5 Günlük Tahmin
        </h2>
        
        <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-3">
          {forecast.map((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 ? 'Yarın' : dayNames[date.getDay()];
            
            return (
              <div
                key={day.date}
                className="rounded-xl sm:rounded-2xl p-3 sm:p-3 border backdrop-blur-md transition-all duration-300 shrink-0"
                style={{ 
                  backgroundColor: 'rgba(44, 44, 44, 0.15)', 
                  borderColor: 'rgba(44, 44, 44, 0.2)' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(44, 44, 44, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(44, 44, 44, 0.15)';
                }}
              >
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 sm:gap-3 md:gap-4">
                    <div className="text-center min-w-[70px] sm:min-w-[70px] md:min-w-[80px]">
                      <div className="text-sm sm:text-sm font-bold mb-0.5" style={{ color: '#2C2C2C', opacity: 0.9 }}>{dayName}</div>
                      <div className="text-xs" style={{ color: '#2C2C2C', opacity: 0.7 }}>
                        {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                      alt={day.weather.description}
                      className="w-14 h-14 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg shrink-0"
                    />
                    
                    <div className="text-center">
                      <div className="text-lg sm:text-lg md:text-xl lg:text-2xl font-black mb-0.5" style={{ color: '#2C2C2C' }}>
                        {formatTemp(day.temp_max)} / {formatTemp(day.temp_min)}
                      </div>
                      <div className="text-xs sm:text-sm capitalize truncate max-w-[120px] sm:max-w-none" style={{ color: '#2C2C2C', opacity: 0.8 }}>
                        {day.weather.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 sm:gap-3 md:gap-4 text-sm sm:text-sm" style={{ color: '#2C2C2C', opacity: 0.8 }}>
                    {day.pop > 0 && (
                      <div className="text-center min-w-[50px] sm:min-w-[45px] md:min-w-[50px]">
                        <div className="text-xs mb-0.5" style={{ color: '#2C2C2C', opacity: 0.6 }}>Yağış</div>
                        <div className="font-bold text-sm">{Math.round(day.pop * 100)}%</div>
                      </div>
                    )}
                    <div className="text-center min-w-[50px] sm:min-w-[45px] md:min-w-[50px]">
                      <div className="text-xs mb-0.5" style={{ color: '#2C2C2C', opacity: 0.6 }}>Nem</div>
                      <div className="font-bold text-sm">{day.humidity}%</div>
                    </div>
                    <div className="text-center min-w-[55px] sm:min-w-[50px] md:min-w-[55px]">
                      <div className="text-xs mb-0.5" style={{ color: '#2C2C2C', opacity: 0.6 }}>Rüzgar</div>
                      <div className="font-bold text-sm">{Math.round(day.wind_speed * 3.6)} km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
