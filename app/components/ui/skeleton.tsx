export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'rgba(44, 44, 44, 0.1)' }}
    />
  );
}

