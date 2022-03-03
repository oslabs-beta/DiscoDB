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
    .catch((err) => {
      caches.match(event.request)
        .then(response => {
          return response})
    }
  ))
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

self.addEventListener('sync', (event) => {
  if(event.tag === 'save_data'){
    event.waitUntil(syncDataToServer());
  }
});


let db;
function accessIndexedDb (data) {
  //Create DB if doesn't exist, otherwise access it.
  const request = indexedDB.open('myDatabase')
  //Error handling
  request.onerror = (event) => {
    console.log('Error in creating DB');
  }
  // request.onupgradeneeded = () => {
  //   console.log('Created new object store')
  //   request.createObjectStore('patch-request', {autoIncrement: true, keyPath: 'id'})
  //   //create indexes in new object store
  //   // store.createIndex('username', 'username', {unique: false});
  //   // store.createIndex('_id', '_id', {unique: true});
  //   // store.createIndex('title', 'title', {unique: false});
  //   // store.createIndex('content', 'content', {unique: false});
  //   // store.createIndex('createdAt', 'createdAt', {unique: false});
  //   // store.createIndex('updatedAt', 'updatedAt', {unique: false});
  //  }
  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('inside idb')
    addData(db, data);
  }
}

self.addEventListener('message', (event) => {
  console.log('patch note data', event.data.patchNote)
  if(event.data.hasOwnProperty('patchNote')){
    patchNote = event.data.patchNote
    accessIndexedDb(patchNote);
  }
})
function accessObjectStore (storeName, method) {
  // const transaction = db.transaction([storeName], method);
  // const objectStore = transaction.objectStore(storeName);
  return db.transaction([storeName], method).objectStore(storeName)
}
function addData (db, data) {
  //Open a transaction into store 'patch-request' 
  const transaction = db.transaction(['patch_request'], 'readwrite');
  const objectStore = transaction.objectStore('patch_request');
  objectStore.add({url: '/user/notes', payload: data, method: 'PATCH'})
  // console.log('idb request', request)
  //objectStore.put({key:value})
}

function syncDataToServer() {
  console.log('inside syncdata')
  // const transaction = db.transaction(['patch_request'], 'readwrite');
  // const objectStore = transaction.objectStore('patch_request');
  const store = accessObjectStore('patch_request', 'readwrite');
  const request = store.getAll();
  request.onsuccess = async function (event) {
    const failedRequests = event.target.result;
    //comes back as an objs in array. 
    // console.log(failedRequests)
    failedRequests.forEach((data) => {
      const url = data.url;
      const method = data.method;
      const body = JSON.stringify(data.payload)
      const headers = {'Content-Type': 'application/json'};
      fetch(url, {
        method: method,
        headers: headers,
        body: body
      })
      .then((res) => res.json())
      .then((res) => {
        const newStore = accessObjectStore('patch_request', 'readwrite');
        newStore.delete(data.id);
      })
      .catch((error) => {
        console.error('Failed to sync data to server:', error);
        throw error
      })
    })
  }

}