//public/sw.js
//importScripts('https://cdn.jsdelivr.net/npm/dexie@3.2.1/dist/dexie.min.js');
import { openDB, dbAdd, dbDeleteAll, addToSyncQueue, syncDataToServer, dbGetAll, dbGlobals } from './indexedDB.js';
// const { version, databaseName, storeName, keyPath } = dbGlobals;
// let { DB } = dbGlobals;
// import { dbGlobals } from './dbGlobals.js';
// import { testObj, testFunc } from './testImport.js';
// let testObjCopy = testObj.test;

const cacheName = 'my-site-cache-v3';
//added from Young Min's file
let DB;

// const version = 7;
// const databaseName = 'notesDB';
// const storeName = 'notesStore';
// const failed_requests = 'failed_requests';
// const keyPath = '_id';

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
    })
  );
  //Force SW to become available to all pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  //console.log('Fetch event for ', event.request);
  const reqClone = event.request.clone();
  // console.log('Fetch event for ', event.request);
  const bodyClone = event.request.clone();
  const { url, method } = event.request;

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
        if (method === 'GET' && url === "http://localhost:3000/user/load") {
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
              dbDeleteAll();
            } else {
              openDB( () => {
                dbDeleteAll();
              })
            }
            //populate indexedDB here
            data.data.forEach( note => {
              // console.log('this is the note object: ', note);
              if (DB) {
                dbAdd(note);
              } else {
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
      console.log('this is DB Globals in catch block: ', dbGlobals.DB);

      //refactor DB - make it promise based
      DB = dbGlobals.DB

      // intercept network request and store to indexedDB (background-sync?)
      // concurrently, start making local changes to indexedDB
      console.log('Network is unavailable, heading into catch block')
      console.log('is the req Clone available in catch block? ', reqClone);

      if (event.request.method === 'GET' && event.request.url === "http://localhost:3000/user/load"){
        console.log('Intercepting server request to load user notes');
        //get all the data from indexedDB and serve custom response to the client
        if (DB) {
          dbGetAll().then((data) => {
            const responseBody = {data: data};
            const IDBData = new Response(JSON.stringify(responseBody));
            return IDBData;
          })
        } else {
          openDB( () => {
            console.log('invoking dbGetAll in else')
            dbGetAll().then((data) => {
              const responseBody = {data: data};
              const IDBData = new Response(JSON.stringify(responseBody));
              return IDBData;
            });
          })
        }

      }
      if(method === 'DELETE' && url === "http://localhost:3000/user/notes"){
        bodyClone.json()
          .then((data) => {
            const reqBody = {
              url: url,
              method: method,
              body: data
            };
            backgroundSync();
            addToSyncQueue(reqBody);
            //call function to DELETE note
          })
      }
      if(method === 'PATCH' && url === "http://localhost:3000/user/notes"){
        bodyClone.json()
          .then((data) => {
            const reqBody = {
              url: url,
              method: method,
              body: data
            };
            backgroundSync();
            addToSyncQueue(reqBody);
            //call function to UPDATE note
          })
      }

      //POST request is for future stretch feature. Allowing a user to create new entries while offline
      //This will take some modification to the existing database to work correctly
      if(method === 'POST' && url === "http://localhost:3000/user/notes"){
        bodyClone.json()
          .then((data) => {
            const reqBody = {
              url: url,
              method: method,
              body: data
            };
            backgroundSync();
            addToSyncQueue(reqBody);
          })
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


  //When invoked, checks if service workers have been registered and ready.
  //Then it will register a sync event under 'failed_requests' tag.
  function backgroundSync() {
    registration.sync.register('failed_requests')
      .then(() => {
        return console.log('Sync event registered')
        })
      .catch(() => {
          return console.log('Unable to register sync event')
      })
  }
