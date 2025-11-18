'use client';

import { useEffect, useState } from 'react';
import { useLocation } from './hooks/useLocation';
import type { City } from './data/popular-cities';
import { popularCities } from './data/popular-cities';
import { addRecentCity } from './lib/storage';
import MobileView from './components/views/MobileView';
import DesktopView from './components/views/DesktopView';

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

  const viewProps = {
    selectedCity,
    location,
    onCitySelect: handleCitySelect,
    onCurrentLocation: handleCurrentLocation,
    locationLoading,
    locationError,
  };

  return (
    <>
      <div className="md:hidden">
        <MobileView {...viewProps} />
      </div>
      <div className="hidden md:block">
        <DesktopView {...viewProps} />
      </div>
    </>
  );
}
