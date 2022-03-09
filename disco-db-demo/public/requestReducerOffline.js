import {  openDB, addToSyncQueue, dbGetAll, dbDeleteOne, dbUpdateOne, dbGlobals  } from './indexedDB.js';

//create a request reducer - offline
function requestReducerOffline(method, url, store, eventRequest) {
  // assuming store can be managed by config file and imported into indexedDB.js
  // config.store = store
  switch(method) {
    case 'GET':
      if (dbGlobals.DB) {
        // if store 
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
    // default:
    //   console.log('this method is not configured');
    //   break;
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
      console.log('this url is not configured');
      return caches.match(eventRequest)
        .then(response => {
          console.log('-----------this is in the caches response block: ', eventRequest);
          return response
        })
  }
}

export { requestReducerOffline };