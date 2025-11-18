'use client';

import { HiLightBulb } from 'react-icons/hi';
import type { CurrentWeather } from '../types/weather';
import AnimatedIcon from './ui/animated-icon';
import { getActivityRecommendations, type ActivityRecommendation } from '../lib/activity-recommendations';
import { MagicCard } from './ui/magic-card';

interface ActivityRecommendationsProps {
  weather: CurrentWeather | null;
}

const typeLabels: Record<ActivityRecommendation['type'], string> = {
  outdoor: 'Dışarı Çıkma',
  clothing: 'Giyim',
  sports: 'Spor',
  travel: 'Seyahat',
};

const typeColors: Record<ActivityRecommendation['type'], { bg: string, border: string, text: string }> = {
  outdoor: { bg: 'bg-green-500/20', border: 'border-green-400/40', text: 'text-green-300' },
  clothing: { bg: 'bg-rose-500/20', border: 'border-rose-400/40', text: 'text-rose-300' },
  sports: { bg: 'bg-amber-500/20', border: 'border-amber-400/40', text: 'text-amber-300' },
  travel: { bg: 'bg-blue-500/20', border: 'border-blue-400/40', text: 'text-blue-300' },
};

export default function ActivityRecommendations({ weather }: ActivityRecommendationsProps) {
  if (!weather) return null;

  const recommendations = getActivityRecommendations(weather);

  if (recommendations.length === 0) return null;

  return (
    <div className="flex-shrink-0">
      <div className="flex items-center gap-1.5 mb-2">
        <AnimatedIcon hover pulse>
          <HiLightBulb className="w-4 h-4 text-yellow-300" />
        </AnimatedIcon>
        <span className="text-xs font-bold text-white">
          Öneriler
        </span>
      </div>

      <div className="space-y-1.5">
        {recommendations.map((rec, index) => (
          <MagicCard 
            key={index}
            gradientSize={150}
            gradientColor="#fbbf24"
            gradientOpacity={0.3}
          >
            <div className={`p-2 rounded-xl backdrop-blur-md border ${typeColors[rec.type].bg} ${typeColors[rec.type].border} transition-all hover:scale-[1.01]`}>
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{rec.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${typeColors[rec.type].text} bg-white/10`}>
                      {typeLabels[rec.type]}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mb-0.5 text-white">
                    {rec.title}
                  </h4>
                  <p className="text-[10px] leading-relaxed text-white/80">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
    </div>
  );
}
