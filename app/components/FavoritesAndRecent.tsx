'use client';

import { useState, useEffect } from 'react';
import { Heart, Clock, X } from 'lucide-react';
import type { City } from '../data/popular-cities';
import {
  getFavorites,
  getRecentCities,
  addFavorite,
  removeFavorite,
  isFavorite,
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
    
    if (isFavorite(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
    loadData();
  };

  const handleRemoveRecent = (city: City, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentCities.filter(
      c => !(c.name === city.name && c.country === city.country)
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('weather-app-recent-cities', JSON.stringify(updated));
    }
    loadData();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('favorites')}
          className="px-4 py-2 rounded-full font-medium transition-all"
          style={{
            backgroundColor: activeTab === 'favorites' ? '#809A6F' : 'rgba(128, 154, 111, 0.2)',
            color: activeTab === 'favorites' ? '#D5D8B5' : '#2C2C2C',
          }}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Favoriler ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className="px-4 py-2 rounded-full font-medium transition-all"
          style={{
            backgroundColor: activeTab === 'recent' ? '#809A6F' : 'rgba(128, 154, 111, 0.2)',
            color: activeTab === 'recent' ? '#D5D8B5' : '#2C2C2C',
          }}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Son Görüntülenen ({recentCities.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {showCurrentLocation && onCurrentLocation && (
          <div
            onClick={onCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all min-w-fit"
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
            <span className="text-lg">📍</span>
            <span className="font-medium">Konumum</span>
          </div>
        )}
        {activeTab === 'favorites' ? (
          favorites.length > 0 ? (
            favorites.map((city) => (
              <div
                key={`${city.name}-${city.country}`}
                onClick={() => onCitySelect(city)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all min-w-fit"
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
                <span className="text-lg">{city.emoji || '📍'}</span>
                <span className="font-medium">{city.name}</span>
                <button
                  onClick={(e) => handleToggleFavorite(city, e)}
                  className="ml-1 hover:scale-110 transition-transform"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isFavorite(city) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 w-full" style={{ color: '#2C2C2C', opacity: 0.7 }}>
              Henüz favori şehir eklenmemiş
            </div>
          )
        ) : (
          recentCities.length > 0 ? (
            recentCities.map((city) => (
              <div
                key={`${city.name}-${city.country}`}
                onClick={() => onCitySelect(city)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all min-w-fit"
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
                <span className="text-lg">{city.emoji || '📍'}</span>
                <span className="font-medium">{city.name}</span>
                <button
                  onClick={(e) => handleRemoveRecent(city, e)}
                  className="ml-1 hover:scale-110 transition-transform opacity-50 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 w-full" style={{ color: '#2C2C2C', opacity: 0.7 }}>
              Henüz görüntülenen şehir yok
            </div>
          )
        )}
      </div>
    </div>
  );
}

