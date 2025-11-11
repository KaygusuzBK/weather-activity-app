'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import type { CurrentWeather } from '../types/weather';
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
  const [isExpanded, setIsExpanded] = useState(false);

  if (!weather) return null;

  const recommendations = getActivityRecommendations(weather);
  const topRecommendations = recommendations.slice(0, 2);
  const allRecommendations = recommendations;

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-2 sm:mt-3 flex-shrink-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-lg border backdrop-blur-md transition-all"
        style={{
          backgroundColor: 'rgba(213, 216, 181, 0.2)',
          borderColor: 'rgba(213, 216, 181, 0.3)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#809A6F' }} />
          <span className="text-xs font-bold" style={{ color: '#D5D8B5' }}>
            Öneriler
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" style={{ color: '#D5D8B5' }} />
        ) : (
          <ChevronDown className="w-3 h-3" style={{ color: '#D5D8B5' }} />
        )}
      </button>

      <div className={`mt-1.5 space-y-1.5 overflow-y-auto transition-all ${isExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
        {allRecommendations.map((rec, index) => (
          <div
            key={index}
            className="p-1.5 sm:p-2 rounded-lg border backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(213, 216, 181, 0.15)',
              borderColor: typeColors[rec.type],
              borderWidth: '1.5px',
            }}
          >
            <div className="flex items-start gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg flex-shrink-0">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: typeColors[rec.type],
                      color: '#2C2C2C',
                    }}
                  >
                    {typeLabels[rec.type]}
                  </span>
                </div>
                <h4 className="text-xs font-bold mb-0.5" style={{ color: '#D5D8B5' }}>
                  {rec.title}
                </h4>
                <p className="text-xs leading-tight" style={{ color: '#D5D8B5', opacity: 0.9 }}>
                  {rec.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && topRecommendations.length > 0 && (
        <div className="mt-1.5 space-y-1.5">
          {topRecommendations.map((rec, index) => (
            <div
              key={index}
              className="p-1.5 sm:p-2 rounded-lg border backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(213, 216, 181, 0.15)',
                borderColor: typeColors[rec.type],
                borderWidth: '1.5px',
              }}
            >
              <div className="flex items-start gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg flex-shrink-0">{rec.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: typeColors[rec.type],
                        color: '#2C2C2C',
                      }}
                    >
                      {typeLabels[rec.type]}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mb-0.5" style={{ color: '#D5D8B5' }}>
                    {rec.title}
                  </h4>
                  <p className="text-xs leading-tight" style={{ color: '#D5D8B5', opacity: 0.9 }}>
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

