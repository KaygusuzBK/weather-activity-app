// Service Worker for PWA support with optimized API caching
const CACHE_NAME = 'weather-app-v3';
const API_CACHE_NAME = 'weather-api-v2';
const API_CACHE_TTL = 10 * 60 * 1000; // 10 dakika
const MAX_API_CACHE_SIZE = 50; // Maksimum cache sayısı

const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.png',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Cache boyutunu sınırla
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    const toDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(toDelete.map(key => cache.delete(key)));
  }
}

// Cache'in geçerliliğini kontrol et
function isCacheValid(cachedResponse) {
  const cachedDate = cachedResponse.headers.get('sw-cache-date');
  if (!cachedDate) return false;
  const age = Date.now() - parseInt(cachedDate);
  return age < API_CACHE_TTL;
}

// Fetch event - network-first strategy for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Sadece GET isteklerini cache'le
  if (request.method !== 'GET') {
    return;
  }

  // API requests - network-first with cache fallback and TTL
  if (url.hostname === 'api.openweathermap.org' || 
      url.hostname === 'ipapi.co' || 
      url.hostname === 'ip-api.com') {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then(async (response) => {
          if (!response.ok) return response;

          // Clone ve cache'e kaydet
          const responseToCache = response.clone();
          const cache = await caches.open(API_CACHE_NAME);
          
          // Timestamp ekle
          const headers = new Headers(responseToCache.headers);
          headers.append('sw-cache-date', Date.now().toString());
          
          const modifiedResponse = new Response(await responseToCache.blob(), {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers
          });
          
          await cache.put(request, modifiedResponse);
          await trimCache(API_CACHE_NAME, MAX_API_CACHE_SIZE);
          
          return response;
        })
        .catch(async () => {
          // Network başarısız, cache'den dene
          const cachedResponse = await caches.match(request);
          if (cachedResponse && isCacheValid(cachedResponse)) {
            return cachedResponse;
          }
          
          // Geçersiz veya yok, hata döndür
          return new Response(
            JSON.stringify({ error: 'Network error and no valid cache available' }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // Static assets - cache-first strategy
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request).then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
            
            return response;
          });
        })
    );
  }
});
