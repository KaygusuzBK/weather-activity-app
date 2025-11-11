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
      {/* Tabs */}
      <div className="flex gap-2 mb-2 justify-center">
        <button
          onClick={() => setActiveTab('favorites')}
          className="px-3 py-1.5 rounded-full font-medium transition-all text-xs sm:text-sm"
          style={{
            backgroundColor: activeTab === 'favorites' ? '#809A6F' : 'rgba(128, 154, 111, 0.2)',
            color: activeTab === 'favorites' ? '#D5D8B5' : '#2C2C2C',
          }}
        >
          <AnimatedIcon hover>
            <IoHeart className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5" />
          </AnimatedIcon>
          Favoriler ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className="px-3 py-1.5 rounded-full font-medium transition-all text-xs sm:text-sm"
          style={{
            backgroundColor: activeTab === 'recent' ? '#809A6F' : 'rgba(128, 154, 111, 0.2)',
            color: activeTab === 'recent' ? '#D5D8B5' : '#2C2C2C',
          }}
        >
          <AnimatedIcon hover>
            <FiClock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5" />
          </AnimatedIcon>
          Son Görüntülenen ({recentCities.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {showCurrentLocation && onCurrentLocation && (
          <div
            onClick={onCurrentLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all min-w-fit flex-shrink-0"
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
              <HiLocationMarker className="w-3 h-3 sm:w-4 sm:h-4" />
            </AnimatedIcon>
            <span className="font-medium text-xs sm:text-sm">Konumum</span>
          </div>
        )}
        {activeTab === 'favorites' ? (
          favorites.length > 0 ? (
            favorites.map((city) => (
              <div
                key={`${city.name}-${city.country}`}
                onClick={() => onCitySelect(city)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all min-w-fit flex-shrink-0"
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
                <span className="text-base">{city.emoji || '📍'}</span>
                <span className="font-medium text-xs sm:text-sm">{city.name}</span>
                <button
                  onClick={(e) => handleToggleFavorite(city, e)}
                  className="ml-0.5 hover:scale-110 transition-transform"
                >
                  <AnimatedIcon hover scale={isFavorite(city)}>
                    {isFavorite(city) ? (
                      <IoHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <IoHeartOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </AnimatedIcon>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 w-full text-xs sm:text-sm" style={{ color: '#2C2C2C', opacity: 0.7 }}>
              Henüz favori şehir eklenmemiş
            </div>
          )
        ) : (
          recentCities.length > 0 ? (
            recentCities.map((city) => (
              <div
                key={`${city.name}-${city.country}`}
                onClick={() => onCitySelect(city)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all min-w-fit flex-shrink-0"
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
                <span className="text-base">{city.emoji || '📍'}</span>
                <span className="font-medium text-xs sm:text-sm">{city.name}</span>
                <button
                  onClick={(e) => handleRemoveRecent(city, e)}
                  className="ml-0.5 hover:scale-110 transition-transform opacity-50 hover:opacity-100"
                >
                  <AnimatedIcon hover>
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                  </AnimatedIcon>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 w-full text-xs sm:text-sm" style={{ color: '#2C2C2C', opacity: 0.7 }}>
              Henüz görüntülenen şehir yok
            </div>
          )
        )}
      </div>
    </div>
  );
}

