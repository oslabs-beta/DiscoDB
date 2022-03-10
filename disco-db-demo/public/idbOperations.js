import { idbPromise, dbGlobals } from './discoGlobals.js';

/**
 * @property {Function} discoConnect Establishes connection to indexedDB & create Object Stores as specified in Configuration.
 * @param {Function} callback 
 *
 */
function discoConnect(callback) {
  return new Promise((resolve, reject) => {
    let req = indexedDB.open(dbGlobals.databaseName, dbGlobals.version)
    req.onerror = (err) => {
      //could not open db
      console.log('Error: ', err);
      idbPromise.DB = null;
      reject(err);
    };
    req.onupgradeneeded = (event) => {
      let db = event.target.result;
      // Database Version Upgraded
      if (!db.objectStoreNames.contains(dbGlobals.storeName)) {
        db.createObjectStore(dbGlobals.storeName, {
          keyPath: dbGlobals.keypath,
        });
      }
      if (!db.objectStoreNames.contains(dbGlobals.syncQueue)) {
        //Creating Object Store for Sync Queue
        db.createObjectStore(dbGlobals.syncQueue, {
          keyPath: 'id', autoIncrement: true,
        })
      }
    };
    req.onsuccess = (event) => {
      idbPromise.DB = event.target.result;
      //Database connected
      if (callback) {
        callback();
      }
      resolve(idbPromise.DB);
      };
  })
};

/**
 * @property {Function} discoAdd Adds an object in to the configured Object Store.
 * @param {Object} dataObject Object data to be stored.
 *
 */
function discoAdd(dataObject) {
  // return new Promise ( (resolve, reject) => {
    if (dataObject && idbPromise.DB) {
      let tx = idbPromise.DB.transaction(dbGlobals.storeName, 'readwrite');

      tx.onerror = (err) => {
        console.log('Error:', err);
        // reject(err);
      };
      tx.oncomplete = (event) => {
        //Data added successfully
      };
      
      let store = tx.objectStore(dbGlobals.storeName);
      let req = store.put(dataObject);

      req.onsuccess = (event) => {
        // const result = event.target.result;
        // resolve(result);
      };
    } else {
      console.log('No data provided.');
    }
  // })
};

/**
 * @property {Function} discoDeleteAll Deletes all properties of the configured Object Store.
 *
 */
function discoDeleteAll() {
  return new Promise( (resolve, reject) => {
    if (idbPromise.DB) {
      let tx = idbPromise.DB.transaction(dbGlobals.storeName, 'readwrite');
      tx.onerror = (err) => {
        console.log('Error:', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        // data deleted successfully 
      };
      let store = tx.objectStore(dbGlobals.storeName);
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
    if (idbPromise.DB) {
      let tx = idbPromise.DB.transaction(dbGlobals.storeName, 'readonly');
      tx.onerror = (err) => {
        console.log('Error: ', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        //Transaction successful, all objects retrieved.
      };
      let store = tx.objectStore(dbGlobals.storeName);
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
    if (idbPromise.DB) {
      let tx = idbPromise.DB.transaction(dbGlobals.storeName, 'readwrite');
      tx.onerror = (err) => {
        console.log('Error: ', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        //Transaction successful
      };
      let store = tx.objectStore(dbGlobals.storeName);
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
    if (idbPromise.DB) {
      let tx = idbPromise.DB.transaction(dbGlobals.storeName, 'readwrite');
      tx.onerror = (err) => {
        console.log('Error: ', err);
        reject(err);
      };
      tx.oncomplete = (event) => {
        //Transaction successful
      };
      let store = tx.objectStore(dbGlobals.storeName);
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

export { discoConnect, discoAdd, discoDeleteAll, discoGetAll, discoDeleteOne, discoUpdateOne }; 