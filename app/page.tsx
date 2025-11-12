'use client';

import { useEffect, useState } from 'react';
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
import { popularCities } from './data/popular-cities';
import { addRecentCity } from './lib/storage';
import { HiLocationMarker } from 'react-icons/hi';
import AnimatedIcon from './components/ui/animated-icon';

export default function Home() {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const defaultCity = popularCities[0];
  const [selectedCity, setSelectedCity] = useState<City | null>(defaultCity);
  const [usingDefaultCity, setUsingDefaultCity] = useState(true);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setUsingDefaultCity(false);
    addRecentCity(city);
  };

  const handleCurrentLocation = () => {
    setSelectedCity(null);
    setUsingDefaultCity(false);
  };

  useEffect(() => {
    if (location && usingDefaultCity) {
      setSelectedCity(null);
      setUsingDefaultCity(false);
    }
  }, [location, usingDefaultCity]);

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#D5D8B5' }}>
      {/* Top Marquee Bar */}
      <div className="flex-shrink-0">
        <CitiesMarquee />
      </div>

      {/* Main Content - Flex container to fill remaining space */}
      <div className="flex-1 overflow-y-auto flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-4 lg:px-6 py-4 sm:py-4">
        {/* Search Bar and Current Location Button */}
        <div className="mb-4 sm:mb-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center shrink-0">
          <div className="flex-1 w-full max-w-md">
            <CitySearch onCitySelect={handleCitySelect} />
          </div>
          {location && (
            <button
              onClick={handleCurrentLocation}
              className={`px-5 py-3 sm:px-6 sm:py-2.5 rounded-full font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap text-base sm:text-base shrink-0 min-h-[44px] ${
                selectedCity === null ? 'shadow-lg scale-105' : ''
              }`}
              style={{
                backgroundColor: selectedCity === null ? '#809A6F' : 'rgba(128, 154, 111, 0.3)',
                color: selectedCity === null ? '#D5D8B5' : '#2C2C2C',
                border: '2px solid #809A6F',
              }}
            >
              <AnimatedIcon hover pulse>
                <HiLocationMarker className="w-5 h-5 sm:w-5 sm:h-5" />
              </AnimatedIcon>
              <span>Konumum</span>
            </button>
          )}
        </div>

        {/* Favorites and Recent */}
        <div className="shrink-0 mb-4 sm:mb-4 flex justify-center">
          <FavoritesAndRecent 
            onCitySelect={handleCitySelect} 
            onCurrentLocation={handleCurrentLocation}
            selectedCity={selectedCity}
            showCurrentLocation={!!location}
          />
        </div>

        {/* Current Weather and Forecast Side by Side - Takes remaining space */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4 md:gap-4 pb-4">
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
