//Configuration File Setup
/*
//Config file//
version: config required
databaseName: default to 'database', but user should specify. Default values may be more difficult to update functions with. Should require it
storeName: default to 'objectStore', but user should specify. Default values may be more difficult to update functions with. Should require it
syncQueue: default to 'Queue', but user should specify. Default values may be more difficult to update functions with. Should require it
keyPath: required, user needs to specify

const config = {
  version: '',
  databaseName: '',
  storeName: '',
  syncQueue: '',
  keypath: (their main database primary ID)
}

// globals in this file//
DB assigned to null? 

import { version, databseName, storeName, syncQueue, keyPath } from './discodb.config.json'
*/
const version = 9;
const databaseName = 'notesDB';
const storeName = 'notesStore';
const syncQueue = 'Queue';
const keyPath = '_id';

// determine final 
let DB = null;


// import dbGlobals from './dbGlobals';

/**
 * @property {Function} discoConnect Establishes connection to indexedDB & create Object Stores as specified in Configuration.
 * @param {Function} callback 
 *
 */
function discoConnect(callback) {
  return new Promise((resolve, reject) => {
    let req = indexedDB.open(databaseName, version)
    req.onerror = (err) => {
      //could not open db
      console.log('Error: ', err);
      DB = null;
      reject(err);
    };
    req.onupgradeneeded = (event) => {
      let db = event.target.result;
      // Database Version Upgraded
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {
          keyPath: keyPath,
        });
      }
      if (!db.objectStoreNames.contains(syncQueue)) {
        //Creating Object Store for Sync Queue
        db.createObjectStore(syncQueue, {
          keyPath: 'id', autoIncrement: true,
        })
      }
    };
    req.onsuccess = (event) => {
      DB = event.target.result;
      //Database connected
      if (callback) {
        callback();
      }
      resolve(DB);
      };
  })
};

/**
 * @property {Function} discoAdd Adds an object in to the configured Object Store.
 * @param {Object} dataObject Object data to be stored.
 *
 */
function discoAdd(dataObject) {
  return new Promise ( (resolve, reject) => {
    if (dataObject && DB) {
      let tx = DB.transaction(storeName, 'readwrite');

      tx.onerror = (err) => {
        console.log('Error:', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        //Data added successfully
      };
      
      let store = tx.objectStore(storeName);
      let req = store.put(dataObject);

      req.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result);
      };
    } else {
      console.log('No data provided.');
    }
  })
};

/**
 * @property {Function} discoDeleteAll Deletes all properties of the configured Object Store.
 *
 */
function discoDeleteAll() {
  return new Promise( (resolve, reject) => {
    if (DB) {
      let tx = DB.transaction(storeName, 'readwrite');
      tx.onerror = (err) => {
        console.log('Error:', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        // data deleted successfully 
      };
      let store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result);
      };
    } else {
      console.log('DB is not connected');
    }
  })
};

/**
 * @property {Function} discoGetAll Gets all properties saved on the configured Object Store.
 * @return {Array} array of objects containing all properties in the Object Store.
 */
function discoGetAll() {
  return new Promise((resolve, reject) => {
    if (DB) {
      let tx = DB.transaction(storeName, 'readonly');
      tx.onerror = (err) => {
        console.log('Error: ', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        //Transaction successful, all objects retrieved.
      };
      let store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result);
      };
    } else {
      console.log('DB is not connected');
    }
  })
}

/**
 * @property {Function} discoDeleteOne Deletes one property on the configured Object Store.
 * @param {String} id The id of the object on the configured Object Store  * 
 */
function discoDeleteOne(id) {
  return new Promise( (resolve, reject) => {
    if (DB) {
      let tx = DB.transaction(storeName, 'readwrite');
      tx.onerror = (err) => {
        console.log('Error: ', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        //Transaction successful
      };
      let store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result);
      };
    } else {
      console.log('DB is not connected');
    }
  })
}

/**
 * @property {Function} discoUpdateOne Updates one property on the configured Object Store.
 * @param {Object} dataObject The req body object on the configured Object Store  
 * 
 */
function discoUpdateOne(dataObject) {
  return new Promise ( (resolve, reject) => {
    if (DB) {
      let tx = DB.transaction(storeName, 'readwrite');
      tx.onerror = (err) => {
        console.log('Error: ', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        //Transaction successful
      };
      let store = tx.objectStore(storeName);
      const req = store.put(dataObject);
      req.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result);
      };
    } else {
      console.log('DB is not connected');
    }
  })
};


export { discoConnect, discoAdd, discoDeleteAll, discoGetAll, discoDeleteOne, discoUpdateOne }