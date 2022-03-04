// let DB = null;
// const version = 1;
// const databaseName = 'notesDB';
// const storeName = 'notesStore';
// const keyPath = '_id';

// const dbGlobals = {
//   DB: null,
//   version: 1,
//   databaseName: 'notesDB',
//   storeName: 'notesStore',
//   keyPath: '_id'
// }

import dbGlobals from './dbGlobals';

//open Database
function openDB (callback) {
  let req = indexedDB.open(dbGlobals.databaseName, dbGlobals.version);
  console.log("this is the database name and database store :", dbGlobals.databaseName, dbGlobals.storeName);
  req.onerror = (err) => {
    //could not open db
    console.log('Error: ', err);
    dbGlobals.DB = null;
  };
  req.onupgradeneeded = (event) => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains(dbGlobals.storeName)) {
      db.createObjectStore(dbGlobals.storeName, {
        keyPath: dbGlobals.keyPath,
      });
    }
  };
  req.onsuccess = (event) => {
    dbGlobals.DB = event.target.result;
    console.log(dbGlobals.DB)
    console.log('db opened and upgraded');
    if (callback) {
      callback();
    }
  };
};


export { openDB, dbGlobals }