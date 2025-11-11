import type { OneCallResponse, CurrentWeather, DailyForecast } from '../types/weather';

const API_BASE_URL = 'https://api.openweathermap.org/data/3.0';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_OPENWEATHER_API_KEY environment variable is not set');
}

/**
 * OpenWeatherMap One Call API 3.0 client
 */
class WeatherAPI {
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  /**
   * One Call API ile hem mevcut hava durumunu hem de 7 günlük tahmini getirir
   * exclude parametresi ile sadece ihtiyacımız olan verileri alıyoruz (minutely, hourly, alerts hariç)
   */
  async getWeatherData(
    lat: number,
    lon: number
  ): Promise<OneCallResponse> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    // exclude=minutely,hourly,alerts - sadece current ve daily verilerini alıyoruz
    const url = `${this.baseUrl}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${this.apiKey}&units=metric&lang=tr`;
    
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
   * Mevcut hava durumunu getirir
   */
  async getCurrentWeather(
    lat: number,
    lon: number
  ): Promise<CurrentWeather> {
    const data = await this.getWeatherData(lat, lon);
    return data.current;
  }

  /**
   * 7 günlük günlük tahmin getirir
   */
  async getForecast(lat: number, lon: number): Promise<DailyForecast[]> {
    const data = await this.getWeatherData(lat, lon);
    
    // One Call API zaten günlük tahminleri veriyor, sadece formatlamamız gerekiyor
    const dailyForecasts: DailyForecast[] = [];
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    
    // İlk gün bugün, yarın başlayarak 7 gün alıyoruz
    data.daily.slice(1, 8).forEach((day) => {
      const date = new Date(day.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      dailyForecasts.push({
        date: dateKey,
        day: dayNames[date.getDay()],
        temp_min: Math.round(day.temp.min),
        temp_max: Math.round(day.temp.max),
        weather: day.weather[0],
        humidity: day.humidity,
        wind_speed: day.wind_speed,
        pop: day.pop,
      });
    });

    return dailyForecasts;
  }
}

export const weatherAPI = new WeatherAPI();
