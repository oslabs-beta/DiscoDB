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
  if(event.tag === 'save-data'){
    event.waitUntil(logHello());
  }
});

function logHello () {
  return console.log('hello')
}

function offlineSaveData(event){
    const noteTitle = document.querySelector('[name="noteTitle"]');
    const noteContent = document.querySelector('[name="noteContent"]');
//Access indexedDB with mongodb ID
//grab updated info and send to mongodb

    const saveBody = {
      //grab id from query params
      // _id: props.noteID,
      title: noteTitle.value,
      content: noteContent.value,
      updatedAt: Date.now(),
    }
    
    const testURL = '/api/hello';
    const devURL = '/user/notes';
    fetch(devURL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveBody),
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success in saving offline', data);
      //what do we do here on successful note update?
      props.setRefresh(true);
    })
    .catch(err => console.log('Error in saving offline', err))
}

function accessIndexedDb (data) {
  let db;
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
    getData(db, data);
  }
}

self.addEventListener('message', (event) => {
  console.log('patch note data', event.data.patchNote)
  if(event.data.hasOwnProperty('patchNote')){
    patchNote = event.data.patchNote
    accessIndexedDb(patchNote);
  }
})

function getData (db, data) {
  //Open a transaction into store 'patch-request' 
  const transaction = db.transaction(['patch_request'], 'readwrite');
  const objectStore = transaction.objectStore('patch_request');
  console.log('data passed by postmessage', data)
  objectStore.add({url: '/user/notes', payload: data, method: 'PATCH'})
  // console.log('idb request', request)
  //objectStore.put({key:value})
}