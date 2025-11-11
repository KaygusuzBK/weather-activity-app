'use client';

import { useEffect, useState } from 'react';
import { popularCities, type City } from '../data/popular-cities';
import { weatherAPI } from '../lib/weather-api';
import type { CurrentWeather } from '../types/weather';

interface CityWeather {
  city: City;
  weather: CurrentWeather | null;
  loading: boolean;
}

export default function CitiesMarquee() {
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);

  useEffect(() => {
    const fetchCitiesWeather = async () => {
      const weatherData = await Promise.all(
        popularCities.map(async (city) => {
          try {
            const weather = await weatherAPI.getCurrentWeather(city.lat, city.lon);
            return { city, weather, loading: false };
          } catch {
            return { city, weather: null, loading: false };
          }
        })
      );
      setCitiesWeather(weatherData);
    };

    fetchCitiesWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Duplicate cities for seamless scroll
  const duplicatedCities = [...citiesWeather, ...citiesWeather];

  return (
    <div className="w-full py-2 sm:py-2.5 overflow-hidden relative" style={{ background: 'linear-gradient(to right, #809A6F, #A25B5B, #CC9C75)' }}>
      <div className="flex animate-scroll gap-4 sm:gap-6 md:gap-8 whitespace-nowrap">
        {duplicatedCities.map((item, index) => (
          <div
            key={`${item.city.name}-${index}`}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full border min-w-fit transition-colors"
            style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', backdropFilter: 'blur(8px)', borderColor: 'rgba(213, 216, 181, 0.3)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(213, 216, 181, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(213, 216, 181, 0.2)'}
          >
            <span className="text-lg sm:text-xl">{item.city.emoji}</span>
            <div className="flex flex-col">
              <span className="font-bold text-xs" style={{ color: '#2C2C2C' }}>{item.city.name}</span>
              {item.weather ? (
                <span className="text-xs" style={{ color: '#2C2C2C', opacity: 0.8 }}>
                  {Math.round(item.weather.main.temp)}°C
                </span>
              ) : (
                <span className="text-xs" style={{ color: '#2C2C2C', opacity: 0.5 }}>...</span>
              )}
            </div>
            {item.weather && (
              <img
                src={`https://openweathermap.org/img/wn/${item.weather.weather[0]?.icon}.png`}
                alt={item.weather.weather[0]?.description}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

