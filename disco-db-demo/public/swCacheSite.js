//public/sw.js
importScripts('https://cdn.jsdelivr.net/npm/dexie@3.2.1/dist/dexie.min.js')

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
    // console.log('inside event.respondWith')
    fetch(event.request)
    .then(response => {
      // indexedDB logic
      if (event.request.method === 'GET' && event.request.url === "http://localhost:3000/user/load"){
        
        console.log('logging response : ', response);
        console.log('Intercepting server request to load user notes');
        const db = new Dexie('myTestDatabase');
          db.version(1).stores({
            notes: '++id, _id',
          });
        async function dexieTest(_id) {
          const id = await db.notes.add({
            _id
          })
          return console.log('data added sucessfully', id);
        }
        dexieTest('test1')
    }
      // Make clone of response
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
    // if network is unavailable
    .catch((err) => {
      // intercept network request and store to indexedDB (background-sync?)
      // concurrently, start making local changes to indexedDB
      console.log('Network is unavailable, heading into catch block')
      console.log('method: ',event.request.method);
      console.log('url: ', event.request.url);
      if (event.request.method === 'GET' && event.request.url === "http://localhost:3000/user/load"){
         console.log('Intercepting server request to load user notes');

      }
      return caches.match(event.request)
      .then(response => response)
    }))
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

