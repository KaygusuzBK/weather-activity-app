/**
 * IP tabanlı lokasyon tespiti için helper fonksiyonlar
 */

import { retryWithBackoff } from '../lib/retry';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

/**
 * IP adresine göre lokasyon bilgisi alır (ipapi.co)
 */
async function getLocationByIPAPI(): Promise<LocationCoordinates> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.reason || 'IP tabanlı lokasyon alınamadı');
    }

    if (!data.latitude || !data.longitude) {
      throw new Error('Geçersiz lokasyon verisi');
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country_name,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('İstek zaman aşımına uğradı');
    }
    throw error;
  }
}

/**
 * Alternatif IP lokasyon API'si (ip-api.com)
 */
async function getLocationByIPAPIAlternative(): Promise<LocationCoordinates> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('http://ip-api.com/json/?fields=status,message,lat,lon,city,country', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'fail') {
      throw new Error(data.message || 'IP tabanlı lokasyon alınamadı');
    }

    if (!data.lat || !data.lon) {
      throw new Error('Geçersiz lokasyon verisi');
    }

    return {
      latitude: data.lat,
      longitude: data.lon,
      city: data.city,
      country: data.country,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('İstek zaman aşımına uğradı');
    }
    throw error;
  }
}

/**
 * IP adresine göre lokasyon bilgisi alır
 * Önce ipapi.co'yu dener, başarısız olursa ip-api.com'u dener
 */
export async function getLocationByIP(): Promise<LocationCoordinates> {
  // İlk API'yi retry ile dene
  try {
    return await retryWithBackoff(
      () => getLocationByIPAPI(),
      {
        maxRetries: 2,
        initialDelay: 1000,
        onRetry: (attempt, error) => {
          console.log(`IP lokasyon retry attempt ${attempt}:`, error.message);
        },
      }
    );
  } catch (error) {
    console.warn('ipapi.co başarısız, alternatif API deneniyor:', error);
    
    // Alternatif API'yi dene
    try {
      return await retryWithBackoff(
        () => getLocationByIPAPIAlternative(),
        {
          maxRetries: 2,
          initialDelay: 1000,
          onRetry: (attempt, error) => {
            console.log(`Alternatif IP lokasyon retry attempt ${attempt}:`, error.message);
          },
        }
      );
    } catch (altError) {
      console.error('Tüm IP lokasyon API\'leri başarısız:', altError);
      throw new Error('IP tabanlı lokasyon tespit edilemedi. Lütfen konum izni verin.');
    }
  }
}

