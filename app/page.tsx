'use client';

import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import PopularCities from './components/PopularCities';
import { useLocation } from './hooks/useLocation';
import type { City } from './data/popular-cities';
import { Particles } from './components/ui/particles';

export default function Home() {
  const { location } = useLocation();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black relative overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#3b82f6"
        size={0.4}
      />
      <div className="relative z-10">
        <main className="min-h-screen py-4 sm:py-6 md:py-8">
          <div className="text-center mb-4 sm:mb-6 md:mb-8 px-3 sm:px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hava Durumu
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base md:text-lg">
              Dünya genelinde hava durumunu keşfedin
            </p>
          </div>

          <PopularCities onCitySelect={handleCitySelect} selectedCity={selectedCity} />

          <div className="mt-4 sm:mt-6 md:mt-8">
            <CurrentWeather city={selectedCity} location={location} />
          </div>

          {(selectedCity || location) && (
            <div className="mt-4 sm:mt-6 md:mt-8">
              <WeatherForecast city={selectedCity} location={location} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
