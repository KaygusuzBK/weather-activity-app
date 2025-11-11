'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CurrentWeather } from '../types/weather';

interface NotificationSettings {
  enabled: boolean;
  temperatureAlerts: boolean;
  rainAlerts: boolean;
  weatherChanges: boolean;
}

const STORAGE_KEY = 'weather-notification-settings';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    temperatureAlerts: true,
    rainAlerts: true,
    weatherChanges: false,
  });

  useEffect(() => {
    // Tarayıcı desteğini kontrol et
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Kaydedilmiş ayarları yükle
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch {
          // Hatalı veri, varsayılan ayarları kullan
        }
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }

    return false;
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [settings]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window) || !settings.enabled || permission !== 'granted') {
      return;
    }

    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }, [settings.enabled, permission]);

  const checkWeatherAlerts = useCallback((weather: CurrentWeather, previousWeather?: CurrentWeather) => {
    if (!settings.enabled || permission !== 'granted') return;

    const temp = weather.main.temp;
    const weatherMain = weather.weather[0]?.main.toLowerCase() || '';
    const isRaining = weatherMain.includes('rain');

    // Sıcaklık uyarıları
    if (settings.temperatureAlerts) {
      if (temp < 0) {
        sendNotification('❄️ Aşırı Soğuk Hava', {
          body: `Sıcaklık ${temp}°C. Çok kalın giyinmeyi unutmayın!`,
          tag: 'temperature-alert',
        });
      } else if (temp > 35) {
        sendNotification('🔥 Aşırı Sıcak Hava', {
          body: `Sıcaklık ${temp}°C. Güneş koruması kullanın ve bol su için!`,
          tag: 'temperature-alert',
        });
      }
    }

    // Yağmur uyarıları
    if (settings.rainAlerts && isRaining) {
      sendNotification('🌧️ Yağmur Uyarısı', {
        body: 'Yağmur yağıyor. Şemsiye veya yağmurluk almayı unutmayın!',
        tag: 'rain-alert',
      });
    }

    // Hava durumu değişiklikleri
    if (settings.weatherChanges && previousWeather) {
      const prevMain = previousWeather.weather[0]?.main.toLowerCase() || '';
      const currentMain = weather.weather[0]?.main.toLowerCase() || '';
      
      if (prevMain !== currentMain) {
        sendNotification('🌤️ Hava Durumu Değişti', {
          body: `Hava durumu ${previousWeather.weather[0]?.description} → ${weather.weather[0]?.description}`,
          tag: 'weather-change',
        });
      }

      const tempDiff = Math.abs(temp - previousWeather.main.temp);
      if (tempDiff > 5) {
        sendNotification('🌡️ Sıcaklık Değişimi', {
          body: `Sıcaklık ${tempDiff > 0 ? 'arttı' : 'azaldı'} ${Math.round(tempDiff)}°C`,
          tag: 'temperature-change',
        });
      }
    }
  }, [settings, permission, sendNotification]);

  return {
    permission,
    settings,
    requestPermission,
    updateSettings,
    sendNotification,
    checkWeatherAlerts,
  };
}

