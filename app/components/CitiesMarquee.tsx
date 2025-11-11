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
    <div
      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full border min-w-fit transition-colors"
      style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', backdropFilter: 'blur(8px)', borderColor: 'rgba(213, 216, 181, 0.3)' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(213, 216, 181, 0.3)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(213, 216, 181, 0.2)'}
    >
      <span className="text-lg sm:text-xl">{city.emoji}</span>
      <div className="flex flex-col">
        <span className="font-bold text-xs" style={{ color: '#2C2C2C' }}>{city.name}</span>
        {weather ? (
          <span className="text-xs" style={{ color: '#2C2C2C', opacity: 0.8 }}>
            {Math.round(weather.main.temp)}°C
          </span>
        ) : (
          <span className="text-xs" style={{ color: '#2C2C2C', opacity: 0.5 }}>...</span>
        )}
      </div>
      {weather && (
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}.png`}
          alt={weather.weather[0]?.description}
          className="w-5 h-5 sm:w-6 sm:h-6"
        />
      )}
    </div>
  );
}

export default function CitiesMarquee() {
  // Duplicate cities for seamless scroll
  const duplicatedCities = [...popularCities, ...popularCities];

  return (
    <div className="w-full py-2 sm:py-2.5 overflow-hidden relative" style={{ background: 'linear-gradient(to right, #809A6F, #A25B5B, #CC9C75)' }}>
      <div className="flex animate-scroll gap-4 sm:gap-6 md:gap-8 whitespace-nowrap">
        {duplicatedCities.map((city, index) => (
          <CityWeatherCard key={`${city.name}-${index}`} city={city} />
        ))}
      </div>
    </div>
  );
}

