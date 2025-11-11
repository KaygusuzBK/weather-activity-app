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
        revalidateOnReconnect: true,
        revalidateIfStale: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        onError: (error) => {
          console.error('SWR Error:', error);
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

