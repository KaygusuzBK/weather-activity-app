import { Skeleton } from './ui/skeleton';

export default function WeatherForecastSkeleton() {
  return (
    <div className="h-full rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #CC9C75, #D5D8B5)' }}>
      <div className="relative z-10 h-full flex flex-col min-h-0">
        {/* Title Skeleton */}
        <Skeleton className="w-40 h-6 sm:w-48 sm:h-7 md:w-56 md:h-8 mx-auto mb-2 sm:mb-3 rounded" />

        {/* Forecast Items Skeleton */}
        <div className="flex-1 flex flex-col justify-center gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl sm:rounded-2xl p-2 sm:p-3 border backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(44, 44, 44, 0.15)',
                borderColor: 'rgba(44, 44, 44, 0.2)',
              }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
                  <Skeleton className="w-16 h-8 sm:w-20 sm:h-10 rounded" />
                  <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-24 h-5 sm:w-32 sm:h-6 md:w-40 md:h-7 rounded mb-1" />
                    <Skeleton className="w-32 h-3 sm:w-40 sm:h-4 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Skeleton className="w-12 h-8 sm:w-14 sm:h-10 rounded" />
                  <Skeleton className="w-12 h-8 sm:w-14 sm:h-10 rounded" />
                  <Skeleton className="w-12 h-8 sm:w-14 sm:h-10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

