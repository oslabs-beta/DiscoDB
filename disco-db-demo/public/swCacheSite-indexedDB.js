//public/sw.js
//importScripts('https://cdn.jsdelivr.net/npm/dexie@3.2.1/dist/dexie.min.js');
import { openDB, dbAdd, dbDeleteAll, dbGlobals } from './indexedDB.js';
// const { version, databaseName, storeName, keyPath } = dbGlobals;
// let { DB } = dbGlobals;
// import { dbGlobals } from './dbGlobals.js';
// import { testObj, testFunc } from './testImport.js';
// let testObjCopy = testObj.test;

const cacheName = 'my-site-cache-v3';
//added from Young Min's file
let DB;

const version = 7;
const databaseName = 'notesDB';
const storeName = 'notesStore';
const failed_requests = 'failed_requests';
const keyPath = '_id';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  self.skipWaiting();
  console.log('opening DB since sw is activated')
        openDB();
        DB = dbGlobals.DB;
        console.log('DB: ', DB)
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
      .then( (arr) => {
        // //open DB when sw is activated
        // console.log('opening DB since sw is activated')
        // openDB();
        // DB = dbGlobals.DB;
        // console.log('DB: ', DB)
      })
    })
  );
  //Force SW to become available to all pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request);

  event.respondWith(
    // console.log('inside event.respondWith')
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
        if (event.request.method === 'GET' && event.request.url === "http://localhost:3000/user/load") {
          resCloneDB.json().then(data => {
            console.log('this is the rescloneDB: ', data)
            console.log('retrieving value of DB:', dbGlobals.DB);
            DB = dbGlobals.DB
            // // test import
            // console.log('testing import')
            // console.log('current value of testObj.test: should be false ', testObjCopy)
            // console.log('return value for testFunc: ', testFunc(true))
            // console.log('new value of testObj.test: should be true ', testObjCopy)
            // console.log(testFunc());
            //delete existing indexedDB data
            if (DB) {
              console.log('invoking dbDeleteALL in if')
              dbDeleteAll();
            } else {
              openDB( () => {
                console.log('invoking dbDeleteALL in else')
                dbDeleteAll();
              })
            }
            //populate indexedDB here
            data.data.forEach( note => {
              console.log('this is the note object: ', note);
              if (DB) {
                console.log('invoking dbAdd in if')
                dbAdd(note);
              } else {
                console.log('invoking dbAdd in else')
                openDB( () => {
                  dbAdd(note);
                })
              }
            })
          })
        }
        return response;
    })
    // if network is unavailable
    .catch((err) => {
      // intercept network request and store to indexedDB (background-sync?)
      // concurrently, start making local changes to indexedDB
      console.log('Network is unavailable, heading into catch block')
      console.log('method: ',event.request.method);
      console.log('url: ', event.request.url);
      if (event.request.method === 'DELETE' && event.request.url === "http://localhost:3000/user/load"){
         console.log('Intercepting server request to load user notes');

      }
      return caches.match(event.request)
      .then(response => response)
    }))
});


//When back online, listener will be invoked.
//WaitUntil: waits for service workers until promise resolves
  //Then invoke syncData
  self.addEventListener('sync', (event) => {
    if(event.tag === 'failed_requests'){
      event.waitUntil(syncDataToServer())
    };
  });


//Listens to when postMessage() is invoked in components and passes the received data into corresponding functions
self.addEventListener('message', (event) => {
  if(event.data.hasOwnProperty('patchNote')){
    const patchNote = event.data.patchNote
    patchData(patchNote);
  }
  if(event.data.hasOwnProperty('deleteNote')){
    const deleteNote = event.data.deleteNote
    deleteData(deleteNote);
  }
  if(event.data.hasOwnProperty('postNote')){
    const postNote = event.data.postNote
    postData(postNote);
  }
});

//Function to Access specific object store in IDB database and start a transaction
function accessObjectStore (storeName, method) {
  return DB.transaction([storeName], method).objectStore(storeName)
};


function patchData (data) {
  //Open a transaction into store 'failed-requests' 
  //Saves the persisting data in payload key
  //URL and method to match type of request
  const store = accessObjectStore(failed_requests, 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'PATCH'})
}

function deleteData (data) {
  //Open a transaction into store 'failed-requests' 
  const store = accessObjectStore(failed_requests, 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'DELETE'})
}

function postData (data) {
  //Open a transaction into store 'failed-requests' 
  const store = accessObjectStore(failed_requests, 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'POST'})
}


// //open Database
function openDB (callback) {
  let req = indexedDB.open(databaseName, version);
  req.onerror = (err) => {
    //could not open db
    console.log('Error: ', err);
    DB = null;
  };
  req.onupgradeneeded = (event) => {
    console.log('db upgraded');
    let db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, {
        keyPath: keyPath,
      });
    }
    if (!db.objectStoreNames.contains(failed_requests)) {
      console.log('Creating failed_request store')
      db.createObjectStore(failed_requests, {
        keyPath: 'id', autoIncrement: true,
      })
    }
  };

  req.onsuccess = (event) => {
    DB = event.target.result;
    //dbDeleteAll();
    console.log('db opened', DB);
    if (callback) {
      callback();
    }
  };
};

// function dbAdd(dataObject) {
//   if (dataObject && DB) {
//     let tx = DB.transaction(storeName, 'readwrite');
//     tx.onerror = (err) => {
//       console.log('failed transaction');
//     };
//     tx.oncomplete = (event) => {
//       console.log('data saved successfully');
//     };
//     let store = tx.objectStore(storeName);
//     let req = store.put(dataObject);

//     req.onsuccess = (event) => {
//       //will trigger tx.oncomplete next
//     };
//   } else {
//     console.log('no data was provided');
//   }
// }

// function dbDeleteAll() {
//   if (DB) {
//     let tx = DB.transaction(storeName, 'readwrite');
//     tx.onerror = (err) => {
//       console.log('failed transaction');
//     };
//     tx.oncomplete = (event) => {
//       console.log('transaction success');
//     };
//     let store = tx.objectStore(storeName);
//     const req = store.clear();
//     req.onsuccess = (event) => {
//       //will trigger tx.oncomplete
//     };
//   } else {
//     console.log('DB is closed');
//   }
// }

// async function dbQuery(username) {
//   const someFriends = await db.notes
//   .where('username').equals(username).toArray();
//   return console.log('here is the data: ', someFriends);
// }

//Function to sync offline requests to database when client is back online
function syncDataToServer() {
  //Create transaction to object store and grab all objects in an ordered array by ID.
  const store = accessObjectStore(failed_requests, 'readwrite');
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
        const newStore = accessObjectStore(failed_requests, 'readwrite');
        newStore.delete(data.id);
      })
      .catch((error) => {
        console.error('Failed to sync data to server:', error);
        throw error
      })
    });
  }
}
