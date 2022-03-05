
const dbGlobals = {
  DB: null,
  version: 9,
  databaseName: 'notesDB',
  storeName: 'notesStore',
  syncQueue: 'Queue',
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
    if (!db.objectStoreNames.contains(dbGlobals.syncQueue)) {
      console.log('Creating Queue store')
      db.createObjectStore(dbGlobals.syncQueue, {
        keyPath: 'id', autoIncrement: true,
      })
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
};

function dbGetAll() {
  return new Promise( (resolve, reject) => {
    if (dbGlobals.DB) {
      let tx = dbGlobals.DB.transaction(dbGlobals.storeName, 'readonly');
      tx.onerror = (err) => {
        console.log('failed transaction');
        reject(err);
      };
      tx.oncomplete = (event) => {
        console.log('transaction success, this is the transaction event: ', event);
        // console.log('this is the scoped variable data, still in the transaction complete: ', data);

      };
      let store = tx.objectStore(dbGlobals.storeName);
      const req = store.getAll();
      console.log('this is inside the dbGetAll function: ', req);
      req.onsuccess = (event) => {
        //will trigger tx.oncomplete
        resolve(event.target.result);
      };
    } else {
      console.log('DB is closed');
    }
  })
}

//Function to Access specific object store in IDB database and start a transaction
function accessObjectStore (storeName, method) {
  return dbGlobals.DB.transaction([storeName], method).objectStore(storeName)
};

function addToSyncQueue (data) {
  //Open a transaction to object store 'Queue' 
  const store = accessObjectStore(dbGlobals.syncQueue, 'readwrite')
  //Add data to object store
  store.add(data)
}

//Function to sync offline requests to database when client is back online
function syncDataToServer() {
  //Create transaction to object store and grab all objects in an ordered array by ID.
  const store = accessObjectStore(dbGlobals.syncQueue, 'readwrite');
  const request = store.getAll();

  request.onsuccess = function (event) {
    const httpQueue = event.target.result;
    //Comes back as an array of objects 
    //Iterate Queue store and initialize Fetch request
    httpQueue.forEach((data) => {
      const { url, method, body } = data
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
      })
    });
  }
  request.onerror = (err) => {
    console.log('Attempt to sync queue failed:', err);
  }
};

export { openDB, dbAdd, dbDeleteAll, addToSyncQueue, syncDataToServer, dbGetAll, dbGlobals }
