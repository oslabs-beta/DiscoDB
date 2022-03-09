import {  openDB, dbAdd, dbDeleteAll, dbGlobals  } from './indexedDB.js';

function requestReducerOnline(method, url, store, clonedResponse) {
  switch(method) {
    case 'GET':
      const resCloneDB = clonedResponse;
      resCloneDB.json().then(data => {
        console.log('this is the rescloneDB: ', data)
        //delete existing indexedDB data
        if (dbGlobals.DB) {
          dbDeleteAll();
        } else {
          openDB( () => {
            dbDeleteAll();
          })
        }
        //populate indexedDB here
        data.data.forEach( note => {
          console.log('this is the note object: ', note);
          if (dbGlobals.DB) {
            dbAdd(note);
          } else {
            openDB( () => {
              dbAdd(note);
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

export { requestReducerOnline }