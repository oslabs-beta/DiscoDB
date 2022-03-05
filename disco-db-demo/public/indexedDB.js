
const dbGlobals = {
  DB: null,
  version: 8,
  databaseName: 'notesDB',
  storeName: 'notesStore',
  failed_requests: 'failed_requests',
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
    if (!db.objectStoreNames.contains(dbGlobals.failed_requests)) {
      console.log('Creating failed_request store')
      db.createObjectStore(dbGlobals.failed_requests, {
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

//Function to Access specific object store in IDB database and start a transaction
function accessObjectStore (storeName, method) {
  return dbGlobals.DB.transaction([storeName], method).objectStore(storeName)
};

function patchData (data) {
  //Open a transaction into store 'failed-requests' 
  //Saves the persisting data in payload key
  //URL and method to match type of request
  const store = accessObjectStore(dbGlobals.failed_requests, 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'PATCH'})
}

function deleteData (data) {
  //Open a transaction into store 'failed-requests' 
  const store = accessObjectStore(dbGlobals.failed_requests, 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'DELETE'})
}

function postData (data) {
  //Open a transaction into store 'failed-requests' 
  const store = accessObjectStore(dbGlobals.failed_requests, 'readwrite')
  store.add({url: '/user/notes', payload: data, method: 'POST'})
}

//Function to sync offline requests to database when client is back online
function syncDataToServer() {
  //Create transaction to object store and grab all objects in an ordered array by ID.
  const store = accessObjectStore(dbGlobals.failed_requests, 'readwrite');
  const request = store.getAll();

  request.onsuccess = async function (event) {
    const failedRequests = event.target.result;
    //Comes back as an array of objects 
    //Iterate through saved failed HTTP requests and creates a format to recreate a Fetch Request.
    failedRequests.forEach((data) => {
      const url = data.url;
      const method = data.method;
      const body = JSON.stringify(data.payload)
      const headers = {'Content-Type': 'application/json'};
      fetch(url, {
        method: method,
        headers: headers,
        body: body
      })
      .then((res) => res.json())
      .then((res) => {
        //Previous transaction was closed due to getAll()
        //Reopen object store and delete the corresponding object on successful HTTP request
        const newStore = accessObjectStore(dbGlobals.failed_requests, 'readwrite');
        newStore.delete(data.id);
      })
      .catch((error) => {
        console.error('Failed to sync data to server:', error);
        throw error
      })
    });
  }
};

export { openDB, dbAdd, dbDeleteAll, patchData, deleteData, postData, syncDataToServer, dbGlobals }