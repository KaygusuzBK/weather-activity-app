import { Skeleton } from './ui/skeleton';
import { MagicCard } from './ui/magic-card';

export default function CurrentWeatherSkeleton() {
  return (
    <div className="w-full">
      <MagicCard 
        gradientSize={300}
        gradientColor="#6366f1"
        gradientOpacity={0.3}
      >
        <div className="bg-gradient-to-br from-indigo-500/90 to-purple-600/90 dark:from-indigo-600/90 dark:to-purple-700/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 p-6 shadow-2xl">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-6 h-6 rounded-full bg-white/20" />
            <div className="flex-1">
              <Skeleton className="w-40 h-7 rounded bg-white/20 mb-1" />
              <Skeleton className="w-24 h-4 rounded bg-white/20" />
            </div>
          </div>

          {/* Temperature Skeleton */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <Skeleton className="w-32 h-32 rounded-full bg-white/20" />
            <div>
              <Skeleton className="w-32 h-20 rounded bg-white/20 mb-3" />
              <Skeleton className="w-40 h-5 rounded bg-white/20 mb-2" />
              <Skeleton className="w-32 h-4 rounded bg-white/20" />
            </div>
          </div>

          {/* Hourly Forecast Skeleton */}
          <div className="mb-6">
            <Skeleton className="w-32 h-5 rounded bg-white/20 mb-3" />
            <div className="flex gap-2 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="w-[70px] h-[130px] rounded-xl bg-white/20 flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-24 rounded-2xl bg-white/20" />
            ))}
          </div>

          {/* Sun Info Skeleton */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Skeleton className="w-full h-24 rounded-2xl bg-white/20" />
            <Skeleton className="w-full h-24 rounded-2xl bg-white/20" />
          </div>

          {/* UV Index Skeleton */}
          <Skeleton className="w-full h-20 rounded-2xl bg-white/20 mb-6" />

          {/* Activity Recommendations Skeleton */}
          <div className="space-y-2">
            <Skeleton className="w-32 h-5 rounded bg-white/20 mb-3" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="w-full h-24 rounded-xl bg-white/20" />
            ))}
          </div>
        </div>
      </MagicCard>
    </div>
  );
}
