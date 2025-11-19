'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiBellOff } from 'react-icons/fi';
import { IoNotifications, IoNotificationsOutline } from 'react-icons/io5';
import { useNotifications } from '../hooks/useNotifications';
import AnimatedIcon from './ui/animated-icon';

interface NotificationSettingsProps {
  inline?: boolean;
}

export default function NotificationSettings({ inline = false }: NotificationSettingsProps) {
  const [mounted, setMounted] = useState(false);
  const { permission, settings, requestPermission, updateSettings } = useNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = async () => {
    if (!settings.enabled) {
      const granted = await requestPermission();
      if (granted) {
        updateSettings({ enabled: true });
      }
    } else {
      updateSettings({ enabled: false });
    }
  };

  if (!mounted || typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  // Inline mode - Ayarlar sayfası için (satır formatında)
  if (inline) {
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">Bildirimler</span>
        <div className="shrink-0">
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled 
                ? 'bg-indigo-600 dark:bg-indigo-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  // Fixed button mode - Desktop için (mobilde gizli)
  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={handleToggle}
          className="p-3 rounded-full shadow-lg transition-all hover:scale-110 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20"
          title={settings.enabled ? 'Bildirimleri Kapat' : 'Bildirimleri Aç'}
        >
          <AnimatedIcon hover pulse={settings.enabled}>
            {settings.enabled ? (
              <IoNotifications className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <IoNotificationsOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </AnimatedIcon>
        </button>

        {permission === 'denied' && (
          <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-500 dark:bg-red-600 rounded-lg text-xs text-white whitespace-nowrap shadow-lg">
            Bildirimler engellenmiş
          </div>
        )}
      </div>
    </div>
  );
}

