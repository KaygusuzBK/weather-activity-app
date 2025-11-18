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
    <div ref={containerRef} className="w-full">
      <MagicCard 
        gradientSize={300}
        gradientColor="#6366f1"
        gradientOpacity={0.3}
      >
        <div className="bg-gradient-to-br from-indigo-500/90 to-purple-600/90 dark:from-indigo-600/90 dark:to-purple-700/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 p-4 sm:p-5 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <HiLocationMarker className="w-4 h-4 text-white/90" />
              <div>
                <h2 className="text-lg font-black text-white drop-shadow-lg">
                  {cityName}
                </h2>
                {countryName && (
                  <p className="text-[10px] text-white/80">{countryName}</p>
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
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/20"
                >
                  {isFavorited ? (
                    <IoHeart className="w-4 h-4 text-pink-300" />
                  ) : (
                    <IoHeartOutline className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Main Temperature Display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
              alt={weatherDescription}
              className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl"
            />
            <div>
              <div className="text-5xl sm:text-6xl font-black text-white drop-shadow-2xl">
                {temperature}°
              </div>
              <div className="text-base font-bold capitalize text-white/90 mt-1">
                {weatherDescription}
              </div>
              <div className="text-xs text-white/70 mt-0.5">
                Hissedilen: {feelsLike}°
              </div>
            </div>
          </div>

          {/* Hourly Forecast */}
          <div className="mb-4">
            <HourlyForecast city={city} location={location} />
          </div>

          {/* Weather Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.4}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <WiHumidity className="w-5 h-5 text-blue-200" />
                  <span className="text-[10px] font-medium text-white/80">Nem</span>
                </div>
                <div className="text-xl font-black text-white">{humidity}%</div>
              </div>
            </MagicCard>

            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.4}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <FiWind className="w-4 h-4 text-cyan-200" />
                  <span className="text-[10px] font-medium text-white/80">Rüzgar</span>
                </div>
                <div className="text-xl font-black text-white">{windSpeed}</div>
                <div className="text-[9px] text-white/70">km/h</div>
              </div>
            </MagicCard>

            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.4}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <FiEye className="w-4 h-4 text-purple-200" />
                  <span className="text-[10px] font-medium text-white/80">Görüş</span>
                </div>
                <div className="text-xl font-black text-white">{visibility}</div>
                <div className="text-[9px] text-white/70">km</div>
              </div>
            </MagicCard>

            <MagicCard gradientSize={150} gradientColor="#8b5cf6" gradientOpacity={0.4}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <WiBarometer className="w-5 h-5 text-amber-200" />
                  <span className="text-[10px] font-medium text-white/80">Basınç</span>
                </div>
                <div className="text-xl font-black text-white">{pressure}</div>
                <div className="text-[9px] text-white/70">hPa</div>
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
