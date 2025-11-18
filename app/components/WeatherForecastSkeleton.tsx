import { Skeleton } from './ui/skeleton';
import { MagicCard } from './ui/magic-card';

export default function WeatherForecastSkeleton() {
  return (
    <div className="w-full">
      <MagicCard 
        gradientSize={300}
        gradientColor="#ec4899"
        gradientOpacity={0.3}
      >
        <div className="bg-gradient-to-br from-pink-500/90 to-rose-600/90 dark:from-pink-600/90 dark:to-rose-700/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 p-6 shadow-2xl">
          {/* Header Skeleton */}
          <Skeleton className="w-48 h-8 mx-auto rounded bg-white/20 mb-6" />
          
          {/* Forecast Cards Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton 
                key={i} 
                className="w-full h-24 rounded-2xl bg-white/20"
              />
            ))}
          </div>
        </div>
      </MagicCard>
    </div>
  );
}
