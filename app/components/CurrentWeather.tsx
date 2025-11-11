'use client';

import { useEffect, useState } from 'react';
import type { CurrentWeather } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import { useLocation } from '../hooks/useLocation';

export default function CurrentWeather() {
  const { location, loading: locationLoading, error: locationError, retry } = useLocation();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location && !locationLoading) {
      fetchWeather();
    }
  }, [location, locationLoading]);

  const fetchWeather = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const data = await weatherAPI.getCurrentWeather(location.latitude, location.longitude);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hava durumu alınamadı');
    } finally {
      setLoading(false);
    }
  };

  if (locationLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 mx-auto"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Hava durumu yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (locationError || error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
            Hata Oluştu
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {locationError || error}
          </p>
          <button
            onClick={retry}
            className="px-6 py-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const weatherIcon = weather.weather[0]?.icon || '01d';
  const weatherDescription = weather.weather[0]?.description || '';
  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windSpeed = Math.round(weather.wind.speed * 3.6); // m/s to km/h
  const pressure = weather.main.pressure;
  const visibility = (weather.visibility / 1000).toFixed(1); // meters to km

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-3xl shadow-xl p-8 text-white">
        {/* Location */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{weather.name}</h1>
          <p className="text-blue-100 text-sm">
            {location?.city && location.city !== weather.name ? `${location.city}, ` : ''}
            {weather.sys.country}
          </p>
        </div>

        {/* Main Weather Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="text-8xl">
              <img
                src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                alt={weatherDescription}
                className="w-32 h-32"
              />
            </div>
            <div>
              <div className="text-7xl font-bold mb-2">{temperature}°</div>
              <div className="text-xl text-blue-100 capitalize">{weatherDescription}</div>
              <div className="text-sm text-blue-200 mt-1">
                Hissedilen: {feelsLike}°
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Nem</div>
              <div className="text-2xl font-semibold">{humidity}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Rüzgar</div>
              <div className="text-2xl font-semibold">{windSpeed} km/h</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Basınç</div>
              <div className="text-2xl font-semibold">{pressure} hPa</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Görüş</div>
              <div className="text-2xl font-semibold">{visibility} km</div>
            </div>
          </div>
        </div>

        {/* Min/Max Temp */}
        <div className="flex items-center justify-center gap-4 text-blue-100">
          <span>Min: {Math.round(weather.main.temp_min)}°</span>
          <span>•</span>
          <span>Max: {Math.round(weather.main.temp_max)}°</span>
        </div>
      </div>
    </div>
  );
}

