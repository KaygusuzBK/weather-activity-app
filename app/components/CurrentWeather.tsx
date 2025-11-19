'use client';

import { useEffect, useRef, useState } from 'react';
import type { City } from '../data/popular-cities';
import { FiDroplet, FiWind, FiEye, FiSun, FiSunrise, FiSunset } from 'react-icons/fi';
import { HiLocationMarker } from 'react-icons/hi';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { WiHumidity, WiBarometer } from 'react-icons/wi';
import { addFavorite, removeFavorite, isFavorite } from '../lib/storage';
import AnimatedIcon from './ui/animated-icon';
import ActivityRecommendations from './ActivityRecommendations';
import HourlyForecast from './HourlyForecast';
import { useNotifications } from '../hooks/useNotifications';
import { useCurrentWeather } from '../hooks/useWeather';
import { useUnit } from '../contexts/UnitContext';
import CurrentWeatherSkeleton from './CurrentWeatherSkeleton';
import ErrorFallback from './ErrorFallback';
import ShareButton from './ShareButton';
import { normalizeError } from '../lib/error-handler';
import WeatherAmbience from './WeatherAmbience';
import { MagicCard } from './ui/magic-card';

interface CurrentWeatherProps {
  city: City | null;
  location: { latitude: number; longitude: number; city?: string; country?: string } | null;
}

