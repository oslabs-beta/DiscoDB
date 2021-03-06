const dbGlobals = 
{
  "version": 9,
  "databaseName": "notesDB",
  "storeName": "notesStore",
  "syncQueue": "Queue",
  "keypath": "_id",
  "onlineRoutes": [
    {
      "url": "http://localhost:3000/user/load",
    }
  ],
  "offlineRoutes": [
    {
      "url": "http://localhost:3000/user/load", 
    },
    {
      "url": "http://localhost:3000/user/notes",
    }
  ]
}


export { dbGlobals };