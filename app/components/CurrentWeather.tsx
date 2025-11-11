'use client';

import { useEffect, useState } from 'react';
import type { CurrentWeather } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import type { City } from '../data/popular-cities';
import { Droplets, Wind, Gauge, Eye, MapPin } from 'lucide-react';

interface CurrentWeatherProps {
  city: City | null;
  location: { latitude: number; longitude: number; city?: string; country?: string } | null;
}

export default function CurrentWeather({ city, location }: CurrentWeatherProps) {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (city || location) {
      fetchWeather();
    }
  }, [city, location]);

  const fetchWeather = async () => {
    const lat = city?.lat || location?.latitude;
    const lon = city?.lon || location?.longitude;
    
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      const data = await weatherAPI.getCurrentWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hava durumu alınamadı');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-pink-300 border-t-purple-500 mx-auto"></div>
          <p className="text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const weatherIcon = weather.weather[0]?.icon || '01d';
  const weatherDescription = weather.weather[0]?.description || '';
  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windSpeed = Math.round(weather.wind.speed * 3.6);
  const pressure = weather.main.pressure;
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A';
  const cityName = city?.name || weather.name || location?.city || 'Konumunuz';
  const countryName = city?.country || weather.sys.country || location?.country || '';

  return (
    <div className="h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Location */}
        <div className="mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-white" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">
              {cityName}
            </h2>
            {countryName && (
              <p className="text-white/80 text-sm">{countryName}</p>
            )}
          </div>
        </div>

        {/* Main Temperature */}
        <div className="flex-1 flex flex-col justify-center items-center sm:items-start mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
              alt={weatherDescription}
              className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl"
            />
            <div>
              <div className="text-7xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-2xl mb-2">
                {temperature}°
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white/90 capitalize">
                {weatherDescription}
              </div>
              <div className="text-sm text-white/70 mt-1">
                Hissedilen: {feelsLike}°
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-cyan-300" />
              <span className="text-white/80 text-sm font-medium">Nem</span>
            </div>
            <div className="text-3xl font-black text-white">{humidity}%</div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-green-300" />
              <span className="text-white/80 text-sm font-medium">Rüzgar</span>
            </div>
            <div className="text-3xl font-black text-white">{windSpeed} km/h</div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5 text-purple-300" />
              <span className="text-white/80 text-sm font-medium">Basınç</span>
            </div>
            <div className="text-3xl font-black text-white">{pressure} hPa</div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-yellow-300" />
              <span className="text-white/80 text-sm font-medium">Görüş</span>
            </div>
            <div className="text-3xl font-black text-white">
              {visibility} {visibility !== 'N/A' ? 'km' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
