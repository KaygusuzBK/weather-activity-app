'use client';

import { useState, useEffect } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { FiClock, FiX } from 'react-icons/fi';
import { HiLocationMarker } from 'react-icons/hi';
import type { City } from '../data/popular-cities';
import AnimatedIcon from './ui/animated-icon';
import {
  getFavorites,
  getRecentCities,
  addFavorite,
  removeFavorite,
  isFavorite,
  removeRecentCity,
} from '../lib/storage';

interface FavoritesAndRecentProps {
  onCitySelect: (city: City) => void;
  onCurrentLocation?: () => void;
  selectedCity: City | null;
  showCurrentLocation?: boolean;
}

export default function FavoritesAndRecent({ onCitySelect, onCurrentLocation, selectedCity, showCurrentLocation = false }: FavoritesAndRecentProps) {
  const [favorites, setFavorites] = useState<City[]>([]);
  const [recentCities, setRecentCities] = useState<City[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');

  useEffect(() => {
    loadData();

    // Storage event listener for cross-component updates
    const handleStorageChange = () => {
      loadData();
    };

    // Listen to both native storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handleCustomStorage = () => {
      loadData();
    };
    window.addEventListener('favoritesUpdated', handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleCustomStorage);
    };
  }, []);

  const loadData = () => {
    setFavorites(getFavorites());
    setRecentCities(getRecentCities());
  };

  const handleToggleFavorite = (city: City, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    const wasFavorite = isFavorite(city);
    const updatedFavorites = wasFavorite
      ? favorites.filter(c => !(c.name === city.name && c.country === city.country))
      : [...favorites, city];
    
    setFavorites(updatedFavorites);
    
    // Actual update
    try {
      if (wasFavorite) {
        removeFavorite(city);
      } else {
        addFavorite(city);
      }
      loadData();
    } catch (error) {
      // Rollback on error
      loadData();
      console.error('Favorite toggle error:', error);
    }
  };

  const handleRemoveRecent = (city: City, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    const updated = recentCities.filter(
      c => !(c.name === city.name && c.country === city.country)
    );
    setRecentCities(updated);
    
    // Actual update
    try {
      removeRecentCity(city);
      loadData();
    } catch (error) {
      // Rollback on error
      loadData();
      console.error('Remove recent error:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Tabs and Content in one compact row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* Tabs as compact buttons */}
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('favorites')}
            className="px-2 py-1 rounded-full font-medium transition-all text-xs shrink-0"
            style={{
              backgroundColor: activeTab === 'favorites' ? '#809A6F' : 'rgba(128, 154, 111, 0.2)',
              color: activeTab === 'favorites' ? '#D5D8B5' : '#2C2C2C',
            }}
          >
            <AnimatedIcon hover>
              <IoHeart className="w-3 h-3 inline mr-1" />
            </AnimatedIcon>
            <span className="hidden sm:inline">Favoriler</span>
            <span className="sm:hidden">({favorites.length})</span>
            <span className="hidden sm:inline">({favorites.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className="px-2 py-1 rounded-full font-medium transition-all text-xs shrink-0"
            style={{
              backgroundColor: activeTab === 'recent' ? '#809A6F' : 'rgba(128, 154, 111, 0.2)',
              color: activeTab === 'recent' ? '#D5D8B5' : '#2C2C2C',
            }}
          >
            <AnimatedIcon hover>
              <FiClock className="w-3 h-3 inline mr-1" />
            </AnimatedIcon>
            <span className="hidden sm:inline">Son Görüntülenen</span>
            <span className="sm:hidden">({recentCities.length})</span>
            <span className="hidden sm:inline">({recentCities.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex gap-2 shrink-0">
          {showCurrentLocation && onCurrentLocation && (
            <div
              onClick={onCurrentLocation}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border-2 cursor-pointer transition-all min-w-fit shrink-0"
              style={{
                backgroundColor: selectedCity === null
                  ? '#809A6F'
                  : 'rgba(213, 216, 181, 0.3)',
                borderColor: '#809A6F',
                color: selectedCity === null
                  ? '#D5D8B5'
                  : '#2C2C2C',
              }}
            >
              <AnimatedIcon hover pulse>
                <HiLocationMarker className="w-3 h-3" />
              </AnimatedIcon>
              <span className="font-medium text-xs hidden sm:inline">Konumum</span>
            </div>
          )}
          {activeTab === 'favorites' ? (
            favorites.length > 0 ? (
              favorites.map((city) => (
                <div
                  key={`${city.name}-${city.country}`}
                  onClick={() => onCitySelect(city)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border-2 cursor-pointer transition-all min-w-fit shrink-0"
                  style={{
                    backgroundColor: selectedCity?.name === city.name && selectedCity?.country === city.country
                      ? '#809A6F'
                      : 'rgba(213, 216, 181, 0.3)',
                    borderColor: '#809A6F',
                    color: selectedCity?.name === city.name && selectedCity?.country === city.country
                      ? '#D5D8B5'
                      : '#2C2C2C',
                  }}
                >
                  <span className="text-sm">{city.emoji || '📍'}</span>
                  <span className="font-medium text-xs">{city.name}</span>
                  <button
                    onClick={(e) => handleToggleFavorite(city, e)}
                    className="ml-0.5 hover:scale-110 transition-transform"
                  >
                    <AnimatedIcon hover scale={isFavorite(city)}>
                      {isFavorite(city) ? (
                        <IoHeart className="w-3 h-3" />
                      ) : (
                        <IoHeartOutline className="w-3 h-3" />
                      )}
                    </AnimatedIcon>
                  </button>
                </div>
              ))
            ) : null
          ) : (
            recentCities.length > 0 ? (
              recentCities.map((city) => (
                <div
                  key={`${city.name}-${city.country}`}
                  onClick={() => onCitySelect(city)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border-2 cursor-pointer transition-all min-w-fit shrink-0"
                  style={{
                    backgroundColor: selectedCity?.name === city.name && selectedCity?.country === city.country
                      ? '#809A6F'
                      : 'rgba(213, 216, 181, 0.3)',
                    borderColor: '#809A6F',
                    color: selectedCity?.name === city.name && selectedCity?.country === city.country
                      ? '#D5D8B5'
                      : '#2C2C2C',
                  }}
                >
                  <span className="text-sm">{city.emoji || '📍'}</span>
                  <span className="font-medium text-xs">{city.name}</span>
                  <button
                    onClick={(e) => handleRemoveRecent(city, e)}
                    className="ml-0.5 hover:scale-110 transition-transform opacity-50 hover:opacity-100"
                  >
                    <AnimatedIcon hover>
                      <FiX className="w-3 h-3" />
                    </AnimatedIcon>
                  </button>
                </div>
              ))
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

