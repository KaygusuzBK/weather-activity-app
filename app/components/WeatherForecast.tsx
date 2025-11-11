'use client';

import { useEffect, useState } from 'react';
import type { DailyForecast } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import type { City } from '../data/popular-cities';

interface WeatherForecastProps {
  city: City | null;
  location?: { latitude: number; longitude: number } | null;
}

export default function WeatherForecast({ city, location }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (city || location) {
      fetchForecast();
    }
  }, [city, location]);

  const fetchForecast = async () => {
    const lat = city?.lat || location?.latitude;
    const lon = city?.lon || location?.longitude;
    
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      const data = await weatherAPI.getForecast(lat, lon);
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hava durumu tahmini alınamadı');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-300 border-t-purple-500"></div>
      </div>
    );
  }

  if (error || forecast.length === 0) {
    return null;
  }

  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  return (
    <div className="h-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 drop-shadow-lg">
          5 Günlük Tahmin
        </h2>
        
        <div className="flex-1 flex flex-col gap-3 sm:gap-4">
          {forecast.map((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 ? 'Yarın' : dayNames[date.getDay()];
            
            return (
              <div
                key={day.date}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm font-bold text-white/90 mb-1">{dayName}</div>
                      <div className="text-xs text-white/70">
                        {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                      alt={day.weather.description}
                      className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                        {day.temp_max}° / {day.temp_min}°
                      </div>
                      <div className="text-sm text-white/80 capitalize">
                        {day.weather.description}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-4 text-white/80 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-white/60 mb-1">Nem</div>
                      <div className="font-bold">{day.humidity}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/60 mb-1">Rüzgar</div>
                      <div className="font-bold">{Math.round(day.wind_speed * 3.6)} km/h</div>
                    </div>
                    {day.pop > 0 && (
                      <div className="text-center">
                        <div className="text-xs text-white/60 mb-1">Yağış</div>
                        <div className="font-bold">{Math.round(day.pop * 100)}%</div>
                      </div>
                    )}
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
