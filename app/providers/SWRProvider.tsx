'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 10000, // 10 saniye - aynı request'i tekrar atmaz
        errorRetryCount: 2, // 3'ten 2'ye düşürüldü
        errorRetryInterval: 2000, // 1 saniye yerine 2 saniye
        shouldRetryOnError: (error) => {
          // 4xx hatalarında retry yapma
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return true;
        },
        onError: (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('SWR Error:', error);
          }
        },
        fetcher: async (url: string) => {
          const response = await fetch(url);
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
          }
          return response.json();
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

