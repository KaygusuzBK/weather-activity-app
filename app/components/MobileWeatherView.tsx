'use client';

import { useRef } from 'react';
import type { City } from '../data/popular-cities';
import { useCurrentWeather, useForecast } from '../hooks/useWeather';
import { HiLocationMarker } from 'react-icons/hi';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { addFavorite, removeFavorite, isFavorite } from '../lib/storage';
import AnimatedIcon from './ui/animated-icon';
import ActivityRecommendations from './ActivityRecommendations';
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

  const weatherIcon = weather.weather[0]?.icon || '01d';
  const weatherDescription = weather.weather[0]?.description || '';
  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);

  return (
    <div ref={containerRef} className="lg:hidden">
      {/* Location Header - Compact */}
      <div className="mb-3 flex items-center justify-between">
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

      {/* 6 Days Horizontal Scroll - Bigger and More Distinct */}
      <div className="mb-4 overflow-x-auto pb-3 scrollbar-hide -mx-3 px-3">
        <div className="flex gap-2.5 min-w-max">
          {allDays.map((day, index) => {
            const date = new Date(day.date);
            const isToday = index === 0;
            const dayName = isToday ? 'Bugün' : index === 1 ? 'Yarın' : dayNames[date.getDay()];
            
            return (
              <div
                key={day.date}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-3xl shrink-0 ${
                  isToday ? 'min-w-[110px]' : 'min-w-[100px]'
                }`}
                style={{
                  background: isToday 
                    ? 'linear-gradient(135deg, #809A6F 0%, #A25B5B 100%)'
                    : 'linear-gradient(135deg, rgba(128, 154, 111, 0.15) 0%, rgba(162, 91, 91, 0.15) 100%)',
                  border: isToday ? 'none' : '2px solid rgba(128, 154, 111, 0.3)',
                  boxShadow: isToday ? '0 4px 12px rgba(128, 154, 111, 0.3)' : 'none',
                }}
              >
                <div 
                  className={`font-bold ${isToday ? 'text-sm' : 'text-xs'}`}
                  style={{ color: isToday ? '#D5D8B5' : '#2C2C2C', opacity: isToday ? 1 : 0.8 }}
                >
                  {dayName}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather.icon}@${isToday ? '4x' : '2x'}.png`}
                  alt={day.weather.description}
                  className={isToday ? 'w-16 h-16' : 'w-14 h-14'}
                />
                <div className="text-center">
                  <div 
                    className={`font-black ${isToday ? 'text-2xl' : 'text-xl'}`}
                    style={{ color: isToday ? '#D5D8B5' : '#2C2C2C' }}
                  >
                    {day.temp_max}°
                  </div>
                  <div 
                    className={isToday ? 'text-sm' : 'text-xs'}
                    style={{ color: isToday ? '#D5D8B5' : '#2C2C2C', opacity: isToday ? 0.9 : 0.7 }}
                  >
                    {day.temp_min}°
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Recommendations */}
      <ActivityRecommendations weather={weather} />
    </div>
  );
}

