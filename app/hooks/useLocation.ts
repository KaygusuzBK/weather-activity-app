'use client';

import { useState, useEffect } from 'react';
import { getLocationByIP, type LocationCoordinates } from '../utils/location';

interface UseLocationReturn {
  location: LocationCoordinates | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Kullanıcı lokasyonunu tespit eden hook
 * Önce Geolocation API'yi dener, başarısız olursa IP tabanlı lokasyona geçer
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    // Önce Geolocation API'yi dene
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: LocationCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          setLoading(false);
        },
        async (geolocationError) => {
          // Geolocation başarısız, IP tabanlı lokasyona geç
          console.warn('Geolocation hatası:', geolocationError.message);
          
          try {
            const ipLocation = await getLocationByIP();
            setLocation(ipLocation);
            setLoading(false);
          } catch (ipError) {
            setError(
              ipError instanceof Error 
                ? ipError.message 
                : 'Lokasyon tespit edilemedi'
            );
            setLoading(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      // Geolocation desteklenmiyor, direkt IP tabanlı lokasyona geç
      try {
        const ipLocation = await getLocationByIP();
        setLocation(ipLocation);
        setLoading(false);
      } catch (ipError) {
        setError(
          ipError instanceof Error 
            ? ipError.message 
            : 'Lokasyon tespit edilemedi'
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return {
    location,
    loading,
    error,
    retry: fetchLocation,
  };
}

