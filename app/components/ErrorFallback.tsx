'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { getErrorMessage, type AppError } from '../lib/error-handler';

interface ErrorFallbackProps {
  error: AppError;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorFallback({ error, onRetry, title = 'Bir Hata Oluştu' }: ErrorFallbackProps) {
  const message = getErrorMessage(error);

  return (
    <div className="flex items-center justify-center h-full min-h-[200px] p-4">
      <div className="text-center max-w-sm">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#A25B5B' }} />
        <h3 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>
          {title}
        </h3>
        <p className="text-sm mb-4" style={{ color: '#2C2C2C', opacity: 0.7 }}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 mx-auto hover:opacity-80"
            style={{
              backgroundColor: '#809A6F',
              color: '#D5D8B5',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  );
}

