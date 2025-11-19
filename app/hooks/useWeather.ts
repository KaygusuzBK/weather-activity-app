'use client';

import useSWR from 'swr';
import type { CurrentWeather, ForecastItem } from '../types/weather';
import { weatherAPI } from '../lib/weather-api';
import { getCache, setCache } from '../lib/cache';

interface UseWeatherOptions {
  lat: number | null;
  lon: number | null;
  enabled?: boolean;
}

/**
 * SWR ile current weather fetching hook
 */
export function useCurrentWeather({ lat, lon, enabled = true }: UseWeatherOptions) {
  const cacheKey = lat && lon ? `weather-${lat.toFixed(2)}-${lon.toFixed(2)}` : null;

  const { data, error, isLoading, mutate } = useSWR<CurrentWeather>(
    enabled && cacheKey ? cacheKey : null,
    async () => {
      if (!lat || !lon) throw new Error('Latitude and longitude required');
      
      // Önce cache'den kontrol et
      const cached = getCache<CurrentWeather>(cacheKey!);
      if (cached) {
        return cached;
      }

      return weatherAPI.getCurrentWeather(lat, lon);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 10000,
      errorRetryCount: 2,
      errorRetryInterval: 2000,
      refreshInterval: 10 * 60 * 1000, // 10 dakika (5'ten 10'a çıkarıldı)
      keepPreviousData: true,
    }
  );

  return {
    weather: data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
    mutate,
  };
}

/**
 * SWR ile forecast fetching hook
 */
export function useForecast({ lat, lon, enabled = true }: UseWeatherOptions) {
  const cacheKey = lat && lon ? `forecast-${lat.toFixed(2)}-${lon.toFixed(2)}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    enabled && cacheKey ? cacheKey : null,
    async () => {
      if (!lat || !lon) throw new Error('Latitude and longitude required');
      
      // Önce cache'den kontrol et
      const cached = getCache(cacheKey!);
      if (cached) {
        return cached;
      }

      return weatherAPI.getForecast(lat, lon);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 10000,
      errorRetryCount: 2,
      errorRetryInterval: 2000,
      refreshInterval: 10 * 60 * 1000, // 10 dakika
      keepPreviousData: true,
    }
  );

  return {
    forecast: data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
    mutate,
  };
}

/**
 * SWR ile hourly forecast fetching hook
 */
export function useHourlyForecast({ lat, lon, enabled = true }: UseWeatherOptions) {
  const cacheKey = lat && lon ? `hourly-${lat.toFixed(2)}-${lon.toFixed(2)}` : null;

  const { data, error, isLoading, mutate } = useSWR<ForecastItem[]>(
    enabled && cacheKey ? cacheKey : null,
    async () => {
      if (!lat || !lon) throw new Error('Latitude and longitude required');
      
      // Önce cache'den kontrol et
      const cached = getCache<ForecastItem[]>(cacheKey!);
      if (cached) {
        return cached;
      }

      return weatherAPI.getHourlyForecast(lat, lon);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 10000,
      errorRetryCount: 2,
      errorRetryInterval: 2000,
      refreshInterval: 10 * 60 * 1000, // 10 dakika
      keepPreviousData: true,
    }
  );

  return {
    hourlyForecast: data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
    mutate,
  };
}

