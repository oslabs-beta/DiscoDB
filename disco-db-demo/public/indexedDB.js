let DB = null;
const version = 1;
const databaseName = 'notesDB';
const storeName = 'notesStore';
const keyPath = '_id';

//open Database
function openDB (callback) {
  let req = indexedDB.open(databaseName, version);
  req.onerror = (err) => {
    //could not open db
    console.log('Error: ', err);
    DB = null;
  };
  req.onupgradeneeded = (event) => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, {
        keyPath: keyPath,
      });
    }
  };
  req.onsuccess = (event) => {
    DB = event.target.result;
    console.log('db opened and upgraded');
    if (callback) {
      callback();
    }
  };
};

export { openDB }