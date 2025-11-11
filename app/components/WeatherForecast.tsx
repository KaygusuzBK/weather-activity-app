'use client';

import { useEffect, useState } from 'react';
import type { DailyForecast } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import type { City } from '../data/popular-cities';
import { MagicCard } from './ui/magic-card';
import { BorderBeam } from './ui/border-beam';

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
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-zinc-700/50">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500"></div>
            <span className="ml-3 text-zinc-400">Tahmin yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || forecast.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
      <MagicCard className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-1">
        <BorderBeam size={250} duration={18} colorFrom="#a855f7" colorTo="#3b82f6" />
        <div className="relative z-10 bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border border-zinc-700/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white text-center">
            5 Günlük Tahmin
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {forecast.map((day, index) => (
              <MagicCard
                key={day.date}
                className="relative overflow-hidden bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm p-4 sm:p-5 border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <BorderBeam size={100} duration={10} colorFrom="#3b82f6" colorTo="#8b5cf6" />
                <div className="relative z-10 text-center">
                  <div className="text-sm sm:text-base font-semibold text-zinc-300 mb-1 sm:mb-2">
                    {index === 0 ? 'Yarın' : day.day}
                  </div>
                  <div className="text-xs text-zinc-500 mb-2 sm:mb-3">
                    {new Date(day.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                  
                  <div className="mb-2 sm:mb-3 flex justify-center">
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                      alt={day.weather.description}
                      className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {day.temp_max}°
                    </span>
                    <span className="text-base sm:text-lg text-zinc-400 ml-1">
                      / {day.temp_min}°
                    </span>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-zinc-400 capitalize mb-3 sm:mb-4">
                    {day.weather.description}
                  </div>
                  
                  <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs">
                    <div className="flex justify-between items-center text-zinc-500">
                      <span>Nem:</span>
                      <span className="text-zinc-300 font-medium">{day.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500">
                      <span>Rüzgar:</span>
                      <span className="text-zinc-300 font-medium">{Math.round(day.wind_speed * 3.6)} km/h</span>
                    </div>
                    {day.pop > 0 && (
                      <div className="flex justify-between items-center text-zinc-500">
                        <span>Yağış:</span>
                        <span className="text-zinc-300 font-medium">{Math.round(day.pop * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </MagicCard>
            ))}
          </div>
        </div>
      </MagicCard>
    </div>
  );
}
