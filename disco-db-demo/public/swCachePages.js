//public/sw.js

const staticCacheName = 'my-site-cache-v1';
const filesToCache = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/user',
  '/user/notes',
];

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
    .then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheAllowlist = [staticCacheName];

  //Remove unwanted caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)))
});