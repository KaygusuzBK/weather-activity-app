import { Skeleton } from './ui/skeleton';

export default function CurrentWeatherSkeleton() {
  return (
    <div className="h-full rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #809A6F, #A25B5B)' }}>
      <div className="relative z-10 h-full flex flex-col">
        {/* Location Skeleton */}
        <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2">
          <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-32 h-6 sm:w-40 sm:h-7 rounded" />
        </div>

        {/* Temperature Skeleton */}
        <div className="flex-1 flex flex-col justify-center items-center mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full" />
            <div>
              <Skeleton className="w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 mb-2 rounded" />
              <Skeleton className="w-32 h-4 sm:w-40 sm:h-5 rounded mb-1" />
              <Skeleton className="w-24 h-3 sm:w-32 sm:h-4 rounded" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl sm:rounded-2xl p-2 sm:p-3 border backdrop-blur-md w-full" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                <Skeleton className="w-12 h-3 sm:w-16 sm:h-4 rounded" />
              </div>
              <Skeleton className="w-16 h-6 sm:w-20 sm:h-8 md:w-24 md:h-10 mx-auto rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

