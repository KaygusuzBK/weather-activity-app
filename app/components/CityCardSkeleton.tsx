import { Skeleton } from './ui/skeleton';

export default function CityCardSkeleton() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 min-w-fit">
      <Skeleton className="w-4 h-4 rounded-full bg-white/20" />
      <Skeleton className="w-12 h-3 rounded bg-white/20" />
      <Skeleton className="w-8 h-3 rounded bg-white/20" />
      <Skeleton className="w-4 h-4 rounded-full bg-white/20" />
    </div>
  );
}
