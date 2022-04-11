(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myLibrary = {}));
})(this, (function (exports) { 'use strict';

  const fs = require('fs');
  const path = require('path');
  // import * as fs from 'fs';
  // import path from 'path';

  // import { dbGlobals } from './discodb.config.js'

  function find(targetPath) {
    return findStartingWith(path.dirname(require.main.filename), targetPath);
  }

  function findStartingWith(start, target) {
    const file = path.join(start, target);
    try {
      data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      if (path.dirname(start) !== start) {
        return findStartingWith(path.dirname(start), target);
      }
    }
  }

  // const dbGlobals = JSON.parse(userConfig);
  // console.log(dbGlobals)

  const dbGlobals = find('discodb.config.json');
  console.log(dbGlobals);

  // import { dbGlobals } from '../../../discodb.config.js'

  const idbPromise = {
    DB: null
  };

  const onlineUrlArr = [];
  dbGlobals.onlineRoutes.forEach(el => {
    onlineUrlArr.push(el.url);
  });

  const offlineUrlArr = [];
  dbGlobals.offlineRoutes.forEach(el => {
    offlineUrlArr.push(el.url);
  });

  /**
   * @property {Function} discoConnect Establishes connection to indexedDB & create Object Stores as specified in Configuration.
   * @param {Function} callback 
   *
   */
  function discoConnect(callback) {
    return new Promise((resolve, reject) => {
      let req = indexedDB.open(dbGlobals.databaseName, dbGlobals.version);
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
          });
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
  }
  /**
   * @property {Function} discoAdd Adds an object in to the configured Object Store.
   * @param {Object} dataObject Object data to be stored.
   *
   */
  function discoAdd(dataObject) {
     return new Promise ( (resolve, reject) => {
      if (dataObject && idbPromise.DB) {
        let tx = idbPromise.DB.transaction(dbGlobals.storeName, 'readwrite');

        tx.onerror = (err) => {
          console.log('Error:', err);
          reject(err);
        };
        tx.oncomplete = (event) => {
          //Data added successfully
        };
        
        let store = tx.objectStore(dbGlobals.storeName);
        let req = store.put(dataObject);

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
  }
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
  }

  /**
   * @property {Function} accessObjectStore Access object store in IDB database and start a transaction
   * @param {String} storeName Object store to be accessed for transaction  
   * @param {String} method  Method for transaction, "readwrite, readonly"
   * @return {Object} Accessed Object store Object 
   */
  function accessObjectStore (storeName, method) {
    return idbPromise.DB.transaction([storeName], method).objectStore(storeName)
  }/**
   * @property {Function} discoAddToQueue Adds Object into Object store
   * @param {Object} dataObject Objected to be added to Object store
   *  
   */
  function discoAddToQueue (dataObject) { 
    //Open a transaction to object store 'Queue' 
    const store = accessObjectStore(dbGlobals.syncQueue, 'readwrite');
    //Add data to object store
    store.add(dataObject);
  }/**
   * @property {Function} discoRegisterSync Request a "Sync" event to reattempt request when network is online.
   * 
   */
  async function discoRegisterSync() {
    try {
      const register = await registration.sync.register('discoSync');
      return register;
    } catch(error) {
      console.log('Error:' , error);
      return error;
    }
  }
  /**
   * @property {Function} discoSyncToServer Accesses the Queue Object Store and re-sends all requests saved in application/json.
   * 
   */
  function discoSyncToServer() {
    const store = accessObjectStore(dbGlobals.syncQueue, 'readwrite');
    const request = store.getAll();

    request.onsuccess = function (event) {
      const httpQueue = event.target.result;
      //Comes back as an array of objects 
      //Iterate Queue store and initialize Fetch request
      httpQueue.forEach((data) => {
        const { url, method, body } = data;
        const headers = {'Content-Type': 'application/json'};
        fetch(url, {
          method: method,
          headers: headers,
          body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .then((res) => {
          //Previous transaction was closed due to getAll()
          //Reopen object store and delete the corresponding object on successful HTTP request
          const newStore = accessObjectStore(dbGlobals.syncQueue, 'readwrite');
          newStore.delete(data.id);
        })
        .catch((error) => {
          console.error('Failed to sync data to server:', error);
          throw error
        });
      });
    };
    request.onerror = (err) => {
      console.log('Attempt to sync queue failed:', err);
    };
  }

  /**
   * @property {Function} discoSyncOffline Executes different IndexedDB logic based on the value of passed in method
   * @param {String} method This is the method property of the intercepted fetch request
   * @param {String} url This is the url property of the intercepted fetch request
   * @param {String} store This is the store property associated with the url provided in the config file
   * @param {Request} eventRequest This is the cloned version of the intercepted fetch request
   *
   */
  function discoSyncOffline(method, url, clonedRequest) {
    switch(method) {
      case 'GET':
        if (idbPromise.DB) {
          return discoGetAll().then((data) => {
            const responseBody = { data };
            const IDBData = new Response(JSON.stringify(responseBody));
            return IDBData;
          })
        } else {
          return discoConnect(() => {
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
          discoRegisterSync();
          discoAddToQueue(reqBody);
          const keypath = dbGlobals.keypath;
          const id = data[keypath];
          discoDeleteOne(id);
          const deleteResponse = new Response(JSON.stringify({}));
          return deleteResponse;
        })
        .catch( err => {
          console.log('Error in DELETE block: ', err);
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
          const keypath = dbGlobals.keypath;
          data[keypath];
          discoUpdateOne(data);
          // returns empty object to trigger rerender in our app 
          const patchResponse = new Response(JSON.stringify({}));
          return patchResponse;
        }) 
      default:
        return caches.match(clonedRequest)
          .then(response => {
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
          if (idbPromise.DB) {
            discoDeleteAll();
          } else {
            discoConnect( () => {
              discoDeleteAll();
            });
          }
          //populate indexedDB here
          data.data.forEach( note => {
            if (idbPromise.DB) {
              discoAdd(note);
            } else {
              discoConnect(() => {
                discoAdd(note);
              });
            }
          });
        });
        break;
    }
  }

  exports.discoAdd = discoAdd;
  exports.discoAddToQueue = discoAddToQueue;
  exports.discoConnect = discoConnect;
  exports.discoDeleteAll = discoDeleteAll;
  exports.discoDeleteOne = discoDeleteOne;
  exports.discoGetAll = discoGetAll;
  exports.discoRegisterSync = discoRegisterSync;
  exports.discoSyncOffline = discoSyncOffline;
  exports.discoSyncOnline = discoSyncOnline;
  exports.discoSyncToServer = discoSyncToServer;
  exports.discoUpdateOne = discoUpdateOne;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=bundle.umd.js.map
