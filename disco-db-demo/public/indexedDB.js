// let DB = null;
// const version = 1;
// const databaseName = 'notesDB';
// const storeName = 'notesStore';
// const keyPath = '_id';

const dbGlobals = {
  DB: null,
  version: 1,
  databaseName: 'notesDB',
  storeName: 'notesStore',
  keyPath: '_id'
}

// import dbGlobals from './dbGlobals';

//open Database
function openDB (callback) {
  let req = indexedDB.open(dbGlobals.databaseName, dbGlobals.version)
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
    return dbGlobals.DB;
    };
};

function dbAdd(dataObject) {
  if (dataObject && dbGlobals.DB) {
    let tx = dbGlobals.DB.transaction(dbGlobals.storeName, 'readwrite');
    tx.onerror = (err) => {
      console.log('failed transaction');
    };
    tx.oncomplete = (event) => {
      console.log('data saved successfully');
    };
    let store = tx.objectStore(dbGlobals.storeName);
    let req = store.put(dataObject);

    req.onsuccess = (event) => {
      //will trigger tx.oncomplete next
    };
  } else {
    console.log('no data was provided');
  }
}

function dbDeleteAll() {
  if (dbGlobals.DB) {
    let tx = dbGlobals.DB.transaction(dbGlobals.storeName, 'readwrite');
    tx.onerror = (err) => {
      console.log('failed transaction');
    };
    tx.oncomplete = (event) => {
      console.log('transaction success');
    };
    let store = tx.objectStore(dbGlobals.storeName);
    const req = store.clear();
    req.onsuccess = (event) => {
      //will trigger tx.oncomplete
    };
  } else {
    console.log('DB is closed');
  }
}


export { openDB, dbAdd, dbDeleteAll, dbGlobals }