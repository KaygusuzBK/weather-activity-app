'use client';

import { popularCities, type City } from '../data/popular-cities';
import { MagicCard } from './ui/magic-card';
import { BorderBeam } from './ui/border-beam';

interface PopularCitiesProps {
  onCitySelect: (city: City) => void;
  selectedCity: City | null;
}

export default function PopularCities({ onCitySelect, selectedCity }: PopularCitiesProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 text-center">
        Popüler Şehirler
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {popularCities.map((city) => (
          <MagicCard
            key={`${city.name}-${city.country}`}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedCity?.name === city.name && selectedCity?.country === city.country
                ? 'ring-2 ring-blue-500 scale-105'
                : 'hover:scale-105'
            }`}
            onClick={() => onCitySelect(city)}
          >
            <BorderBeam size={150} duration={12} colorFrom="#3b82f6" colorTo="#8b5cf6" />
            <div className="relative z-10 p-4 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 dark:from-zinc-100/90 dark:to-zinc-200/90 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl mb-2">{city.emoji}</div>
              <div className="text-sm font-semibold text-white dark:text-zinc-900">
                {city.name}
              </div>
              <div className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
                {city.country}
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
    </div>
  );
}

