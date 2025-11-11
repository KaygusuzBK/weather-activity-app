'use client';

import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import CurrentWeatherSkeleton from './components/CurrentWeatherSkeleton';
import WeatherForecastSkeleton from './components/WeatherForecastSkeleton';
import CitiesMarquee from './components/CitiesMarquee';
import CitySearch from './components/CitySearch';
import FavoritesAndRecent from './components/FavoritesAndRecent';
import NotificationSettings from './components/NotificationSettings';
import { useLocation } from './hooks/useLocation';
import type { City } from './data/popular-cities';
import { addRecentCity } from './lib/storage';
import { MapPin } from 'lucide-react';

export default function Home() {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    addRecentCity(city);
  };

  const handleCurrentLocation = () => {
    setSelectedCity(null);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#D5D8B5' }}>
      {/* Top Marquee Bar */}
      <div className="flex-shrink-0">
        <CitiesMarquee />
      </div>

      {/* Main Content - Flex container to fill remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        {/* Search Bar and Current Location Button */}
        <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row gap-2 items-center justify-center flex-shrink-0">
          <div className="flex-1 w-full max-w-md">
            <CitySearch onCitySelect={handleCitySelect} />
          </div>
          {location && (
            <button
              onClick={handleCurrentLocation}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
                selectedCity === null ? 'shadow-lg scale-105' : ''
              }`}
              style={{
                backgroundColor: selectedCity === null ? '#809A6F' : 'rgba(128, 154, 111, 0.3)',
                color: selectedCity === null ? '#D5D8B5' : '#2C2C2C',
                border: '2px solid #809A6F',
              }}
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Konumum</span>
            </button>
          )}
        </div>

        {/* Favorites and Recent */}
        <div className="flex-shrink-0 mb-2 sm:mb-3 flex justify-center">
          <FavoritesAndRecent 
            onCitySelect={handleCitySelect} 
            onCurrentLocation={handleCurrentLocation}
            selectedCity={selectedCity}
            showCurrentLocation={!!location}
          />
        </div>

        {/* Current Weather and Forecast Side by Side - Takes remaining space */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
          {locationLoading && !selectedCity ? (
            <>
              <CurrentWeatherSkeleton />
              <WeatherForecastSkeleton />
            </>
          ) : locationError && !selectedCity && !location ? (
            <div className="col-span-1 lg:col-span-2 flex items-center justify-center">
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: 'rgba(162, 91, 91, 0.2)' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: '#A25B5B' }}>
                  Konum Tespit Edilemedi
                </p>
                <p className="text-sm mb-4" style={{ color: '#2C2C2C' }}>
                  {locationError}
                </p>
                <p className="text-xs" style={{ color: '#2C2C2C', opacity: 0.7 }}>
                  Lütfen bir şehir arayın veya konum izni verin.
                </p>
              </div>
            </div>
          ) : (
            <>
              <CurrentWeather city={selectedCity} location={location} />
              <WeatherForecast city={selectedCity} location={location} />
            </>
          )}
        </div>
      </div>

      {/* Notification Settings Button */}
      <NotificationSettings />
    </div>
  );
}
