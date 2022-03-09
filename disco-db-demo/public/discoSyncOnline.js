import {  discoConnect, discoAdd, discoDeleteAll, dbGlobals  } from './idbOperations';

/**
 * @property {Function} discoSyncOnline Establishes connection to indexedDB & create Object Stores as specified in Configuration.
 * @param {String} method This is the method property of the intercepted fetch request
 * @param {String} url This is the url property of the intercepted fetch request
 * @param {String} store This is the store property associated with the url provided in the config file
 * @param {Request} clonedResponse This is the cloned version of the intercepted fetch response
 *
 */
function discoSyncOnline(method, url, store, clonedResponse) {
  switch(method) {
    case 'GET':
      const resCloneDB = clonedResponse;
      resCloneDB.json().then(data => {
        console.log('this is the rescloneDB: ', data)
        //delete existing indexedDB data
        if (dbGlobals.DB) {
          discoDeleteAll();
        } else {
          discoConnect( () => {
            discoDeleteAll();
          })
        }
        //populate indexedDB here
        data.data.forEach( note => {
          console.log('this is the note object: ', note);
          if (dbGlobals.DB) {
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

export { discoSyncOnline }