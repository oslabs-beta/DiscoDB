import { discoConnect } from './idbOperations';
import { discoSyncToServer } from './backgroundSync.js';
import { discoSyncOffline, discoSyncOnline } from './discoSync.js';
import { onlineUrlStoreMap, onlineUrlStoreMap, dbGlobals } from '.discoGlobals.js';

const cacheName = 'my-site-cache-v3';

// const config = {
//   onlineRoutes: [ 
//     { url: 'http://localhost:3000/user/load',
//       store : 'notesStore' 
//     },
//   ],
//   offlineRoutes: [ 
//     { url: 'http://localhost:3000/user/load',
//       store : 'notesStore' 
//     },
//     { url: 'http://localhost:3000/user/notes',
//       store: 'notesStore'
//     },
//   ]
// }

// // using map
// const onlineUrlStoreMap = new Map();
// config.onlineRoutes.forEach(el => {
//   onlineUrlStoreMap.set(el.url, el.store);
// });

// const offlineUrlStoreMap = new Map();
// config.offlineRoutes.forEach(el => {
//   offlineUrlStoreMap.set(el.url, el.store);
// });

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  self.skipWaiting();
  console.log('opening DB since sw is activated')
  discoConnect();
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
      )
    })
  );
  //Force SW to become available to all pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  //clone the request so that the body of the request will still be available
  const reqClone = event.request.clone();
  const { url, method } = event.request;
  event.respondWith(
    fetch(event.request)
    .then( (response) => {
      // Make clone of response
      const resCloneCache = response.clone();
      const resCloneDB = response.clone()
      //Open cache
      caches
        .open(cacheName)
        .then(cache => {
          //Add response to cache
          cache.put(event.request, resCloneCache);
        })      
      //invoke online reducer to populate indexedDB
      if (onlineUrlStoreMap.has(url)){
        discoSyncOnline(method, url, onlineUrlStoreMap.get(url), resCloneDB);  
      }
      return response;
    })
    // if network is unavailable
    .catch((err) => {
      console.log('this is DB in catch block: ', dbGlobals.DB);
      //invoke offline reducer to perform RUD functions to indexedDB
      // if (urlArr.includes(url))
      if (offlineUrlStoreMap.has(url)){
        return discoSyncOffline(method, url, offlineUrlStoreMap.get(url), reqClone); 
      }
    })
  )
});

//When back online, listener will be invoked.
//WaitUntil: waits for service workers until promise resolves
  //Then invoke syncData
self.addEventListener('sync', (event) => {
  if(event.tag === 'failed_requests'){
    event.waitUntil(discoSyncToServer())
  };
});
