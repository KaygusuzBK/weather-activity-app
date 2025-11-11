/**
 * LocalStorage cache utility with TTL (Time To Live) support
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = 'weather-app-cache-';

/**
 * Cache key oluşturur
 */
function getCacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

/**
 * Cache'e veri kaydeder
 */
export function setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
  if (typeof window === 'undefined') return;

  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(item));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Cache'den veri okur
 */
export function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const itemStr = localStorage.getItem(getCacheKey(key));
    if (!itemStr) return null;

    const item: CacheItem<T> = JSON.parse(itemStr);
    const now = Date.now();

    // TTL kontrolü
    if (now - item.timestamp > item.ttl) {
      // Süresi dolmuş, cache'i temizle
      removeCache(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Cache'den veri siler
 */
export function removeCache(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(getCacheKey(key));
  } catch (error) {
    console.error('Cache remove error:', error);
  }
}

/**
 * Tüm cache'i temizler
 */
export function clearCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Cache'deki eski verileri temizler (TTL dolmuş)
 */
export function cleanExpiredCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            const item: CacheItem<unknown> = JSON.parse(itemStr);
            if (now - item.timestamp > item.ttl) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Hatalı veri, sil
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Cache clean error:', error);
  }
}

