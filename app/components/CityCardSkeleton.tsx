import { Skeleton } from './ui/skeleton';

export default function CityCardSkeleton() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full border min-w-fit" style={{ backgroundColor: 'rgba(213, 216, 181, 0.2)', borderColor: 'rgba(213, 216, 181, 0.3)' }}>
      <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
      <Skeleton className="w-20 h-4 sm:w-24 sm:h-5 rounded" />
      <Skeleton className="w-12 h-3 sm:w-16 sm:h-4 rounded" />
      <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
    </div>
  );
}

