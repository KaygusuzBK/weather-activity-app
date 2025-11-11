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
import { MapPin } from 'lucide-react';

export default function Home() {
  const { location } = useLocation();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    addRecentCity(city);
  };

  const handleCurrentLocation = () => {
    setSelectedCity(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D5D8B5' }}>
      {/* Top Marquee Bar */}
      <CitiesMarquee />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar and Current Location Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <CitySearch onCitySelect={handleCitySelect} />
          </div>
          {location && (
            <button
              onClick={handleCurrentLocation}
              className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedCity === null ? 'shadow-lg scale-105' : ''
              }`}
              style={{
                backgroundColor: selectedCity === null ? '#809A6F' : 'rgba(128, 154, 111, 0.3)',
                color: selectedCity === null ? '#D5D8B5' : '#2C2C2C',
                border: '2px solid #809A6F',
              }}
            >
              <MapPin className="w-5 h-5" />
              <span>Konumum</span>
            </button>
          )}
        </div>

        {/* Favorites and Recent */}
        <FavoritesAndRecent 
          onCitySelect={handleCitySelect} 
          onCurrentLocation={handleCurrentLocation}
          selectedCity={selectedCity}
          showCurrentLocation={!!location}
        />

        {/* Current Weather and Forecast Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 min-h-[600px]">
          <CurrentWeather city={selectedCity} location={location} />
          <WeatherForecast city={selectedCity} location={location} />
        </div>
      </div>
    </div>
  );
}
