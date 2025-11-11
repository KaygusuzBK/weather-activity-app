import type { City } from '../data/popular-cities';

const FAVORITES_KEY = 'weather-app-favorites';
const RECENT_CITIES_KEY = 'weather-app-recent-cities';
const MAX_RECENT_CITIES = 5;

/**
 * Favori şehirleri LocalStorage'dan alır
 */
export function getFavorites(): City[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Favori şehirleri LocalStorage'a kaydeder
 */
export function saveFavorites(favorites: City[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Favoriler kaydedilemedi:', error);
  }
}

/**
 * Favori şehir ekler
 */
export function addFavorite(city: City): void {
  const favorites = getFavorites();
  if (!favorites.find(f => f.name === city.name && f.country === city.country)) {
    favorites.push(city);
    saveFavorites(favorites);
  }
}

/**
 * Favori şehir çıkarır
 */
export function removeFavorite(city: City): void {
  const favorites = getFavorites().filter(
    f => !(f.name === city.name && f.country === city.country)
  );
  saveFavorites(favorites);
}

/**
 * Şehrin favori olup olmadığını kontrol eder
 */
export function isFavorite(city: City): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.name === city.name && f.country === city.country);
}

/**
 * Son görüntülenen şehirleri alır
 */
export function getRecentCities(): City[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENT_CITIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Son görüntülenen şehir ekler
 */
export function addRecentCity(city: City): void {
  if (typeof window === 'undefined') return;
  
  try {
    let recent = getRecentCities();
    // Aynı şehri kaldır (varsa)
    recent = recent.filter(
      c => !(c.name === city.name && c.country === city.country)
    );
    // En başa ekle
    recent.unshift(city);
    // Maksimum sayıyı koru
    recent = recent.slice(0, MAX_RECENT_CITIES);
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recent));
  } catch (error) {
    console.error('Son görüntülenen şehir kaydedilemedi:', error);
  }
}

/**
 * Son görüntülenen şehir çıkarır
 */
export function removeRecentCity(city: City): void {
  if (typeof window === 'undefined') return;
  
  try {
    const recent = getRecentCities().filter(
      c => !(c.name === city.name && c.country === city.country)
    );
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recent));
  } catch (error) {
    console.error('Son görüntülenen şehir silinemedi:', error);
  }
}

