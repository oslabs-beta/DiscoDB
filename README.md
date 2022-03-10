<p align="center">
  <img src="https://media.discordapp.net/attachments/940293533359824931/951328016083075092/DiscoDB-logos.jpeg?width=650&height=650" alt="DiscoDB Logo"/>
</p>

<!-- [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/oslabs-beta/discodb/pulls)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/oslabs-beta/SocketLeague/main/client-package?color=yellow)
![GitHub package.json version](https://img.shields.io/github/package-json/v/oslabs-beta/SocketLeague/main/server-package?color=steelblue) -->

# DiscoDB: 

## Table of Contents

- [Features](#features)

- [Installation](#installation)

- [How It works](#how-it-works)

- [Demo Apps](#demo-apps)

- [Contributing](#contributing)

- [Authors](#authors)

## Features

- A minimalist IndexedDB (IDB) wrapper and syncing solution for when your application disco(nnects) from the network.
- Lightweight with zero dependencies.
- Functionalities can be implemented via Service Workers with minimal modification to client side code
- Supports syncing IDB with NoSQL databases (MongoDB) with a unique keypath
- Promise based wrapper for IDB to perform local CRUD operations while offline to provide seamless UX
- Action Queue 
- Automatic detection of network status to 

<br>
<details>
    <summary>Showcase</summary>

  <details>
    <summary>Offline Capabilities</summary>

  ![Offline](https://discodb.dev/wp-content/uploads/2022/03/Offline_capability2.gif)
  </details>

  <details>
    <summary>Dynamic Offline Data</summary>

  ![Dynamic](https://discodb.dev/wp-content/uploads/2022/03/indexedDB_update.gif)
  </details>

  <details>
    <summary>Custom Action Queue</summary>

  ![Sync](https://discodb.dev/wp-content/uploads/2022/03/actionqueue.gif)
  </details>
</details>
<br>

## Installation

```bash
npm install discodb
```
### Import the Library into the Service Worker
Assuming a bundler such as wepack, Rollup, etc is used:
```js
import { discoConnect, discoSyncToServer, discoSyncOffline, discoSyncOnline, onlineUrlArr, offlineUrlArr, dbGlobals, idbPromise } from 'discodb';
```
When registering the service worker, pass in an option object with property ``type:'module'``
```js
if("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
       navigator.serviceWorker.register("sw.js", {type: 'module'})
```
## How It works

### Setting up the Config File
Our library requires some minimal configuration. In the root directory of the project, create a file labeled ``discodb.config.js`` and update the values of the corresponding key property.
```js
// discodb.config.js

const dbGlobals = 
{
  version: "IDB version",
  databaseName: "IDB database name",
  storeName: "IDB Object Store name",
  syncQueue: "IDB Object Store Queue name",
  keypath: "Primary key of main database table",
// Add all routes to be intercepted
  onlineRoutes: [
    {
      url: "",
    }
  ],
  offlineRoutes: [
    {
      url: " ", 
    },
    {
      url: " ",
    }
  ]
}

export { dbGlobals };

```

### DiscoSyncOffline & DiscoSyncOnline

``discoSyncOffline(method, url, clonedRequest)`` 

``discoSyncOffline`` is a request reducer that intercepts fetch requests and implements CRUD operations on the passed in endpoints.

``discoSyncOffline`` takes in three parameters, the method and url of the ``event.request`` as well as a clone of the ``event.request``, utilizing the ``.clone()`` method.

Under the hood, ``discoSyncOffline`` will check the url, and perform a **GET**, **DELETE**, or **PATCH** operation with indexedDB and return a new **Response** object back to the client.


``discoSyncOnline(method, url, clonedResponse)``

``discoSyncOnline`` establishes a connection to indexedDB and populates the object store with your noSQL data.

``discoSyncOnline`` takes in three paramaters, the method and url of the ``event.request`` as well as a clone of the ``response`` that was sent back from the server. 

Under the hood, ``discoSyncOnline`` will check the url passed in and first clear indexedDB of any stale data, and repopulate with the response body that it received back from the server.


### Initializing IndexedDB Database
To initialize an idb with attributes passed into ```discodb.config.js```, invoke ``` discoConnect()``` when installing the service worker
```js
self.addEventListener('install', event => {
  discoConnect();
});
```

### Intercepting Event Requests 
```discoSyncOffline()``` and ```discoSyncOnline()``` require the following to be true:
1. Network falling back to cache Service Worker strategy: [Documentation](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)
2. Response and Request objects passed into ```discoSyncOffline()``` and ```discoSyncOnline()``` respectively will need to be a cloned version.

```onlineUrlArr``` and ```offlineUrlArr``` will include the ```onlineRoutes``` and ```offlineRoutes``` from  ```discodb.config.js ``` respectively in an Array.
```js
self.addEventListener('fetch', event => {
  // clone the request
  const reqClone = event.request.clone();
  event.respondWith(
    // network first approach
    fetch(event.request)
    .then((response) => {
      // clone the response
      const resCloneCache = response.clone();
      const resCloneDB = response.clone()
      // open caches and store resCloneCache
      // ...
      // intercept routes included in onlineUrlArr
      if (onlineUrlArr.includes(url)){
        discoSyncOnline(method, url, resCloneDB);
      }
      return response;
    })
    // Fallback to Cache
    .catch((err) => {
      //invoke offline reducer to perform RUD functions to indexedDB
      if (offlineUrlArr.includes(url)){
        return discoSyncOffline(method, url, reqClone); 
      }
      // return cache
      // ...
    })
  )
});
```

### Implementing the Action Queue Synchonization
You can also use the synchronization queue separately from our reducers! Make sure to ``discoConnect()`` to the IDB database and have your configuration file ready. 
1. Set up an event handler to listen for "***sync***" and a conditional to catch our tag, "***discoSync***".
1. Request for a synchronization event by registering through the service worker through ``discoRegisterSync()``. By default, the sync tag assigned to the request is '***discoSync***'.
1. Once a sync request has been registered, we now can add an object containing the HTTP request to the Object Store Queue by invoking ``discoAddToQueue(object)``.<br>
    * Object format must contain these properties
    ```js
    {
      url: "Route URL",
      method: "HTTP Method",
      body: "data object from HTTP request" 
      }
    ``` 
1. Now that the Object Store Queue has been populated with HTTP requests, we can send them to the main server! Within the event handler for sync, invoke ``discoSyncToServer()``.
    ```js
    self.addEventListener('sync', (event) => {
      if(event.tag === 'discoSync'){
        discoSyncToServer();
        };
      };
    ```

## Demo App
Our demostration application utilizing this library is a simple note taking app. The demo app relies on service workers intercepting all HTTP requests for both online and offline requests. 

Fork and clone our repository onto your local repository and follow the README in the app. 

## Contributing

We'd love for you to test this library out and submit any issues you encounter. Also feel free to fork to your own repo and submit pull requests!

## Authors
<br>

[Eric Gomez](https://github.com/ergomez0201) | [LinkedIn](https://www.linkedin.com/in/eric-gomez/)
<br>

[Eric McCorkle](https://github.com/ericmccorkle) | [LinkedIn](https://www.linkedin.com/in/eric-mccorkle/)
<br>

[Jackson Tong](https://github.com/jacksonktong) | [LinkedIn](www.linkedin.com/in/jacksonktong)
<br>

[Young Min Lee](https://github.com/youngmineeh) | [LinkedIn](www.linkedin.com/in/youngminlee-)



