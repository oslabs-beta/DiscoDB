
// import { storeName, syncQueue } from './discodb.config.json'

const version = 9;
const databaseName = 'notesDB';
const storeName = 'notesStore';
const syncQueue = 'Queue';
const keyPath = '_id';


/**
 * @property {Function} accessObjectStore Access object store in IDB database and start a transaction
 * @param {String} storeName Object store to be accessed for transaction  
 * @param {String} method  Method for transaction, "readwrite, readonly"
 * @return {Object} Accessed Object store Object 
 */
function accessObjectStore (storeName, method) {
  return DB.transaction([storeName], method).objectStore(storeName)
};
/**
 * @property {Function} discoAddToQueue Adds Object into Object store
 * @param {Object} dataObject Objected to be added to Object store
 *  
 */
function discoAddToQueue (dataObject) { 
  //Open a transaction to object store 'Queue' 
  const store = accessObjectStore(syncQueue, 'readwrite')
  //Add data to object store
  store.add(dataObject)
};
/**
 * @property {Function} discoRegisterSync Request a "Sync" event to reattempt request when network is online.
 * 
 */
async function discoRegisterSync() {
  try {
    const register = await registration.sync.register('failed_requests');
    return register;
  } catch(error) {
    console.log('Error:' , error);
    return error;
  }
};

/**
 * @property {Function} discoSyncToServer Accesses the Queue Object Store and re-sends all requests saved in application/json.
 * 
 */
function discoSyncToServer() {
  const store = accessObjectStore(syncQueue, 'readwrite');
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
        const newStore = accessObjectStore(syncQueue, 'readwrite');
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

export { discoAddToQueue, discoRegisterSync, discoSyncToServer }; 