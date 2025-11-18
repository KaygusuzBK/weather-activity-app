'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { HiLocationMarker } from 'react-icons/hi';
import { weatherAPI } from '../lib/weather-api';
import AnimatedIcon from './ui/animated-icon';
import type { City } from '../data/popular-cities';
import { addRecentCity } from '../lib/storage';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

interface SearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await weatherAPI.searchCity(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('Arama hatası:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const city: City = {
      name: result.name,
      country: result.country,
      lat: result.lat,
      lon: result.lon,
      emoji: '📍',
    };
    
    addRecentCity(city);
    onCitySelect(city);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
          <AnimatedIcon hover pulse>
            <FiSearch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </AnimatedIcon>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Şehir ara..."
          className="w-full pl-12 pr-12 py-2.5 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-lg"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
          >
            <AnimatedIcon hover>
              <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </AnimatedIcon>
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-2xl max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400 animate-pulse">
              Aranıyor...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.name}-${result.country}-${index}`}
                  onClick={() => handleSelect(result)}
                  className="w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-3 group"
                >
                  <AnimatedIcon hover pulse>
                    <HiLocationMarker className="w-5 h-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                  </AnimatedIcon>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-gray-800 dark:text-gray-100">
                      {result.name}
                      {result.state && `, ${result.state}`}
                    </div>
                    <div className="text-sm truncate text-gray-600 dark:text-gray-400">
                      {result.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">
              Sonuç bulunamadı
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
