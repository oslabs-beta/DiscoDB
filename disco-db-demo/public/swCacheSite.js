//public/sw.js

const cacheName = 'my-site-cache-v2';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
});


self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheAllowlist = [cacheName];

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
  console.log('Fetch event for ', event.request);
  event.respondWith(
    fetch(event.request)
    .then(response => {
      //Make clone of response
      const resClone = response.clone();
      //Open cache
      caches
        .open(cacheName)
        .then(cache => {
          //Add response to cache
          cache.put(event.request, resClone);
        })
        return response;
    })
    .catch((err) => caches.match(event.request).then(response => response)))
});

// self.addEventListener('fetch', event => {
//   console.log('Fetch event for ', event.request.url);
//   event.respondWith(
//     caches.match(event.request)
//     .then(response => {
//       if (response) {
//         console.log('Found ', event.request.url, ' in cache');
//         return response;
//       }
//       console.log('Network request for ', event.request.url);
//       return fetch(event.request)
//       .then(response => {
//         return caches.open(staticCacheName).then(cache => {
//           cache.put(event.request.url, response.clone());
//           return response;
//         });
//       });
//     }).catch(error => {
//     })
//   );
// });