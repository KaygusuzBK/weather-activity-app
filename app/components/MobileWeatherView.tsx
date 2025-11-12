'use client';

import { useRef } from 'react';
import type { City } from '../data/popular-cities';
import { useCurrentWeather, useForecast } from '../hooks/useWeather';
import { useUnit } from '../contexts/UnitContext';
import { HiLocationMarker } from 'react-icons/hi';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { FiSun, FiSunrise, FiSunset } from 'react-icons/fi';
import { addFavorite, removeFavorite, isFavorite } from '../lib/storage';
import AnimatedIcon from './ui/animated-icon';
import ActivityRecommendations from './ActivityRecommendations';
import HourlyForecast from './HourlyForecast';
import ShareButton from './ShareButton';
import WeatherAmbience from './WeatherAmbience';
import CurrentWeatherSkeleton from './CurrentWeatherSkeleton';
import WeatherForecastSkeleton from './WeatherForecastSkeleton';
import ErrorFallback from './ErrorFallback';
import { normalizeError } from '../lib/error-handler';

interface MobileWeatherViewProps {
  city: City | null;
  location: { latitude: number; longitude: number; city?: string; country?: string } | null;
}

export default function MobileWeatherView({ city, location }: MobileWeatherViewProps) {
  const lat = city?.lat || location?.latitude || null;
  const lon = city?.lon || location?.longitude || null;
  const containerRef = useRef<HTMLDivElement>(null);

  const { weather, loading: currentLoading, error: currentError, mutate: mutateCurrent } = useCurrentWeather({
    lat,
    lon,
    enabled: !!(lat && lon),
  });

  const { forecast, loading: forecastLoading, error: forecastError, mutate: mutateForecast } = useForecast({
    lat,
    lon,
    enabled: !!(lat && lon),
  });

  const loading = currentLoading || forecastLoading;
  const error = currentError || forecastError;

  if (loading && !weather) {
    return (
      <div className="lg:hidden">
        <CurrentWeatherSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:hidden">
        <ErrorFallback
          error={normalizeError(error)}
          onRetry={() => {
            mutateCurrent();
            mutateForecast();
          }}
          title="Hava Durumu Yüklenemedi"
        />
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const cityName = city?.name || weather.name || location?.city || 'Konumunuz';
  const countryName = city?.country || weather.sys.country || location?.country || '';
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  // Bugünü de dahil ederek 6 günlük liste oluştur
  const today = {
    date: new Date().toISOString().split('T')[0],
    temp_max: Math.round(weather.main.temp_max),
    temp_min: Math.round(weather.main.temp_min),
    weather: {
      icon: weather.weather[0]?.icon || '01d',
      description: weather.weather[0]?.description || '',
    },
  };

  const forecastArray = Array.isArray(forecast) ? forecast : [];
  const allDays = [today, ...forecastArray].slice(0, 6);
  
  // Unit context - optional for SSR
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
  
  // Güneş doğuş/batış saatleri
  const sunrise = new Date(weather.sys.sunrise * 1000);
  const sunset = new Date(weather.sys.sunset * 1000);
  const sunriseTime = sunrise.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = sunset.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  // Basit UV index hesaplama
  const now = new Date();
  const hour = now.getHours();
  const uvIndex = hour >= 10 && hour <= 16 ? Math.min(11, Math.round(5 + (weather.main.temp / 10))) : Math.max(0, Math.round(3 - Math.abs(hour - 13) / 2));

  return (
    <div ref={containerRef} className="lg:hidden w-full">
      {/* Location Header - Compact */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatedIcon hover pulse>
            <HiLocationMarker className="w-4 h-4 shrink-0" style={{ color: '#809A6F' }} />
          </AnimatedIcon>
          <div>
            <h2 className="text-base font-black" style={{ color: '#2C2C2C' }}>
              {cityName}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <WeatherAmbience weather={weather} />
          <ShareButton weather={weather} city={city} location={location} elementRef={containerRef} />
          {city && (
            <button
              onClick={() => {
                if (isFavorite(city)) {
                  removeFavorite(city);
                } else {
                  addFavorite(city);
                }
                window.dispatchEvent(new Event('favoritesUpdated'));
              }}
              className="p-1.5 rounded-full hover:bg-opacity-20 transition-all shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
              style={{ backgroundColor: 'rgba(128, 154, 111, 0.1)' }}
            >
              <AnimatedIcon hover scale={isFavorite(city)}>
                {isFavorite(city) ? (
                  <IoHeart className="w-4 h-4" style={{ color: '#809A6F' }} />
                ) : (
                  <IoHeartOutline className="w-4 h-4" style={{ color: '#809A6F' }} />
                )}
              </AnimatedIcon>
            </button>
          )}
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="mb-4">
        <HourlyForecast city={city} location={location} />
      </div>

      {/* 6 Days Horizontal Scroll - NO CARDS, just simple items */}
      <div className="mb-4 overflow-x-auto pb-3 scrollbar-hide -mx-3 px-3">
        <div className="flex gap-3 min-w-max">
          {allDays.map((day, index) => {
            const date = new Date(day.date);
            const isToday = index === 0;
            const dayName = isToday ? 'Bugün' : index === 1 ? 'Yarın' : dayNames[date.getDay()];
            
            return (
              <div
                key={day.date}
                className={`flex flex-col items-center justify-center gap-2 p-3 shrink-0 ${
                  isToday ? 'min-w-[95px]' : 'min-w-[85px]'
                }`}
                style={{
                  backgroundColor: isToday ? '#809A6F' : 'transparent',
                  borderRadius: '16px',
                }}
              >
                <div 
                  className={`font-bold ${isToday ? 'text-xs' : 'text-xs'}`}
                  style={{ color: isToday ? '#D5D8B5' : '#2C2C2C', opacity: isToday ? 1 : 0.8 }}
                >
                  {dayName}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather.icon}@${isToday ? '4x' : '2x'}.png`}
                  alt={day.weather.description}
                  className={isToday ? 'w-16 h-16' : 'w-12 h-12'}
                />
                <div className="text-center">
                  <div 
                    className={`font-black ${isToday ? 'text-xl' : 'text-lg'}`}
                    style={{ color: isToday ? '#D5D8B5' : '#2C2C2C' }}
                  >
                    {formatTemp(day.temp_max)}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: isToday ? '#D5D8B5' : '#2C2C2C', opacity: isToday ? 0.9 : 0.7 }}
                  >
                    {formatTemp(day.temp_min)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UV Index and Sun Info */}
      <div className="mb-4 flex gap-2">
        <div className="flex-1 rounded-xl p-3" style={{ backgroundColor: 'rgba(128, 154, 111, 0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <AnimatedIcon hover>
              <FiSun className="w-4 h-4" style={{ color: '#809A6F' }} />
            </AnimatedIcon>
            <span className="text-xs font-bold" style={{ color: '#2C2C2C' }}>UV Index</span>
          </div>
          <div className="text-xl font-black" style={{ color: '#2C2C2C' }}>{uvIndex}</div>
        </div>
        <div className="flex-1 rounded-xl p-3" style={{ backgroundColor: 'rgba(128, 154, 111, 0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <AnimatedIcon hover>
              <FiSunrise className="w-4 h-4" style={{ color: '#809A6F' }} />
            </AnimatedIcon>
            <span className="text-xs font-bold" style={{ color: '#2C2C2C' }}>Güneş</span>
          </div>
          <div className="text-xs font-black" style={{ color: '#2C2C2C' }}>
            <div>{sunriseTime}</div>
            <div className="opacity-70">{sunsetTime}</div>
          </div>
        </div>
      </div>

      {/* Activity Recommendations */}
      <ActivityRecommendations weather={weather} />
    </div>
  );
}

