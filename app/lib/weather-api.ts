import type { CurrentWeather, WeatherForecast, DailyForecast, ForecastItem } from '../types/weather';
import { fetchWithRetry } from './retry';
import { getCache, setCache } from './cache';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_OPENWEATHER_API_KEY environment variable is not set');
}

/**
 * OpenWeatherMap API client (Free Plan)
 * Uses Current Weather API and 5 Day / 3 Hour Forecast API
 */
class WeatherAPI {
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  /**
   * Mevcut hava durumunu getirir (retry ve cache ile)
   */
  async getCurrentWeather(
    lat: number,
    lon: number,
    useCache: boolean = true
  ): Promise<CurrentWeather> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const cacheKey = `weather-${lat}-${lon}`;

    // Cache'den kontrol et
    if (useCache) {
      const cached = getCache<CurrentWeather>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=tr`;
    
    try {
      const response = await fetchWithRetry(url, {}, {
        maxRetries: 3,
        initialDelay: 1000,
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt} for getCurrentWeather:`, error.message);
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API hatası: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json();
      
      // Cache'e kaydet
      if (useCache) {
        setCache(cacheKey, data, CACHE_TTL);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Hava durumu verisi alınamadı');
    }
  }

  /**
   * Şehir adına göre arama yapar (Geocoding API - Direct API Call)
   */
  async searchCity(query: string): Promise<Array<{ name: string; country: string; lat: number; lon: number; state?: string }>> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    if (!query || query.length < 2) {
      return [];
    }

    // OpenWeatherMap Geocoding API
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API hatası: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json();
      
      // Geocoding API response formatı
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          name: item.name,
          country: item.country,
          lat: item.lat,
          lon: item.lon,
          state: item.state,
        }));
      }
      
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Şehir araması yapılamadı');
    }
  }

  /**
   * 5 günlük 3 saatlik tahmin getirir ve günlük tahmine dönüştürür (retry ve cache ile)
   */
  async getForecast(
    lat: number,
    lon: number,
    useCache: boolean = true
  ): Promise<DailyForecast[]> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const cacheKey = `forecast-${lat}-${lon}`;

    // Cache'den kontrol et
    if (useCache) {
      const cached = getCache<DailyForecast[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=tr`;
    
    try {
      const response = await fetchWithRetry(url, {}, {
        maxRetries: 3,
        initialDelay: 1000,
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt} for getForecast:`, error.message);
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API hatası: ${response.status} ${response.statusText}`
        );
      }
      
      const data: WeatherForecast = await response.json();
      
      // 3 saatlik tahminleri günlük tahminlere dönüştür
      const dailyForecast = this.convertToDailyForecast(data);
      
      // Cache'e kaydet
      if (useCache) {
        setCache(cacheKey, dailyForecast, CACHE_TTL);
      }
      
      return dailyForecast;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Hava durumu tahmini alınamadı');
    }
  }

  /**
   * 24 saatlik saatlik tahmin getirir (3 saatlik forecast'ten ilk 24 saat)
   */
  async getHourlyForecast(
    lat: number,
    lon: number,
    useCache: boolean = true
  ): Promise<ForecastItem[]> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const cacheKey = `hourly-${lat}-${lon}`;

    // Cache'den kontrol et
    if (useCache) {
      const cached = getCache<ForecastItem[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=tr`;
    
    try {
      const response = await fetchWithRetry(url, {}, {
        maxRetries: 3,
        initialDelay: 1000,
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt} for getHourlyForecast:`, error.message);
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API hatası: ${response.status} ${response.statusText}`
        );
      }
      
      const data: WeatherForecast = await response.json();
      
      // İlk 8 item = 24 saat (3 saatlik aralıklarla)
      const hourlyForecast = data.list.slice(0, 8);
      
      // Cache'e kaydet
      if (useCache) {
        setCache(cacheKey, hourlyForecast, CACHE_TTL);
      }
      
      return hourlyForecast;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Saatlik tahmin alınamadı');
    }
  }

  /**
   * 3 saatlik tahminleri günlük tahminlere dönüştürür
   * Her gün için en yüksek ve en düşük sıcaklıkları, en çok görünen hava durumunu alır
   */
  private convertToDailyForecast(data: WeatherForecast): DailyForecast[] {
    const dailyMap = new Map<string, {
      temps: number[];
      items: typeof data.list;
    }>();

    // Tarihe göre grupla
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, { temps: [], items: [] });
      }
      
      const dayData = dailyMap.get(dateKey)!;
      dayData.temps.push(item.main.temp);
      dayData.items.push(item);
    });

    // Her gün için en uygun veriyi seç (genellikle öğlen saatleri)
    const dailyForecasts: DailyForecast[] = [];
    const sortedDates = Array.from(dailyMap.keys()).sort();
    
    // Bugünü atla, yarın başla (5 günlük tahmin için)
    const today = new Date().toISOString().split('T')[0];
    const startIndex = sortedDates.indexOf(today) + 1;
    const datesToProcess = sortedDates.slice(startIndex, startIndex + 5);

    datesToProcess.forEach((dateKey) => {
      const dayData = dailyMap.get(dateKey)!;
      if (!dayData || dayData.items.length === 0) return;

      // En yüksek ve en düşük sıcaklıkları bul
      const temps = dayData.items.map(item => item.main.temp);
      const tempMin = Math.min(...temps);
      const tempMax = Math.max(...temps);

      // Öğlen saatlerindeki (12:00-15:00 arası) veriyi tercih et
      const noonItem = dayData.items.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 12 && hour <= 15;
      }) || dayData.items[Math.floor(dayData.items.length / 2)];

      const date = new Date(dateKey);
      const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      
      dailyForecasts.push({
        date: dateKey,
        day: dayNames[date.getDay()],
        temp_min: Math.round(tempMin),
        temp_max: Math.round(tempMax),
        weather: noonItem.weather[0],
        humidity: noonItem.main.humidity,
        wind_speed: noonItem.wind.speed,
        pop: Math.max(...dayData.items.map(item => item.pop || 0)),
      });
    });

    return dailyForecasts;
  }
}

export const weatherAPI = new WeatherAPI();
