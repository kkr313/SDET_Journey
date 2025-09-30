// Service Worker for SDET Journey PWA
const CACHE_NAME = 'sdet-journey-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/icon-192x192.png',
  '/assets/data/agile-methodology.md',
  '/assets/data/api-testing.md',
  '/assets/data/ci-cd-pipelines.md',
  '/assets/data/code-interview.md',
  '/assets/data/getting-started.md',
  '/assets/data/manual-concepts.md',
  '/assets/data/test-automation-frameworks.md'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});