import { discoConnect } from './idbOperations.js';
import { discoSyncToServer } from './backgroundSync.js';
import { discoSyncOffline, discoSyncOnline } from './discoSync.js';
import { onlineUrlArr, offlineUrlArr, dbGlobals, idbPromise } from './discoGlobals.js';


const cacheName = 'my-site-cache-v3';

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
      if (onlineUrlArr.includes(url)){
        discoSyncOnline(method, url, resCloneDB);  
      }
      return response;
    })
    // if network is unavailable
    .catch((err) => {
      //invoke offline reducer to perform RUD functions to indexedDB
      if (offlineUrlArr.includes(url)){
        return discoSyncOffline(method, url, reqClone); 
      }
      return caches.match(reqClone)
      .then(response => {
        return response
      })
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
