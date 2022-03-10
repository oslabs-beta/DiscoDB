import { 
  discoSyncOffline,
  discoSyncOnline
} from './discoFunctions/discoSync';

import { 
  discoConnect, 
  discoAdd, 
  discoDeleteAll, 
  discoGetAll, 
  discoDeleteOne, 
  discoUpdateOne
} from './discoFunctions/idbOperations';

import {
  discoAddToQueue, 
  discoRegisterSync, 
  discoSyncToServer
} from './discoFunctions/backgroundSync';

export { 
  discoSyncOffline, 
  discoSyncOnline, 
  discoConnect, 
  discoAdd, 
  discoDeleteAll, 
  discoGetAll, 
  discoDeleteOne, 
  discoUpdateOne,
  discoAddToQueue, 
  discoRegisterSync, 
  discoSyncToServer }