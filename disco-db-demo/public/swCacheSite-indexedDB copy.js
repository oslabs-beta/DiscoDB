//public/sw.js
//importScripts('https://cdn.jsdelivr.net/npm/dexie@3.2.1/dist/dexie.min.js');
import { openDB, dbAdd, dbDeleteAll, addToSyncQueue, syncDataToServer, dbGetAll, dbDeleteOne, dbUpdateOne, dbGlobals } from './indexedDB.js';


const cacheName = 'my-site-cache-v3';

let DB;

const config = {
  routes: [ 
    { url: 'http://localhost:3000/user/load',
      store : 'notesStore' 
    },
    { url: 'http://localhost:3000/user/notes',
      store: 'notesStore'
    },
  ]
}

// generate arrays of url and store 
const urlArr = [];
config.routes.forEach(el => {
  urlArr.push(el.url);
});

const storeArr = [];
config.routes.forEach(el => {
  storeArr.push(el.store);
});


self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  self.skipWaiting();
  console.log('opening DB since sw is activated')
        openDB().then(data => DB = data);
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

      requestReducerOnline(method, url, event.request, resCloneDB); // Eric: figure out how best to pass store into this reducer. Match parameters to the offline reducer. Look at catch block 
      return response;
    })
    // if network is unavailable
    .catch((err) => {
      console.log('this is DB in catch block: ', DB);
      //invoke offline reducer to perform RUD functions to indexedDB
      if (urlArr.includes(url))
       return requestReducerOffline(method, url, store, reqClone); // Eric: figure out how best to pass store into this reducer
    })
  )
});


//When back online, listener will be invoked.
//WaitUntil: waits for service workers until promise resolves
  //Then invoke syncData
self.addEventListener('sync', (event) => {
  if(event.tag === 'failed_requests'){
    event.waitUntil(syncDataToServer())
  };
});


// //When invoked, checks if service workers have been registered and ready.
// //Then it will register a sync event under 'failed_requests' tag.
// function backgroundSync() {
//   registration.sync.register('failed_requests')
//     .then(() => {
//       return console.log('Sync event registered')
//       })
//     .catch(() => {
//         return console.log('Unable to register sync event')
//     })
// }


//create a request reducer - online
function requestReducerOnline(method, url, eventRequest, clonedResponse) {
  switch(url) {
    case 'http://localhost:3000/user/load':
      switch(method) {
        case 'GET':
          const resCloneDB = clonedResponse;
          resCloneDB.json().then(data => {
            console.log('this is the rescloneDB: ', data)
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
              console.log('this is the note object: ', note);
              if (DB) {
                dbAdd(note);
              } else {
                openDB( () => {
                  dbAdd(note);
                })
              }
            })
            console.log('returning eventresponse after adding all notes into IndexedDB');
          });

        default:
          console.log('this method is not configured');
          break;
      }
    default:
      console.log('this is the online eventResponse: ', eventRequest);
      break;
  }
}

// if (url === x && method: GET)

//url
  //GET
    //requestReducerOfflineGET(url)
  //DELETE
    //requestReducerOfflineDELETE(url)
  //PATCH
    //requestReducerOfflinePATCH(url)

//config object
// {
// url:'',
// method:''
// }



//      GET method at URL
// else if (url === x && method: DELETE)
// function requestReducerOfflineDELETE(url, data)
//      DELETE method at URL
// else if (url === x && method: PATCH)
// function requestReducerOfflinePATCH(url, data)
//      PATCH method at URL

//create a request reducer - offline
function requestReducerOffline(method, url, eventRequest, eventResponse) {
  switch(url) {
    case 'http://localhost:3000/user/load':
      switch(method) {
        case 'GET':
          if (DB) {
            return dbGetAll().then((data) => {
              //REVISIT THIS, make sure to change data back to data!!
              const responseBody = { data };
              console.log('this is the response body inside the request reducer function: ');
              console.log({responseBody});
              const IDBData = new Response(JSON.stringify(responseBody));
              return IDBData;
            })
          } else {
            return openDB( () => {
              console.log('invoking dbGetAll in else')
              dbGetAll().then((data) => {
                const responseBody = {data: data};
                const IDBData = new Response(JSON.stringify(responseBody));
                return IDBData;
              });
            })
          }
        default:
          console.log('this method is not configured');
          break;
      }
    case 'http://localhost:3000/user/notes':
      switch(method) {
        case 'DELETE':
          return eventRequest.json()
          .then((data) => {
            const reqBody = {
              url: url,
              method: method,
              body: data
            };
            console.log('this is the delete data object when network fails: ', data);
            backgroundSync();
            addToSyncQueue(reqBody);

            const id = data._id;
            //call function to DELETE note
            dbDeleteOne(id);
            const deleteResponse = new Response(JSON.stringify({}));
            console.log({ deleteResponse });
            return deleteResponse;
          })
          .catch( err => {
            console.log('this is in the dbDeleteOne catch block: ', err);
          })
        case 'PATCH':
          return eventRequest.json()
          .then((data) => {
            const reqBody = {
              url: url,
              method: method,
              body: data
            };
            backgroundSync();
            addToSyncQueue(reqBody);
            //call function to UPDATE note
            const id = data._id;
            console.log('this is the data sent to dbUpdateOne: ', data);
            dbUpdateOne(data);

            // returns empty object to trigger rerender in our app 
            // assumes developer does not want to do anything with the response
            const patchResponse = new Response(JSON.stringify({}));
            console.log({ patchResponse });
            return patchResponse;
          })
        default:
          console.log('this method in /user/notes is not configured')
      } 
    default:
      console.log('this url is not configured');
      return caches.match(eventRequest)
        .then(response => {
          console.log('-----------this is in the caches response block: ', eventRequest);
          return response
        })
  }
}