export default function CurrentWeather({ city, location }: CurrentWeatherProps) {
  const lat = city?.lat || location?.latitude || null;
  const lon = city?.lon || location?.longitude || null;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { weather, loading, error, mutate } = useCurrentWeather({
    lat,
    lon,
    enabled: !!(lat && lon),
  });

  const previousWeatherRef = useRef(weather);
  const { checkWeatherAlerts } = useNotifications();

  useEffect(() => {
    if (weather && previousWeatherRef.current) {
      checkWeatherAlerts(weather, previousWeatherRef.current);
    }
    if (weather) {
      previousWeatherRef.current = weather;
    }
  }, [weather, checkWeatherAlerts]);

  useEffect(() => {
    if (city) {
      setIsFavorited(isFavorite(city));
    }
  }, [city]);

  useEffect(() => {
    const handleFavoritesUpdate = () => {
      if (city) {
        setIsFavorited(isFavorite(city));
      }
    };
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, [city]);

  const handleRetry = () => {
    mutate();
  };

  if (loading && !weather) {
    return <CurrentWeatherSkeleton />;
  }

  if (error) {
    return (
      <ErrorFallback
        error={normalizeError(error)}
        onRetry={handleRetry}
        title="Hava Durumu Yüklenemedi"
      />
    );
  }

  if (!weather) {
    return null;
  }

  // Unit context
  let formatTemp = (c: number) => `${Math.round(c)}°C`;
  let convertTemp = (c: number) => Math.round(c);
  try {
    const unitContext = useUnit();
    formatTemp = unitContext.formatTemp;
    convertTemp = unitContext.convertTemp;
  } catch (e) {
    // Context not available, use defaults
  }

  const weatherIcon = weather.weather[0]?.icon || '01d';
  const weatherDescription = weather.weather[0]?.description || '';
  const temperature = convertTemp(weather.main.temp);
  const feelsLike = convertTemp(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windSpeed = Math.round(weather.wind.speed * 3.6);
  const pressure = weather.main.pressure;
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A';
  const cityName = city?.name || weather.name || location?.city || 'Konumunuz';
  const countryName = city?.country || weather.sys.country || location?.country || '';
  
  const sunrise = new Date(weather.sys.sunrise * 1000);
  const sunset = new Date(weather.sys.sunset * 1000);
  const sunriseTime = sunrise.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = sunset.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const now = new Date();
  const hour = now.getHours();
  const uvIndex = hour >= 10 && hour <= 16 ? Math.min(11, Math.round(5 + (weather.main.temp / 10))) : Math.max(0, Math.round(3 - Math.abs(hour - 13) / 2));

  return (
    <div ref={containerRef} className="w-full h-full">
      <MagicCard 
        gradientSize={400}
        gradientColor="#6366f1"
        gradientOpacity={0.4}
      >
        <div className="bg-gradient-to-br from-indigo-500/95 via-purple-500/95 to-pink-600/95 dark:from-indigo-600/95 dark:via-purple-600/95 dark:to-pink-700/95 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 p-5 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <HiLocationMarker className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white drop-shadow-lg">
                  {cityName}
                </h2>
                {countryName && (
                  <p className="text-xs text-white/90 font-medium">{countryName}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <WeatherAmbience weather={weather} />
              <ShareButton weather={weather} city={city} location={location} elementRef={containerRef} />
              {city && (
                <button
                  onClick={() => {
                    if (isFavorited) {
                      removeFavorite(city);
                    } else {
                      addFavorite(city);
                    }
                    setIsFavorited(!isFavorited);
                    window.dispatchEvent(new Event('favoritesUpdated'));
                  }}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-all duration-300 border border-white/30 hover:scale-110 active:scale-95"
                >
                  {isFavorited ? (
                    <IoHeart className="w-5 h-5 text-pink-200 animate-pulse" />
                  ) : (
                    <IoHeartOutline className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Main Temperature Display */}
          <div className="flex items-center justify-center gap-6 mb-6 relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl -z-10"></div>
            <div className="relative">
              <img
                src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
                alt={weatherDescription}
                className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            <div>
              <div className="text-6xl sm:text-7xl font-black text-white drop-shadow-2xl mb-2 tracking-tight">
                {temperature}°
              </div>
              <div className="text-lg font-bold capitalize text-white/95 mb-1">
                {weatherDescription}
              </div>
              <div className="text-sm text-white/80 px-3 py-1 bg-white/15 rounded-full inline-block backdrop-blur-sm">
                Hissedilen: {feelsLike}°
              </div>
            </div>
          </div>

          {/* Hourly Forecast */}
          <div className="mb-4">
            <HourlyForecast city={city} location={location} />
          </div>

          {/* Weather Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.5}>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-blue-400/30 rounded-lg group-hover:scale-110 transition-transform">
                    <WiHumidity className="w-5 h-5 text-blue-100" />
                  </div>
                  <span className="text-xs font-semibold text-white/90">Nem</span>
                </div>
                <div className="text-2xl font-black text-white">{humidity}%</div>
              </div>
            </MagicCard>

            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.5}>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-cyan-400/30 rounded-lg group-hover:scale-110 transition-transform">
                    <FiWind className="w-4 h-4 text-cyan-100" />
                  </div>
                  <span className="text-xs font-semibold text-white/90">Rüzgar</span>
                </div>
                <div className="text-2xl font-black text-white">{windSpeed}</div>
                <div className="text-[10px] text-white/80 font-medium">km/h</div>
              </div>
            </MagicCard>

            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.5}>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-purple-400/30 rounded-lg group-hover:scale-110 transition-transform">
                    <FiEye className="w-4 h-4 text-purple-100" />
                  </div>
                  <span className="text-xs font-semibold text-white/90">Görüş</span>
                </div>
                <div className="text-2xl font-black text-white">{visibility}</div>
                <div className="text-[10px] text-white/80 font-medium">km</div>
              </div>
            </MagicCard>

            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.5}>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-amber-400/30 rounded-lg group-hover:scale-110 transition-transform">
                    <WiBarometer className="w-5 h-5 text-amber-100" />
                  </div>
                  <span className="text-xs font-semibold text-white/90">Basınç</span>
                </div>
                <div className="text-2xl font-black text-white">{pressure}</div>
                <div className="text-[10px] text-white/80 font-medium">hPa</div>
              </div>
            </MagicCard>
          </div>

          {/* Sun Info */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <MagicCard gradientSize={150} gradientColor="#f59e0b" gradientOpacity={0.4}>
              <div className="bg-gradient-to-br from-orange-400/20 to-yellow-400/20 backdrop-blur-md rounded-xl p-2.5 border border-white/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <FiSunrise className="w-4 h-4 text-orange-200" />
                  <span className="text-[10px] font-medium text-white/90">Doğuş</span>
                </div>
                <div className="text-base font-black text-white">{sunriseTime}</div>
              </div>
            </MagicCard>

            <MagicCard gradientSize={150} gradientColor="#f59e0b" gradientOpacity={0.4}>
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl p-2.5 border border-white/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <FiSunset className="w-4 h-4 text-orange-200" />
                  <span className="text-[10px] font-medium text-white/90">Batış</span>
                </div>
                <div className="text-base font-black text-white">{sunsetTime}</div>
              </div>
            </MagicCard>
          </div>

          {/* UV Index */}
          <MagicCard gradientSize={200} gradientColor="#fbbf24" gradientOpacity={0.4}>
            <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-md rounded-xl p-2.5 border border-white/20 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FiSun className="w-4 h-4 text-yellow-200" />
                  <span className="text-[10px] font-medium text-white/90">UV İndeksi</span>
                </div>
                <div className="text-2xl font-black text-white">{uvIndex}</div>
              </div>
              <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${(uvIndex / 11) * 100}%` }}
                />
              </div>
            </div>
          </MagicCard>

          {/* Activity Recommendations */}
          <ActivityRecommendations weather={weather} />
        </div>
      </MagicCard>
    </div>
  );
}
