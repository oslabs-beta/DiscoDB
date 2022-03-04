//public/sw.js

const cacheName = 'my-site-cache-v2';
//Variable to connect to indexedDB
let db;

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
  // console.log('Fetch event for ', event.request);
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
      return caches.match(event.request)
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

//When back online, listener will be invoked.
//WaitUntil: waits for service workers until promise resolves
  //Then invoke syncData
self.addEventListener('sync', (event) => {
  if(event.tag === 'failed_requests'){
    event.waitUntil(syncDataToServer())
      // .catch((err) => {
      //   //Client browser will retry failed syncs for a certain # of times
      //   //Once met, lastChance updated to true and will stop auto-syncing attempts
      //   if(event.lastChance){
      //     console.log('Maximum sync retrys failed');
      //   }
      //   throw err
      // }));
  }
});

//Listens to when postMessage() is invoked in components and passes the received data into corresponding functions
self.addEventListener('message', (event) => {
  if(event.data.hasOwnProperty('patchNote')){
    patchNote = event.data.patchNote
    patchData(patchNote);
  }
  if(event.data.hasOwnProperty('deleteNote')){
    deleteNote = event.data.deleteNote
    deleteData(deleteNote);
  }
  if(event.data.hasOwnProperty('postNote')){
    postNote = event.data.postNote
    postData(postNote);
  }
});

//Create connection with IDB
function connectIndexedDb () {
  //Create DB if doesn't exist, otherwise access it.
  const request = indexedDB.open('myDatabase')
  //Error handling
  request.onerror = (event) => {
    console.log('Error in creating DB');
  }
  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Connected to IndexedDB')
  }
}
//Start connection to IDB
connectIndexedDb();

//Function to Access specific object store in IDB database and start a transaction
function accessObjectStore (storeName, method) {
  return db.transaction([storeName], method).objectStore(storeName)
};

function patchData (data) {
  //Open a transaction into store 'failed-requests' 
  //Saves the persisting data in payload key
  //URL and method to match type of request
  const store = accessObjectStore('failed_requests', 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'PATCH'})
}

function deleteData (data) {
  //Open a transaction into store 'failed-requests' 
  const store = accessObjectStore('failed_requests', 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'DELETE'})
}

function postData (data) {
  //Open a transaction into store 'failed-requests' 
  const store = accessObjectStore('failed_requests', 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'POST'})
}

//Function to sync offline requests to database when client is back online
function syncDataToServer() {
  //Create transaction to object store and grab all objects in an ordered array by ID.
  const store = accessObjectStore('failed_requests', 'readwrite');
  const request = store.getAll();

  request.onsuccess = async function (event) {
    const failedRequests = event.target.result;
    //Comes back as an array of objects 
    //Iterate through saved failed HTTP requests and creates a format to recreate a Fetch Request.
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
        //Previous transaction was closed due to getAll()
        //Reopen object store and delete the corresponding object on successful HTTP request
        const newStore = accessObjectStore('failed_requests', 'readwrite');
        newStore.delete(data.id);
      })
      .catch((error) => {
        console.error('Failed to sync data to server:', error);
        throw error
      })
    });
  }

}