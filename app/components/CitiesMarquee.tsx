'use client';

import { popularCities, type City } from '../data/popular-cities';
import { useCurrentWeather } from '../hooks/useWeather';
import CityCardSkeleton from './CityCardSkeleton';

interface CityWeatherCardProps {
  city: City;
}

function CityWeatherCard({ city }: CityWeatherCardProps) {
  const { weather, loading } = useCurrentWeather({
    lat: city.lat,
    lon: city.lon,
    enabled: true,
  });

  if (loading) {
    return <CityCardSkeleton />;
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 min-w-fit transition-all hover:bg-white/30 dark:hover:bg-gray-800/30">
      <span className="text-sm">{city.emoji}</span>
      <div className="flex items-center gap-1">
        <span className="font-bold text-[10px] text-white">{city.name}</span>
        {weather ? (
          <span className="text-[10px] text-white/80">
            {Math.round(weather.main.temp)}°
          </span>
        ) : (
          <span className="text-[10px] text-white/50">...</span>
        )}
      </div>
      {weather && (
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}.png`}
          alt={weather.weather[0]?.description}
          className="w-4 h-4"
        />
      )}
    </div>
  );
}

export default function CitiesMarquee() {
  const duplicatedCities = [...popularCities, ...popularCities];

  return (
    <div className="w-full py-1.5 overflow-hidden relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700">
      <div className="flex animate-scroll gap-2 whitespace-nowrap">
        {duplicatedCities.map((city, index) => (
          <CityWeatherCard key={`${city.name}-${index}`} city={city} />
        ))}
      </div>
    </div>
  );
}
