import type { CurrentWeather, WeatherForecast, DailyForecast } from '../types/weather';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_OPENWEATHER_API_KEY environment variable is not set');
}

/**
 * OpenWeatherMap API client
 */
class WeatherAPI {
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  /**
   * Mevcut hava durumunu getirir
   */
  async getCurrentWeather(
    lat: number,
    lon: number
  ): Promise<CurrentWeather> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=tr`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API hatası: ${response.status} ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Hava durumu verisi alınamadı');
    }
  }

  /**
   * 5 günlük 3 saatlik tahmin getirir ve 7 günlük günlük tahmine dönüştürür
   */
  async getForecast(lat: number, lon: number): Promise<DailyForecast[]> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=tr`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API hatası: ${response.status} ${response.statusText}`
        );
      }
      
      const data: WeatherForecast = await response.json();
      
      // 3 saatlik tahminleri günlük tahminlere dönüştür
      return this.convertToDailyForecast(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Hava durumu tahmini alınamadı');
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
    
    // Bugünü atla, yarın başla (7 günlük tahmin için)
    const today = new Date().toISOString().split('T')[0];
    const startIndex = sortedDates.indexOf(today) + 1;
    const datesToProcess = sortedDates.slice(startIndex, startIndex + 7);

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

