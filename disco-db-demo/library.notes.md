Configuration options
indexedDB.js
  dbGlobals
    version? - (may need write logic to control version number)
    databaseName?
    storeName?
    failed_requests?
    keyPath - the unique identified for the dev's hostedDB (Mongo)
  
  dbAdd, dbDeleteAll
    transaction parameter 'readwrite'?
  patchData, deleteData, postData
    url
  syncDataToServer
    headers for Content-Type 

swCacheSite-indexedDB.js
  fetch event listener 
    - event.request.method
    - event.request.url
------------------------------------
Notes.js Component
- determine whether user will need to invoke backgroundSync() in catch block 




Outstanding Questions
  • Is this library specifically for MongoDB/NoSQL or can it also work with SQL databases since the Response data will be the same regardless? Because of the keypath property in the configuration file, our library will only work with NoSQL OR single table SQL databses. 
    - Action queue will work in those above instances. 
  • Configuration file to set up 
    ○ README Would need to specify that user create the config file in a specific spot, likely the root directory or repo 
  • React Hook with the useEffect? Or functions in the component mount and unmount lifecycle events? 
Two possible routes (neither mutually exclusive). We could offer both options. 
1. We provide the developer to use our library's preexisting service worker (network first caching policy, all the logic we have in the swCacheSite-indexedDB.js and indexedDB.js files). This allows the developer to add offline capabilities to their app with very minimal setup. 
2. A developer has an existing service worker in their app and logic in their version of swCacheSite-indexedDB.js. They just want to be able to use the custom iDB functions in their SWs. In this case they would just import some combination of the openDB, dbAdd, dbDeleteAll, patchData, deleteData, postData, syncDataToServer functions. 

Library Structure
  • Brainstorm of setup Config file
    ○ Database schema
      § Don't need to enforce schema for IndexedDB
    ○ Service Worker Registration
      § Opinionated on network first caching strategy? Does our current Service Worker logic in swCacheSite-indexedDB.js require a network-first caching strategy? If so, enforce that strategy. 
      $ Can we allow dev to specify which pages need a network first caching strategy?
      § Does network first strategy only cache pages for Next.js app or will it cache pages for any multi-page app? Any React Router app? Not sure why it woudln't work outside of Next.js
    ○ Service Worker Event Listeners
      § Install and Activate 
        □ Can Install and Activate event listeners be included in library as is? That is, are they generic enough to not need to be customized through any kind of user set up in a config file? 
      § Fetch
        □ Determine how much of this event listener needs to be configured and how much will just be static and configurable through config files. Will the entire event listener need to be set up? How do the custom functions come in?
  • Activation
    ○ Custom hook in root of app with boolean value? Boolean referring to initialization of library? 
    ○ Two custom functions -- activate, deactivate -- 


Hardcoded 
IndexedDB.js urls inside patchData, deleteData, postData