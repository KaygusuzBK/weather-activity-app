'use client';

import { useEffect, useRef } from 'react';
import type { City } from '../data/popular-cities';
import { FiDroplet, FiWind, FiActivity, FiEye } from 'react-icons/fi';
import { HiLocationMarker } from 'react-icons/hi';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { FiSun, FiSunrise, FiSunset } from 'react-icons/fi';
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

interface CurrentWeatherProps {
  city: City | null;
  location: { latitude: number; longitude: number; city?: string; country?: string } | null;
}

export default function CurrentWeather({ city, location }: CurrentWeatherProps) {
  const lat = city?.lat || location?.latitude || null;
  const lon = city?.lon || location?.longitude || null;
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  const humidity = weather.main.humidity;
  const windSpeed = Math.round(weather.wind.speed * 3.6);
  const pressure = weather.main.pressure;
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A';
  const cityName = city?.name || weather.name || location?.city || 'Konumunuz';
  const countryName = city?.country || weather.sys.country || location?.country || '';
  
  // Güneş doğuş/batış saatleri
  const sunrise = new Date(weather.sys.sunrise * 1000);
  const sunset = new Date(weather.sys.sunset * 1000);
  const sunriseTime = sunrise.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = sunset.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  // Basit UV index hesaplama (güneş yüksekliğine göre)
  const now = new Date();
  const hour = now.getHours();
  const uvIndex = hour >= 10 && hour <= 16 ? Math.min(11, Math.round(5 + (weather.main.temp / 10))) : Math.max(0, Math.round(3 - Math.abs(hour - 13) / 2));

  return (
    <div ref={containerRef} className="hidden lg:block rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #809A6F, #A25B5B)' }}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: '#CC9C75' }}></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: '#D5D8B5' }}></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Location */}
        <div className="mb-4 sm:mb-4 flex items-center justify-center gap-2 relative shrink-0">
          <div className="flex items-center gap-2 sm:gap-2">
            <AnimatedIcon hover pulse>
              <HiLocationMarker className="w-5 h-5 sm:w-5 sm:h-5 shrink-0" style={{ color: '#D5D8B5' }} />
            </AnimatedIcon>
            <div className="text-center">
              <h2 className="text-xl sm:text-xl md:text-2xl font-black drop-shadow-lg" style={{ color: '#D5D8B5' }}>
                {cityName}
              </h2>
              {countryName && (
                <p className="text-xs sm:text-sm" style={{ color: '#D5D8B5', opacity: 0.8 }}>{countryName}</p>
              )}
            </div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
                className="p-2 sm:p-2 rounded-full hover:bg-opacity-20 transition-all shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ backgroundColor: 'rgba(213, 216, 181, 0.1)' }}
              >
                <AnimatedIcon hover scale={isFavorite(city)}>
                  {isFavorite(city) ? (
                    <IoHeart className="w-5 h-5 sm:w-5 sm:h-5" style={{ color: '#D5D8B5' }} />
                  ) : (
                    <IoHeartOutline className="w-5 h-5 sm:w-5 sm:h-5" style={{ color: '#D5D8B5' }} />
                  )}
                </AnimatedIcon>
              </button>
            )}
          </div>
        </div>

        {/* Main Temperature */}
        <div className="shrink-0 flex flex-col justify-center items-center mb-5 sm:mb-5">
          <div className="flex items-center justify-center gap-3 sm:gap-3 md:gap-4 mb-3 sm:mb-3">
            <img
              src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
              alt={weatherDescription}
              className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-2xl shrink-0"
            />
            <div>
              <div className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-black drop-shadow-2xl mb-1" style={{ color: '#D5D8B5' }}>
                {temperature}°
              </div>
              <div className="text-base sm:text-base md:text-lg font-bold capitalize" style={{ color: '#D5D8B5', opacity: 0.9 }}>
                {weatherDescription}
              </div>
              <div className="text-sm sm:text-sm mt-0.5" style={{ color: '#D5D8B5', opacity: 0.7 }}>
                Hissedilen: {feelsLike}°
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="mb-4 sm:mb-4 shrink-0">
          <HourlyForecast city={city} location={location} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-3 md:gap-3 justify-items-center shrink-0 mb-4 sm:mb-4">
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-3 border backdrop-blur-md w-full" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center justify-center gap-2 sm:gap-2 mb-2">
              <AnimatedIcon hover pulse>
                <FiDroplet className="w-5 h-5 sm:w-5 sm:h-5 shrink-0" style={{ color: '#809A6F' }} />
              </AnimatedIcon>
              <span className="text-sm sm:text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>Nem</span>
            </div>
            <div className="text-2xl sm:text-2xl md:text-3xl font-black text-center" style={{ color: '#D5D8B5' }}>{humidity}%</div>
          </div>

          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-3 border backdrop-blur-md w-full" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center justify-center gap-2 sm:gap-2 mb-2">
              <AnimatedIcon hover rotate>
                <FiWind className="w-5 h-5 sm:w-5 sm:h-5 shrink-0" style={{ color: '#809A6F' }} />
              </AnimatedIcon>
              <span className="text-sm sm:text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>Rüzgar</span>
            </div>
            <div className="text-2xl sm:text-2xl md:text-3xl font-black text-center" style={{ color: '#D5D8B5' }}>{windSpeed} km/h</div>
          </div>

          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-3 border backdrop-blur-md w-full" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center justify-center gap-2 sm:gap-2 mb-2">
              <AnimatedIcon hover>
                <FiSun className="w-5 h-5 sm:w-5 sm:h-5 shrink-0" style={{ color: '#CC9C75' }} />
              </AnimatedIcon>
              <span className="text-sm sm:text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>UV Index</span>
            </div>
            <div className="text-2xl sm:text-2xl md:text-3xl font-black text-center" style={{ color: '#D5D8B5' }}>{uvIndex}</div>
          </div>

          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-3 border backdrop-blur-md w-full" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center justify-center gap-2 sm:gap-2 mb-2">
              <AnimatedIcon hover>
                <FiSunrise className="w-5 h-5 sm:w-5 sm:h-5 shrink-0" style={{ color: '#CC9C75' }} />
              </AnimatedIcon>
              <span className="text-sm sm:text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>Güneş</span>
            </div>
            <div className="text-xs sm:text-sm font-black text-center" style={{ color: '#D5D8B5' }}>
              <div>{sunriseTime}</div>
              <div className="opacity-0.7">{sunsetTime}</div>
            </div>
          </div>
        </div>

        {/* Activity Recommendations */}
        <ActivityRecommendations weather={weather} />
      </div>
    </div>
  );
}
