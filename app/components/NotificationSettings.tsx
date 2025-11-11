'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationSettings() {
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={handleToggle}
          className="p-3 rounded-full shadow-lg transition-all hover:scale-110"
          style={{
            backgroundColor: settings.enabled ? '#809A6F' : 'rgba(128, 154, 111, 0.3)',
            color: settings.enabled ? '#D5D8B5' : '#2C2C2C',
          }}
          title={settings.enabled ? 'Bildirimleri Kapat' : 'Bildirimleri Aç'}
        >
          {settings.enabled ? (
            <Bell className="w-5 h-5" />
          ) : (
            <BellOff className="w-5 h-5" />
          )}
        </button>

        {permission === 'denied' && (
          <div className="absolute bottom-full right-0 mb-2 p-2 rounded-lg text-xs whitespace-nowrap" style={{ backgroundColor: '#A25B5B', color: '#D5D8B5' }}>
            Bildirimler engellenmiş. Tarayıcı ayarlarından açın.
          </div>
        )}
      </div>
    </div>
  );
}

