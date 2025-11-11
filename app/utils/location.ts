/**
 * IP tabanlı lokasyon tespiti için helper fonksiyonlar
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

/**
 * IP adresine göre lokasyon bilgisi alır
 * ipapi.co ücretsiz API kullanılıyor
 */
export async function getLocationByIP(): Promise<LocationCoordinates> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('IP tabanlı lokasyon alınamadı');
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'IP tabanlı lokasyon alınamadı');
    }
    
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country_name,
    };
  } catch (error) {
    console.error('IP tabanlı lokasyon hatası:', error);
    throw error;
  }
}

