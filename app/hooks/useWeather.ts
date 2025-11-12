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
  const cacheKey = lat && lon ? `weather-${lat}-${lon}` : null;

  const { data, error, isLoading, mutate } = useSWR<CurrentWeather>(
    enabled && cacheKey ? cacheKey : null,
    async () => {
      if (!lat || !lon) throw new Error('Latitude and longitude required');
      
      // Önce cache'den kontrol et
      const cached = getCache<CurrentWeather>(cacheKey!);
      if (cached) {
        // Background'da fresh data fetch et
        weatherAPI.getCurrentWeather(lat, lon, false).then((freshData) => {
          setCache(cacheKey!, freshData);
          mutate(freshData, false); // Revalidate without triggering loading
        }).catch(() => {
          // Hata olursa cached data'yı kullan
        });
        return cached;
      }

      return weatherAPI.getCurrentWeather(lat, lon);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 2000,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
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
  const cacheKey = lat && lon ? `forecast-${lat}-${lon}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    enabled && cacheKey ? cacheKey : null,
    async () => {
      if (!lat || !lon) throw new Error('Latitude and longitude required');
      
      // Önce cache'den kontrol et
      const cached = getCache(cacheKey!);
      if (cached) {
        // Background'da fresh data fetch et
        weatherAPI.getForecast(lat, lon, false).then((freshData) => {
          setCache(cacheKey!, freshData);
          mutate(freshData, false);
        }).catch(() => {
          // Hata olursa cached data'yı kullan
        });
        return cached;
      }

      return weatherAPI.getForecast(lat, lon);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 2000,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
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
  const cacheKey = lat && lon ? `hourly-${lat}-${lon}` : null;

  const { data, error, isLoading, mutate } = useSWR<ForecastItem[]>(
    enabled && cacheKey ? cacheKey : null,
    async () => {
      if (!lat || !lon) throw new Error('Latitude and longitude required');
      
      // Önce cache'den kontrol et
      const cached = getCache<ForecastItem[]>(cacheKey!);
      if (cached) {
        // Background'da fresh data fetch et
        weatherAPI.getHourlyForecast(lat, lon, false).then((freshData) => {
          setCache(cacheKey!, freshData);
          mutate(freshData, false);
        }).catch(() => {
          // Hata olursa cached data'yı kullan
        });
        return cached;
      }

      return weatherAPI.getHourlyForecast(lat, lon);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 2000,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
    }
  );

  return {
    hourlyForecast: data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
    mutate,
  };
}

