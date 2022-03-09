import { discoConnect, discoGetAll, discoDeleteOne, discoUpdateOne, discoAdd, discoDeleteAll } from './idbOperations.js';
import { discoAddToQueue, discoRegisterSync } from './backgroundSync.js';
import { idbPromise , dbGlobals } from './discoGlobals.js';

/**
 * @property {Function} discoSyncOffline Executes different IndexedDB logic based on the value of passed in method
 * @param {String} method This is the method property of the intercepted fetch request
 * @param {String} url This is the url property of the intercepted fetch request
 * @param {String} store This is the store property associated with the url provided in the config file
 * @param {Request} eventRequest This is the cloned version of the intercepted fetch request
 *
 */
function discoSyncOffline(method, url, clonedRequest) {
  // assuming store can be managed by config file and imported into indexedDB.js
  // config.store = store
  switch(method) {
    case 'GET':
      if (idbPromise.DB) {
        // if store 
        return discoGetAll().then((data) => {
          //REVISIT THIS, make sure to change data back to data!!
          const responseBody = { data };
          console.log('this is the response body inside the request reducer function: ');
          console.log({responseBody});
          const IDBData = new Response(JSON.stringify(responseBody));
          return IDBData;
        })
      } else {
        return discoConnect( () => {
          console.log('invoking dbGetAll in else')
          discoGetAll().then((data) => {
            const responseBody = {data: data};
            const IDBData = new Response(JSON.stringify(responseBody));
            return IDBData;
          });
        })
      }
    case 'DELETE':
      return clonedRequest.json()
      .then((data) => {
        const reqBody = {
          url: url,
          method: method,
          body: data
        };
        console.log('this is the delete data object when network fails: ', data);
        discoRegisterSync();
        discoAddToQueue(reqBody);
        const keypath = dbGlobals.keypath;
        const id = data[keypath];
        console.log('this is id of dbGlobals.keyPath, ', dbGlobals.keypath);
        //call function to DELETE note
        discoDeleteOne(id);
        const deleteResponse = new Response(JSON.stringify({}));
        console.log({ deleteResponse });
        return deleteResponse;
      })
      .catch( err => {
        console.log('this is in the dbDeleteOne catch block: ', err);
      })
    case 'PATCH':
      return clonedRequest.json()
      .then((data) => {
        const reqBody = {
          url: url,
          method: method,
          body: data
        };
        discoRegisterSync();
        discoAddToQueue(reqBody);
        //call function to UPDATE note
        const keypath = dbGlobals.keypath;
        const id = data[keypath];
        console.log('this is the data sent to dbUpdateOne: ', data);
        discoUpdateOne(data);

        // returns empty object to trigger rerender in our app 
        // assumes developer does not want to do anything with the response
        const patchResponse = new Response(JSON.stringify({}));
        console.log({ patchResponse });
        return patchResponse;
      }) 
    default:
      console.log('this url is not configured');
      return caches.match(clonedRequest)
        .then(response => {
          console.log('-----------this is in the caches response block: ', clonedRequest);
          return response
        })
  }
}

/**
 * @property {Function} discoSyncOnline Establishes connection to indexedDB & create Object Stores as specified in Configuration.
 * @param {String} method This is the method property of the intercepted fetch request
 * @param {String} url This is the url property of the intercepted fetch request
 * @param {String} store This is the store property associated with the url provided in the config file
 * @param {Request} clonedResponse This is the cloned version of the intercepted fetch response
 *
 */
function discoSyncOnline(method, url, clonedResponse) {
  switch(method) {
    case 'GET':
      const resCloneDB = clonedResponse;
      resCloneDB.json().then(data => {
        console.log('this is the rescloneDB: ', data)
        //delete existing indexedDB data
        if (idbPromise.DB) {
          discoDeleteAll();
        } else {
          discoConnect( () => {
            discoDeleteAll();
          })
        }
        //populate indexedDB here
        data.data.forEach( note => {
          console.log('this is the note object: ', note);
          if (idbPromise.DB) {
            discoAdd(note);
          } else {
            discoConnect( () => {
              discoAdd(note);
            })
          }
        })
        console.log('returning eventresponse after adding all notes into IndexedDB');
      });
      break;
    default:
      console.log('this method is not configured');
      break;
  }
}


export { discoSyncOffline, discoSyncOnline };