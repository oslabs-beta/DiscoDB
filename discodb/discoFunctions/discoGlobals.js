// import { dbGlobals } from '../../../discodb.config.js'
import { dbGlobals } from './configMap'

const idbPromise = {
  DB: null
}

const onlineUrlArr = [];
dbGlobals.onlineRoutes.forEach(el => {
  onlineUrlArr.push(el.url)
});

const offlineUrlArr = [];
dbGlobals.offlineRoutes.forEach(el => {
  offlineUrlArr.push(el.url);
});

export { dbGlobals, idbPromise, onlineUrlArr, offlineUrlArr }