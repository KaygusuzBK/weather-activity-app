'use client';

import { HiLightBulb } from 'react-icons/hi';
import type { CurrentWeather } from '../types/weather';
import AnimatedIcon from './ui/animated-icon';
import { getActivityRecommendations, type ActivityRecommendation } from '../lib/activity-recommendations';

interface ActivityRecommendationsProps {
  weather: CurrentWeather | null;
}

const typeLabels: Record<ActivityRecommendation['type'], string> = {
  outdoor: 'Dışarı Çıkma',
  clothing: 'Giyim',
  sports: 'Spor',
  travel: 'Seyahat',
};

const typeColors: Record<ActivityRecommendation['type'], string> = {
  outdoor: '#809A6F',
  clothing: '#A25B5B',
  sports: '#CC9C75',
  travel: '#D5D8B5',
};

export default function ActivityRecommendations({ weather }: ActivityRecommendationsProps) {
  if (!weather) return null;

  const recommendations = getActivityRecommendations(weather);

  if (recommendations.length === 0) return null;

  return (
    <div className="flex-shrink-0 flex flex-col min-h-0">
      {/* Başlık */}
      <div className="flex items-center gap-2 mb-2">
        <AnimatedIcon hover pulse>
          <HiLightBulb className="w-4 h-4 sm:w-4 sm:h-4" style={{ color: '#809A6F' }} />
        </AnimatedIcon>
        <span className="text-sm sm:text-sm font-bold lg:text-base text-gray-800 dark:text-gray-200">
          Öneriler
        </span>
      </div>

      {/* Scroll edilebilir öneriler listesi */}
      <div className="space-y-2 pr-1">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="p-2.5 sm:p-2 rounded-lg border backdrop-blur-md flex-shrink-0"
            style={{
              backgroundColor: 'rgba(128, 154, 111, 0.1)',
              borderColor: typeColors[rec.type],
              borderWidth: '1.5px',
            }}
          >
            <div className="flex items-start gap-2 sm:gap-2">
              <span className="text-lg sm:text-lg flex-shrink-0">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full text-gray-800 dark:text-gray-200"
                    style={{
                      backgroundColor: typeColors[rec.type],
                    }}
                  >
                    {typeLabels[rec.type]}
                  </span>
                </div>
                <h4 className="text-sm font-bold mb-1 text-gray-800 dark:text-gray-200">
                  {rec.title}
                </h4>
                <p className="text-xs sm:text-xs leading-relaxed text-gray-700 dark:text-gray-300 opacity-80">
                  {rec.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

