'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { weatherAPI } from '../lib/weather-api';
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

    const timeoutId = setTimeout(searchCities, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const city: City = {
      name: result.name,
      country: result.country,
      lat: result.lat,
      lon: result.lon,
      emoji: '📍', // Default emoji
    };
    
    addRecentCity(city);
    onCitySelect(city);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#809A6F' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Şehir ara..."
          className="w-full pl-10 pr-10 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: 'rgba(213, 216, 181, 0.3)',
            borderColor: '#809A6F',
            color: '#2C2C2C',
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-5 h-5" style={{ color: '#809A6F' }} />
          </button>
        )}
      </div>

      {showResults && (
        <div
          className="absolute z-50 w-full mt-2 rounded-2xl border-2 overflow-hidden shadow-xl"
          style={{
            backgroundColor: '#D5D8B5',
            borderColor: '#809A6F',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div className="p-4 text-center" style={{ color: '#2C2C2C' }}>
              Aranıyor...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.name}-${result.country}-${index}`}
                  onClick={() => handleSelect(result)}
                  className="w-full px-4 py-3 text-left hover:bg-opacity-50 transition-colors flex items-center gap-3"
                  style={{ backgroundColor: 'rgba(128, 154, 111, 0.1)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(128, 154, 111, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(128, 154, 111, 0.1)';
                  }}
                >
                  <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#809A6F' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate" style={{ color: '#2C2C2C' }}>
                      {result.name}
                      {result.state && `, ${result.state}`}
                    </div>
                    <div className="text-sm truncate" style={{ color: '#2C2C2C', opacity: 0.7 }}>
                      {result.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center" style={{ color: '#2C2C2C', opacity: 0.7 }}>
              Sonuç bulunamadı
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

