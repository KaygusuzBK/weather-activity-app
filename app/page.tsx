'use client';

import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import CitiesMarquee from './components/CitiesMarquee';
import CitySearch from './components/CitySearch';
import FavoritesAndRecent from './components/FavoritesAndRecent';
import { useLocation } from './hooks/useLocation';
import type { City } from './data/popular-cities';
import { addRecentCity } from './lib/storage';

export default function Home() {
  const { location } = useLocation();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    addRecentCity(city);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D5D8B5' }}>
      {/* Top Marquee Bar */}
      <CitiesMarquee />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <CitySearch onCitySelect={handleCitySelect} />
        </div>

        {/* Favorites and Recent */}
        <FavoritesAndRecent onCitySelect={handleCitySelect} selectedCity={selectedCity} />

        {/* Current Weather and Forecast Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 min-h-[600px]">
          <CurrentWeather city={selectedCity} location={location} />
          <WeatherForecast city={selectedCity} location={location} />
        </div>
      </div>
    </div>
  );
}
