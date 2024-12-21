// public/service-worker.js

const CACHE_NAME = 'vite-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  // Add any other assets to be cached
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Fetch from Cache or Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache if available
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache the response if it's an image
        if (event.request.destination === 'image') {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Fallback logic for offline or failed requests can be added here
      console.error('Fetch failed for:', event.request.url);
    })
  );
});

// Activate Service Worker and Clean Old Cache
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
