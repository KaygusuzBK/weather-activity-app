'use client';

import { useEffect, useState } from 'react';
import type { CurrentWeather } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import type { City } from '../data/popular-cities';
import { MagicCard } from './ui/magic-card';
import { BorderBeam } from './ui/border-beam';
import { Particles } from './ui/particles';
import { AnimatedGradientText } from './ui/animated-gradient-text';
import { MapPin, Droplets, Wind, Gauge, Eye } from 'lucide-react';

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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-500 mx-auto"></div>
          <AnimatedGradientText className="mt-4">
            <span className="text-zinc-900 dark:text-zinc-50">Hava durumu yükleniyor...</span>
          </AnimatedGradientText>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
            Hata Oluştu
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
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
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'; // meters to km
  const cityName = city?.name || weather.name || location?.city || 'Konumunuz';
  const countryName = city?.country || weather.sys.country || location?.country || '';

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <MagicCard className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1">
        <BorderBeam size={300} duration={15} colorFrom="#3b82f6" colorTo="#ec4899" />
        <Particles
          className="absolute inset-0"
          quantity={50}
          ease={80}
          color="#ffffff"
          size={0.4}
        />
        <div className="relative z-10 bg-zinc-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Location Header */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <AnimatedGradientText>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white truncate">
                  {cityName}
                </h1>
              </AnimatedGradientText>
              {countryName && (
                <p className="text-zinc-400 text-xs sm:text-sm mt-1">{countryName}</p>
              )}
            </div>
          </div>

          {/* Main Weather Display */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            {/* Temperature Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
                  alt={weatherDescription}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 drop-shadow-2xl"
                />
                <div className="text-center md:text-left">
                  <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-1 sm:mb-2">
                    {temperature}°
                  </div>
                  <div className="text-lg sm:text-xl text-zinc-300 capitalize">
                    {weatherDescription}
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Hissedilen: {feelsLike}°
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <MagicCard className="bg-zinc-800/50 backdrop-blur-sm p-3 sm:p-4 border border-zinc-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-zinc-400">Nem</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{humidity}%</div>
              </MagicCard>

              <MagicCard className="bg-zinc-800/50 backdrop-blur-sm p-3 sm:p-4 border border-zinc-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-zinc-400">Rüzgar</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{windSpeed} km/h</div>
              </MagicCard>

              <MagicCard className="bg-zinc-800/50 backdrop-blur-sm p-3 sm:p-4 border border-zinc-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-zinc-400">Basınç</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{pressure} hPa</div>
              </MagicCard>

              <MagicCard className="bg-zinc-800/50 backdrop-blur-sm p-3 sm:p-4 border border-zinc-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-zinc-400">Görüş</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {visibility} {visibility !== 'N/A' ? 'km' : ''}
                </div>
              </MagicCard>
            </div>
          </div>
        </div>
      </MagicCard>
    </div>
  );
}
