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
    <div className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 py-3 sm:py-4 overflow-hidden relative">
      <div className="flex animate-scroll gap-4 sm:gap-6 md:gap-8 whitespace-nowrap">
        {duplicatedCities.map((item, index) => (
          <div
            key={`${item.city.name}-${index}`}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 min-w-fit hover:bg-white/20 transition-colors"
          >
            <span className="text-xl sm:text-2xl">{item.city.emoji}</span>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs sm:text-sm">{item.city.name}</span>
              {item.weather ? (
                <span className="text-white/80 text-xs">
                  {Math.round(item.weather.main.temp)}°C
                </span>
              ) : (
                <span className="text-white/50 text-xs">...</span>
              )}
            </div>
            {item.weather && (
              <img
                src={`https://openweathermap.org/img/wn/${item.weather.weather[0]?.icon}.png`}
                alt={item.weather.weather[0]?.description}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

