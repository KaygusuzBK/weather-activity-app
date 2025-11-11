'use client';

import { useEffect, useState } from 'react';
import type { CurrentWeather } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import type { City } from '../data/popular-cities';
import { Droplets, Wind, Gauge, Eye, MapPin, Heart } from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '../lib/storage';

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
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 mx-auto" style={{ borderColor: '#A25B5B', borderTopColor: '#809A6F' }}></div>
          <p style={{ color: '#2C2C2C' }}>Yükleniyor...</p>
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
    <div className="h-full rounded-3xl p-6 sm:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #809A6F, #A25B5B)' }}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: '#CC9C75' }}></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: '#D5D8B5' }}></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Location */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" style={{ color: '#D5D8B5' }} />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black drop-shadow-lg" style={{ color: '#D5D8B5' }}>
                {cityName}
              </h2>
              {countryName && (
                <p className="text-sm" style={{ color: '#D5D8B5', opacity: 0.8 }}>{countryName}</p>
              )}
            </div>
          </div>
          {city && (
            <button
              onClick={() => {
                if (isFavorite(city)) {
                  removeFavorite(city);
                } else {
                  addFavorite(city);
                }
                // Dispatch custom event for same-tab updates
                window.dispatchEvent(new Event('favoritesUpdated'));
              }}
              className="p-2 rounded-full hover:bg-opacity-20 transition-all"
              style={{ backgroundColor: 'rgba(213, 216, 181, 0.1)' }}
            >
              <Heart
                className="w-6 h-6 transition-all"
                style={{ color: '#D5D8B5' }}
                fill={isFavorite(city) ? '#D5D8B5' : 'none'}
              />
            </button>
          )}
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
              <div className="text-7xl sm:text-8xl md:text-9xl font-black drop-shadow-2xl mb-2" style={{ color: '#D5D8B5' }}>
                {temperature}°
              </div>
              <div className="text-xl sm:text-2xl font-bold capitalize" style={{ color: '#D5D8B5', opacity: 0.9 }}>
                {weatherDescription}
              </div>
              <div className="text-sm mt-1" style={{ color: '#D5D8B5', opacity: 0.7 }}>
                Hissedilen: {feelsLike}°
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-4 border backdrop-blur-md" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5" style={{ color: '#809A6F' }} />
              <span className="text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>Nem</span>
            </div>
            <div className="text-3xl font-black" style={{ color: '#D5D8B5' }}>{humidity}%</div>
          </div>

          <div className="rounded-2xl p-4 border backdrop-blur-md" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5" style={{ color: '#809A6F' }} />
              <span className="text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>Rüzgar</span>
            </div>
            <div className="text-3xl font-black" style={{ color: '#D5D8B5' }}>{windSpeed} km/h</div>
          </div>

          <div className="rounded-2xl p-4 border backdrop-blur-md" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5" style={{ color: '#A25B5B' }} />
              <span className="text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>Basınç</span>
            </div>
            <div className="text-3xl font-black" style={{ color: '#D5D8B5' }}>{pressure} hPa</div>
          </div>

          <div className="rounded-2xl p-4 border backdrop-blur-md" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5" style={{ color: '#CC9C75' }} />
              <span className="text-sm font-medium" style={{ color: '#D5D8B5', opacity: 0.8 }}>Görüş</span>
            </div>
            <div className="text-3xl font-black" style={{ color: '#D5D8B5' }}>
              {visibility} {visibility !== 'N/A' ? 'km' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
