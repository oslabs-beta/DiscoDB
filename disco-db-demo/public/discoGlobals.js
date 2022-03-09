// const configVariables = require('./configMap.js');
import dbGlobals from './configMap.js';
const idbPromise = {
  DB: null
}

const onlineUrlStoreMap = new Map();
dbGlobals.onlineRoutes.forEach(el => {
  onlineUrlStoreMap.set(el.url, el.store);
});

const offlineUrlStoreMap = new Map();
dbGlobals.offlineRoutes.forEach(el => {
  offlineUrlStoreMap.set(el.url, el.store);
});

//  module.exports = { idbPromise, onlineUrlStoreMap, offlineUrlStoreMap };

//  module.exports = {
//    DB: null,
   
//  }

export { dbGlobals, idbPromise, onlineUrlStoreMap, offlineUrlStoreMap }