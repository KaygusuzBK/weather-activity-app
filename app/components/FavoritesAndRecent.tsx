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

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    
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
    
    const wasFavorite = isFavorite(city);
    const updatedFavorites = wasFavorite
      ? favorites.filter(c => !(c.name === city.name && c.country === city.country))
      : [...favorites, city];
    
    setFavorites(updatedFavorites);
    
    try {
      if (wasFavorite) {
        removeFavorite(city);
      } else {
        addFavorite(city);
      }
      loadData();
    } catch (error) {
      loadData();
      console.error('Favorite toggle error:', error);
    }
  };

  const handleRemoveRecent = (city: City, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const updated = recentCities.filter(
      c => !(c.name === city.name && c.country === city.country)
    );
    setRecentCities(updated);
    
    try {
      removeRecentCity(city);
      loadData();
    } catch (error) {
      loadData();
      console.error('Remove recent error:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {/* Tabs - Ultra compact */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-2 py-1 rounded-lg font-semibold transition-all text-[10px] backdrop-blur-xl border shadow-sm ${
              activeTab === 'favorites'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500/50 dark:border-indigo-400/50'
                : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-white/20 dark:border-gray-700/20'
            }`}
          >
            <IoHeart className="w-2.5 h-2.5 inline mr-0.5" />
            <span className="hidden sm:inline text-[10px]">Fav</span>
            <span className="text-[10px]">({favorites.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-2 py-1 rounded-lg font-semibold transition-all text-[10px] backdrop-blur-xl border shadow-sm ${
              activeTab === 'recent'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500/50 dark:border-indigo-400/50'
                : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-white/20 dark:border-gray-700/20'
            }`}
          >
            <FiClock className="w-2.5 h-2.5 inline mr-0.5" />
            <span className="hidden sm:inline text-[10px]">Son</span>
            <span className="text-[10px]">({recentCities.length})</span>
          </button>
        </div>

        {/* Content - Ultra compact */}
        <div className="flex gap-1.5 shrink-0">
          {showCurrentLocation && onCurrentLocation && (
            <div
              onClick={onCurrentLocation}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer transition-all backdrop-blur-xl border shadow-sm ${
                selectedCity === null
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500/50 dark:border-indigo-400/50'
                  : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-white/20 dark:border-gray-700/20'
              }`}
            >
              <HiLocationMarker className="w-3 h-3" />
              <span className="font-semibold text-[10px] hidden sm:inline">Konum</span>
            </div>
          )}
          {activeTab === 'favorites' ? (
            favorites.length > 0 ? (
              favorites.map((city) => (
                <div
                  key={`${city.name}-${city.country}`}
                  onClick={() => onCitySelect(city)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer transition-all backdrop-blur-xl border shadow-sm ${
                    selectedCity?.name === city.name && selectedCity?.country === city.country
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500/50 dark:border-indigo-400/50'
                      : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-white/20 dark:border-gray-700/20'
                  }`}
                >
                  <span className="text-xs">{city.emoji || '📍'}</span>
                  <span className="font-semibold text-[10px]">{city.name}</span>
                  <button
                    onClick={(e) => handleToggleFavorite(city, e)}
                    className="hover:scale-110 transition-transform"
                  >
                    {isFavorite(city) ? (
                      <IoHeart className="w-2.5 h-2.5" />
                    ) : (
                      <IoHeartOutline className="w-2.5 h-2.5" />
                    )}
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
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer transition-all backdrop-blur-xl border shadow-sm ${
                    selectedCity?.name === city.name && selectedCity?.country === city.country
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-500/50 dark:border-indigo-400/50'
                      : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-white/20 dark:border-gray-700/20'
                  }`}
                >
                  <span className="text-xs">{city.emoji || '📍'}</span>
                  <span className="font-semibold text-[10px]">{city.name}</span>
                  <button
                    onClick={(e) => handleRemoveRecent(city, e)}
                    className="hover:scale-110 transition-transform opacity-50 hover:opacity-100"
                  >
                    <FiX className="w-2.5 h-2.5" />
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
