'use client';

import { useEffect, useState } from 'react';
import type { DailyForecast } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import { useLocation } from '../hooks/useLocation';

export default function WeatherForecast() {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location && !locationLoading) {
      fetchForecast();
    }
  }, [location, locationLoading]);

  const fetchForecast = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const data = await weatherAPI.getForecast(location.latitude, location.longitude);
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hava durumu tahmini alınamadı');
    } finally {
      setLoading(false);
    }
  };

  if (locationLoading || loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>
            <span className="ml-3 text-zinc-600 dark:text-zinc-400">Tahmin yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (locationError || error) {
    return null; // Error zaten CurrentWeather'da gösteriliyor
  }

  if (forecast.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
          7 Günlük Tahmin
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div
              key={day.date}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-700 dark:to-zinc-600 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  {index === 0 ? 'Yarın' : day.day}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                  {new Date(day.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
                
                <div className="mb-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                    alt={day.weather.description}
                    className="w-16 h-16 mx-auto"
                  />
                </div>
                
                <div className="mb-2">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {day.temp_max}°
                  </span>
                  <span className="text-lg text-zinc-600 dark:text-zinc-400 ml-1">
                    / {day.temp_min}°
                  </span>
                </div>
                
                <div className="text-xs text-zinc-600 dark:text-zinc-400 capitalize mb-2">
                  {day.weather.description}
                </div>
                
                <div className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Nem:</span>
                    <span className="font-medium">{day.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rüzgar:</span>
                    <span className="font-medium">{Math.round(day.wind_speed * 3.6)} km/h</span>
                  </div>
                  {day.pop > 0 && (
                    <div className="flex justify-between">
                      <span>Yağış:</span>
                      <span className="font-medium">{Math.round(day.pop * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

